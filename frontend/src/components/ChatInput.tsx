import { useState } from 'react';

type Props = {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: Props) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim() && !disabled) {
            onSend(text);
            setText('');
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex items-end space-x-3">
            {/* Input Field */}
            <div className="flex-1 relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-800 placeholder-gray-500 min-h-[48px] max-h-32 overflow-y-auto"
                    placeholder="Escribe tu consulta legal... (Shift + Enter para nueva línea)"
                    style={{
                        height: 'auto',
                        minHeight: '48px'
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                    }}
                />
                
                {/* Character counter */}
                <div className="absolute bottom-1 right-3 text-xs text-gray-400">
                    {text.length}/500
                </div>
            </div>

            {/* Send Button */}
            <button 
                onClick={handleSend} 
                disabled={!text.trim() || disabled}
                className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
            >
                {disabled ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg 
                        className="w-5 h-5 transform transition-transform group-hover:translate-x-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}