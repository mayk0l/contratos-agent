type Props = {
  onSuggestionClick: (suggestion: string) => void;
  show: boolean;
}

const suggestions = [
  {
    text: "Contrato de servicios",
    icon: "💼",
    prompt: "Necesito un contrato de prestación de servicios profesionales"
  },
  {
    text: "Contrato de trabajo",
    icon: "👔",
    prompt: "Quiero generar un contrato de trabajo independiente"
  },
  {
    text: "Contrato de compraventa",
    icon: "🏠",
    prompt: "Necesito un contrato de compraventa de bienes"
  },
  {
    text: "Contrato de arriendo",
    icon: "🏘️",
    prompt: "Quiero crear un contrato de arriendo de inmueble"
  },
  {
    text: "Acuerdo de confidencialidad",
    icon: "🔒",
    prompt: "Necesito un acuerdo de confidencialidad (NDA)"
  },
  {
    text: "Contrato de sociedad",
    icon: "🤝",
    prompt: "Quiero crear un contrato de sociedad comercial"
  }
];

export default function QuickSuggestions({ onSuggestionClick, show }: Props) {
  if (!show) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
        💡 Sugerencias rápidas para empezar:
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md hover:scale-105 group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {suggestion.icon}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {suggestion.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
