import { useState } from 'react';
import './ChatModule.css';

const ChatList = ({ conversations, unreadCounts, activeUser, onSelectUser, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleNewChat = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSelectUser(searchTerm.trim());
            setSearchTerm('');
        }
    };

    if (loading) {
        return (
            <div className="chatList">
                <h3>Conversations</h3>
                <div className="chatListLoading">
                    Loading friends...
                </div>
            </div>
        );
    }

    return (
        <div className="chatList">
            <h3>Conversations</h3>
            
            <form onSubmit={handleNewChat} className="newChatForm">
                <input
                    type="text"
                    placeholder="Enter username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchInput"
                />
                <button type="submit" className="searchButton">Chat</button>
            </form>

            {conversations.length === 0 ? (
                <p className="emptyList">No conversations yet.</p>
            ) : (
                conversations.map((username) => (
                    <button
                        type="button"
                        key={username}
                        className={`chatListItem ${activeUser === username ? 'active' : ''}`}
                        onClick={() => onSelectUser(username)}
                    >
                        <span className="username">{username}</span>
                        {unreadCounts[username] > 0 && (
                            <span className="unreadBadge">{unreadCounts[username]}</span>
                        )}
                    </button>
                ))
            )}
        </div>
    );
};

export default ChatList;
