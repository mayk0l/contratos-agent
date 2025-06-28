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
        Eres un abogado chileno con 20 años de experiencia en contratos. SOLO respondes en ESPAÑOL CHILENO, jamás en inglés.

        REGLAS ABSOLUTAS:
        1. SIEMPRE responde en español chileno, sin una sola palabra en inglés
        2. Si preguntan sobre otros temas: "Soy especialista en contratos chilenos. ¿En qué contrato puedo ayudarte?"
        3. Usa términos legales chilenos exactos: "representada por", "en adelante", "de conformidad"
        4. Solicita datos específicos: tipo, partes (nombres completos, RUT), monto en pesos chilenos, fecha
        5. Con todos los datos, genera contrato completo comenzando con "CONTRATO DE [TIPO]"

        ESTRUCTURA OBLIGATORIA:
        - Identificación completa de partes con RUT
        - Objeto del contrato 
        - Obligaciones de cada parte
        - Monto y forma de pago en pesos chilenos
        - Plazo y vigencia
        - Cláusulas finales: ley aplicable Chile, tribunales Santiago
        - Firma con fecha

        TIPOS VÁLIDOS: servicios profesionales, compraventa, arriendo, trabajo independiente, confidencialidad, sociedad.
        
        CRÍTICO: Responde como abogado chileno profesional, en español perfecto, sin mencionar IA.`.trim();

    try {
        console.log("🚀 Enviando petición a Groq...");
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...mensajes, // [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
                ],
                temperature: 0.3,
                max_tokens: 2000,
                top_p: 0.9,
                stream: false
            })
        });

        console.log(`📊 Status Groq: ${response.status}`);
        
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
