import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../helpers/api.js';
import ChatList from '../../components/chat/ChatList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import './ChatPage.css';

const ChatPage = () => {
    const { user } = useAuth();
    const { 
        messages, 
        activeConversations, 
        unreadCounts, 
        loadConversation, 
        sendMessage,
        markAsRead,
        activeChatUser,
        setActiveChatUser
    } = useChat();
    
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await api.friends.getFriends();
                setFriends(data);
            } catch (err) {
                console.error("Error fetching friends:", err);
            } finally {
                setLoadingFriends(false);
            }
        };
        fetchFriends();
    }, []);

    const handleSelectUser = async (username) => {
        if (loadingFriends) return;

        const isFriend = friends.some(f => f.username === username);
        if (!isFriend) {
            alert(`You can only chat with users on your friends list. ${username} is not your friend.`);
            return;
        }

        console.log(`ChatPage: handleSelectUser called for ${username}`);
        const success = await loadConversation(username);
        if (success) {
            markAsRead(username);
        }
    };

    useEffect(() => {
        if (activeChatUser && !loadingFriends) {
            const isFriend = friends.some(f => f.username === activeChatUser);
            if (!isFriend) {
                setActiveChatUser(null);
            }
        }
    }, [friends, loadingFriends, activeChatUser, setActiveChatUser]);

    const handleSendMessage = (content) => {
        if (activeChatUser) {
            sendMessage(activeChatUser, content);
        }
    };

    const filteredConversations = activeConversations.filter(username => 
        friends.some(f => f.username === username)
    );

    return (
        <div className="chatPage">
            <ChatList
                conversations={filteredConversations}
                unreadCounts={unreadCounts}
                activeUser={activeChatUser}
                onSelectUser={handleSelectUser}
                loading={loadingFriends}
            />
            <ChatWindow
                currentUser={user}
                recipient={activeChatUser}
                messages={messages[activeChatUser] || []}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default ChatPage;
