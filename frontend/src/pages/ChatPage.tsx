import { useState } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import QuickSuggestions from "../components/QuickSuggestions";

type Message = {
  from: "bot" | "user";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text:
        "👋 **¡Hola! Soy tu asistente legal chileno.**\n\n" +
        "Puedo ayudarte a:\n\n" +
        "• 📋 Generar contratos personalizados\n\n" +
        "• ⚖️ Explicar cláusulas legales\n\n" +
        "• 📝 Redactar documentos legales\n\n" +
        "¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (userInput: string) => {
    const updatedMessages: Message[] = [
      ...messages,
      { from: "user", text: userInput },
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/chat`, {
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
          text: "❌ **Error de conexión**\n\nNo pude conectarme con el servidor. Por favor, verifica que el backend esté funcionando e intenta nuevamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuggestions = messages.length === 1; // Solo mostrar en el primer mensaje

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">🧾</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generador de Contratos Chile
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Asistente legal inteligente • Powered by IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-120px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="fade-in">
              <ChatMessage from={msg.from} text={msg.text} />
            </div>
          ))}
          
          {/* Quick Suggestions */}
          <QuickSuggestions 
            show={showSuggestions && !isLoading} 
            onSuggestionClick={handleSend}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="fade-in flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-100 max-w-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                    <div className="typing-indicator"></div>
                  </div>
                  <span className="text-sm text-gray-500">Generando respuesta...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
