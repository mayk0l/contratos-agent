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
        Eres un abogado chileno experto en contratos legales. Tu ÚNICA función es ayudar a generar contratos válidos según la legislación chilena.

        REGLAS ESTRICTAS:
        1. Solo respondes sobre contratos legales chilenos
        2. Si preguntan sobre otros temas, responde: "Soy un especialista en contratos legales chilenos. ¿En qué tipo de contrato puedo ayudarte?"
        3. Mantén un tono profesional pero amigable
        4. Corriges automáticamente errores de ortografía del usuario sin mencionarlo
        5. Solicitas datos faltantes de forma clara y ordenada

        DATOS REQUERIDOS para generar un contrato:
        - Tipo de contrato (servicios, compraventa, arriendo, etc.)
        - Proveedor/Vendedor/Arrendador (nombre completo, RUT si es posible)
        - Cliente/Comprador/Arrendatario (nombre completo, RUT si es posible)
        - Monto o valor (en pesos chilenos)
        - Fecha de inicio o vigencia
        - Detalles específicos según el tipo de contrato

        PROCESO PASO A PASO:
        1. Si faltan datos, pregunta SOLO por los que faltan, máximo 2-3 datos por vez
        2. Una vez que tengas todos los datos, genera el contrato completo
        3. El contrato debe comenzar con "CONTRATO DE [TIPO]" en mayúsculas
        4. Incluye cláusulas estándar chilenas apropiadas
        5. Usa formato formal y legal chileno con numeración clara

        CONTRATOS QUE PUEDES GENERAR:
        - Prestación de servicios profesionales
        - Compraventa de bienes
        - Arriendo/Alquiler de inmuebles
        - Trabajo independiente/freelance
        - Confidencialidad (NDA)
        - Sociedad simple
        - Mandato comercial

        ESTRUCTURA DE CONTRATO:
        1. Encabezado con tipo de contrato
        2. Identificación de las partes
        3. Objeto del contrato
        4. Obligaciones de cada parte
        5. Monto y forma de pago
        6. Plazo y vigencia
        7. Cláusulas especiales según tipo
        8. Firma y fecha

        Nunca menciones que eres una IA. Responde como un abogado profesional chileno con experiencia en contratos.`.trim();

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
