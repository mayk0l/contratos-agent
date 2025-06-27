import { useState } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

type Message = {
  from: "bot" | "user";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text:
        "👋 ¡Hola! Soy tu asistente legal chileno.\n\n" +
        "Puedo ayudarte a:\n" +
        "• Generar contratos personalizados\n" +
        "• Explicar cláusulas legales\n" +
        "• Redactar borradores legales\n\n" +
        "¿En qué puedo ayudarte hoy?",
    },
  ]);

  const handleSend = async (userInput: string) => {
    const updatedMessages: Message[] = [
      ...messages,
      { from: "user", text: userInput },
    ];
    setMessages(updatedMessages);

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: updatedMessages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      const respuesta: string =
        data.respuesta || "⚠️ El modelo no devolvió respuesta.";
      setMessages((prev) => [...prev, { from: "bot", text: respuesta }]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ Hubo un error al contactar al servidor.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-4">
        🧾 Generador de Contratos Chile
      </h1>

      {/* Listado de mensajes */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} from={msg.from} text={msg.text} />
        ))}
      </div>

      {/* Input de usuario */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
