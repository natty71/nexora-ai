
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors({
  origin: "https://natty71.github.io"
}));

app.use(express.json({ limit: "20kb" }));

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
console.log(
  "OPENAI_API_KEY cargada:",
  Boolean(process.env.OPENAI_API_KEY),
  "Longitud:",
  process.env.OPENAI_API_KEY?.length || 0
);
app.get("/", (req, res) => {
  res.json({
    name: "Nexora AI",
    status: "online",
    message: "El cerebro de Nexora está funcionando."
  });
});

app.post("/chat", async (req, res) => {
  try {
    const question = req.body.message;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.length > 4000
    ) {
      return res.status(400).json({
        error: "Escribe una pregunta válida."
      });
    }

    const response = await ai.responses.create({
      model: "gpt-5.5",
      instructions:
        "Eres Nexora AI, un asistente amable en español. " +
        "Ayudas con preguntas, tareas escolares, traducciones " +
        "y ejercicios. Explicas de forma clara y educativa.",
      input: question.trim()
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("Error al consultar la IA:", error.message);

    res.status(500).json({
      error: "No pude responder ahora. Inténtalo nuevamente."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Nexora AI está funcionando en el puerto " + PORT);
});
