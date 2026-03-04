import './ChatModule.css';

const MessageBubble = ({ message, isOwnMessage }) => {
    const formattedTime = new Date(message.sentAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div className={`messageWrapper ${isOwnMessage ? "ownMessage" : "theirMessage"}`}>
            <div className="bubble">
                <p className="messageContent">{message.content}</p>
                <span className="timestamp">{formattedTime}</span>
            </div>
        </div>
    );
};

export default MessageBubble;
