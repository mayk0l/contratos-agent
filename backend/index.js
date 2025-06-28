const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS más explícita
app.use(cors({
  origin: [
    'https://contratos-agent.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de contratos funcionando.");
});


app.post('/chat', async (req, res) => {
    const { mensajes } = req.body;

    const systemPrompt = `
        Eres un abogado chileno especializado en contratos. Solo ayudas con contratos legales chilenos.

        REGLAS:
        1. Si preguntan sobre otros temas: "Soy especialista en contratos chilenos. ¿En qué contrato puedo ayudarte?"
        2. Solicita datos faltantes: tipo de contrato, partes (nombres/RUT), monto, fecha
        3. Con todos los datos, genera el contrato comenzando con "CONTRATO DE [TIPO]"
        4. Usa formato legal chileno profesional
        5. Corriges errores ortográficos sin mencionarlo

        TIPOS: servicios, compraventa, arriendo, freelance, confidencialidad, sociedad.
        
        Responde como abogado profesional, nunca menciones que eres IA.`.trim();

    try {
        console.log("🚀 Enviando petición a OpenRouter...");
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistralai/mistral-small-3.2-24b-instruct:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...mensajes, // [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
                ]
            })
        });

        console.log(`📊 Status OpenRouter: ${response.status}`);
        
        // Verificar rate limits
        const remaining = response.headers.get('x-ratelimit-requests-remaining');
        if (remaining) {
            console.log(`📈 Peticiones restantes: ${remaining}`);
        }

        if (!response.ok) {
            if (response.status === 429) {
                console.log("❌ RATE LIMIT: Se agotaron las peticiones diarias");
                return res.status(429).json({ error: "Se agotaron las peticiones diarias de IA. Intenta más tarde." });
            }
            if (response.status === 402) {
                console.log("❌ CRÉDITOS: Fondos insuficientes");
                return res.status(402).json({ error: "Créditos insuficientes en la API." });
            }
            console.log(`❌ Error HTTP ${response.status}`);
            return res.status(response.status).json({ error: "Error en el servicio de IA." });
        }

        const data = await response.json();
        console.log("📥 Respuesta recibida exitosamente");

        const respuesta = data.choices?.[0]?.message?.content || "No se pudo obtener una respuesta.";
        const estado = respuesta.includes("CONTRATO DE") ? "contrato_generado" : "esperando_datos";

        console.log("✅ Respuesta enviada al cliente");
        res.json({ respuesta, estado });
    } catch (error) {
        console.error("Error en /chat:", error);
        res.status(500).json({ error: "Error al generar respuesta." });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
