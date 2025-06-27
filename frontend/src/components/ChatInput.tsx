import { useState } from 'react';

type Props = {
    onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    }

    return (
        <div className="flex">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="border p-2 rounded-l-lg"
                placeholder="Escribe tu respuesta..."
            />
            <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r-lg">
                Enviar
            </button>
        </div>
    );
}