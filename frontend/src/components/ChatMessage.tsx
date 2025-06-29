import ReactMarkdown from "react-markdown";

type Props = {
  from: "bot" | "user";
  text: string;
};

export default function ChatMessage({ from, text }: Props) {
  const isBot = from === "bot";

  return (
    <div className={`w-full flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? "flex-row" : "flex-row-reverse"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? "mr-3" : "ml-3"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            isBot 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
              : "bg-gradient-to-r from-green-500 to-teal-600 text-white"
          }`}>
            {isBot ? "🤖" : "👤"}
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl shadow-lg ${
          isBot
            ? "bg-white text-gray-800 border border-gray-100"
            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        }`}>
          {/* Message Content */}
          {isBot ? (
            <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
              <ReactMarkdown
                components={{
                  // Personalizar el renderizado de listas
                  ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  // Personalizar párrafos
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-700 leading-relaxed">{children}</p>,
                  // Personalizar texto en negrita
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  // Personalizar código
                  code: ({ children }) => (
                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isBot ? "text-gray-400" : "text-blue-100"
          }`}>
            {new Date().toLocaleTimeString('es-CL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>

          {/* Message tail */}
          <div className={`absolute top-3 w-3 h-3 transform rotate-45 ${
            isBot 
              ? "bg-white border-l border-b border-gray-100 -left-1" 
              : "bg-gradient-to-br from-blue-500 to-purple-600 -right-1"
          }`}></div>
        </div>
      </div>
    </div>
  );
}
