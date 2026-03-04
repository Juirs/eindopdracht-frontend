import { useState } from 'react';
import './ChatModule.css';

const ChatInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || isSending) return;

        try {
            setIsSending(true);
            await onSendMessage(trimmedText);
            setText('');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form className="inputContainer" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chatInput"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="sendButton" disabled={!text.trim() || isSending}>
                Send
            </button>
        </form>
    );
};

export default ChatInput;
