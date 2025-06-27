import ReactMarkdown from "react-markdown";

type Props = {
  from: "bot" | "user";
  text: string;
};

export default function ChatMessage({ from, text }: Props) {
  const isBot = from === "bot";

  return (
    <div className={`w-full flex ${isBot ? "justify-start" : "justify-end"} my-2`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-lg shadow-md ${
          isBot
            ? "bg-white text-gray-900"
            : "bg-blue-500 text-white"
        }`}
      >
        {isBot ? (
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{text}</p>
        )}
      </div>
    </div>
  );
}
