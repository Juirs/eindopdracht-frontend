/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';
import * as chatSocket from '../helpers/chatSocket.js';
import api from '../helpers/api.js';

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [messages, setMessages] = useState({}); // Stores as { username: [message objects] }
    const [activeConversations, setActiveConversations] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null);

    const handleIncomingMessage = useCallback((message) => {
        if (!message) return;

        const isOwnMessage = message.senderUsername === user?.username;
        if (isOwnMessage) return;

        const otherUser = message.senderUsername;

        setMessages(prev => ({
            ...prev,
            [otherUser]: [...(prev[otherUser] || []), message]
        }));

        setActiveConversations(prev => {
            if (prev.includes(otherUser)) return prev;
            return [...prev, otherUser];
        });

        // Increment unread count only if the conversation isn't the one currently being viewed
        if (otherUser !== activeChatUser) {
            setUnreadCounts(prev => ({
                ...prev,
                [otherUser]: (prev[otherUser] || 0) + 1
            }));
        }
    }, [user?.username, activeChatUser]);

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                chatSocket.connect(
                    token,
                    handleIncomingMessage,
                    () => setIsConnected(true)
                );
            }
        } else {
            // Cleanup on logout
            chatSocket.disconnect();
            setIsConnected(false);
            setMessages({});
            setActiveConversations([]);
            setUnreadCounts({});
            setActiveChatUser(null);
        }

        return () => chatSocket.disconnect();
    }, [isAuthenticated, handleIncomingMessage]);

    const loadConversation = useCallback(async (otherUsername) => {
        try {
            await api.profiles.getProfile(otherUsername);

            const history = await api.chat.getConversation(otherUsername);
            const normalizedHistory = (history || []).filter(Boolean);

            setMessages(prev => ({
                ...prev,
                [otherUsername]: normalizedHistory
            }));

            setActiveConversations(prev => {
                if (prev.includes(otherUsername)) return prev;
                return [...prev, otherUsername];
            });

            setActiveChatUser(otherUsername);
            setUnreadCounts(prev => ({
                ...prev,
                [otherUsername]: 0
            }));
            return true;
        } catch (error) {
            console.error(`ChatContext: Failed to load conversation with ${otherUsername}:`, error);
            return false;
        }
    }, []);

    const sendMessage = useCallback((recipientId, content) => {
        if (!user || !content.trim()) return;

        // Backend expects ChatRequest: { recipientUsername, content }
        const payload = {
            recipientUsername: recipientId,
            content: content.trim(),
        };

        // Create optimistic message for immediate UI feedback
        const optimisticMessage = {
            senderUsername: user.username,
            recipientUsername: recipientId,
            content: payload.content,
            sentAt: new Date().toISOString()
        };

        setMessages(prev => ({
            ...prev,
            [recipientId]: [...(prev[recipientId] || []), optimisticMessage]
        }));

        setActiveConversations(prev => {
            if (prev.includes(recipientId)) return prev;
            return [...prev, recipientId];
        });

        chatSocket.sendMessage('/app/chat.send', payload);
    }, [user]);

    const markAsRead = useCallback((username) => {
        setUnreadCounts(prev => ({
            ...prev,
            [username]: 0
        }));
    }, []);

    // Memoize context value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => ({
        messages,
        activeConversations,
        unreadCounts,
        isConnected,
        activeChatUser,
        setActiveChatUser,
        loadConversation,
        sendMessage,
        markAsRead
    }), [messages, activeConversations, unreadCounts, isConnected, activeChatUser, loadConversation, sendMessage, markAsRead]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatContextProvider');
    }
    return context;
};