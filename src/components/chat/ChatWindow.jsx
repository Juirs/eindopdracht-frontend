import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import ChatInput from './ChatInput.jsx';
import './ChatModule.css';

const ChatWindow = ({ currentUser, recipient, messages, onSendMessage, onClose }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!recipient) {
        return (
            <div className="chatWindowEmpty">
                <h3>Select a conversation to start chatting</h3>
            </div>
        );
    }

    return (
        <div className="chatWindow">
            <div className="chatHeader">
                <span className="chatHeaderTitle">Chatting with <strong>{recipient}</strong></span>
                {onClose && (
                    <button className="closeChatBtn" onClick={onClose} title="Close Chat">
                        ✕
                    </button>
                )}
            </div>
            <div className="messagesContainer">
                {messages && messages.map((msg, index) => (
                    <MessageBubble
                        key={index}
                        message={msg}
                        isOwnMessage={msg.senderUsername === currentUser.username}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatWindow;
