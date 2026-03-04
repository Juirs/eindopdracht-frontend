import { useState } from 'react';
import './ChatModule.css';

const ChatInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedText = text.trim();
        if (trimmedText)
        {
            onSendMessage(trimmedText);
            setText('');
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
            <button type="submit" className="sendButton" disabled={!text.trim()}>
                Send
            </button>
        </form>
    );
};

export default ChatInput;
