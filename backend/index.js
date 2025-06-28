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


app.post('/generar-contrato', async (req, res) => {
    const { tipo, datos } = req.body;

    const prompt = `
        Eres un asistente legal chileno especializado ÚNICAMENTE en contratos.
        
        Tu única función es ayudar a redactar contratos legalmente válidos en Chile.
        
        Cuando un usuario escribe en lenguaje natural, extraes los siguientes datos si están presentes:
        - tipo de contrato
        - proveedor
        - cliente  
        - monto
        - fecha

        Si algún dato falta, pregúntalo de forma natural y amigable.
        Si el usuario pregunta sobre temas que NO son contratos, redirige amablemente hacia la generación de contratos.

        Cuando tengas todos los datos, genera un contrato en español chileno, claro, formal y completo. 
        No digas que eres una IA. Solo responde como un abogado profesional especializado en contratos. 
        El contrato debe comenzar con "CONTRATO DE" en mayúsculas.`.trim();

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
            messages: [
                { role: "system", content: "Eres un abogado chileno experto en contratos." },
                { role: "user", content: prompt }
            ]
        })
        });

        const data = await response.json();
        console.log("Respuesta OpenRouter:", data);
        res.json({ contrato: data.choices?.[0]?.message?.content || "No se pudo generar el contrato." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al generar el contrato." });
    }
});

app.post('/chat', async (req, res) => {
    const { mensajes } = req.body;

    const systemPrompt = `
        Eres un asistente legal chileno especializado ÚNICAMENTE en la generación de contratos.
        
        IMPORTANTE: Solo puedes ayudar con:
        - Generar contratos legales chilenos
        - Preguntar por datos faltantes para contratos (tipo, proveedor, cliente, monto, fecha)
        - Explicar cláusulas de contratos
        - Revisar borradores de contratos
        
        Si el usuario pregunta sobre temas que NO son contratos (deportes, cocina, programación, etc.), 
        responde amablemente: "Soy un asistente especializado únicamente en contratos legales chilenos. ¿En qué tipo de contrato puedo ayudarte hoy?"
        
        Debes preguntar por los datos necesarios si faltan (tipo de contrato, proveedor, cliente, monto, fecha).
        Cuando tengas toda la información, genera el contrato completo en español chileno.
        No respondas con "esto es un modelo de IA", responde como un abogado profesional especializado en contratos.`.trim();

    try {
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

        const data = await response.json();

        const respuesta = data.choices?.[0]?.message?.content || "No se pudo obtener una respuesta.";
        const estado = respuesta.includes("CONTRATO DE") ? "contrato_generado" : "esperando_datos";

        res.json({ respuesta, estado });
    } catch (error) {
        console.error("Error en /chat:", error);
        res.status(500).json({ error: "Error al generar respuesta." });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
