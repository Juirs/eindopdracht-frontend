import './ChatBar.css';
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useChat} from "../../context/ChatContext.jsx";
import api from "../../helpers/api.js";
import ChatWindow from "../chat/ChatWindow.jsx";

function ChatBar() {
    const {isAuthenticated, user} = useAuth();
    const {messages, loadConversation, sendMessage, markAsRead} = useChat();

    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allFriendships, setAllFriendships] = useState([]);
    const [showAllFriendships, setShowAllFriendships] = useState(false);
    const [friendUsername, setFriendUsername] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [openChats, setOpenChats] = useState([]);

    const isAdmin = user?.roles?.includes('ADMIN') || false;

    useEffect(() => {
        if (isAuthenticated) {
            fetchFriends();
            fetchPendingRequests();
            if (isAdmin) {
                fetchAllFriendships();
            }
        } else {
            setFriends([]);
            setPendingRequests([]);
            setAllFriendships([]);
            setOpenChats([]);
            setShowAllFriendships(false);
            setError(null);
            setSuccess(null);
        }
    }, [isAuthenticated, isAdmin]);

    const fetchFriends = async () => {
        try {
            const data = await api.friends.getFriends();
            setFriends(data);
        } catch (err) {
            console.error("Error fetching friends:", err);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const data = await api.friends.getPendingRequests();
            setPendingRequests(data);
        } catch (err) {
            console.error("Error fetching pending requests:", err);
        }
    };

    const fetchAllFriendships = async () => {
        try {
            const data = await api.friends.getAllFriendships();
            setAllFriendships(data);
        } catch (err) {
            console.error("Error fetching all friendships:", err);
        }
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!friendUsername.trim()) return;

        try {
            setLoading(true);
            await api.friends.sendFriendRequest(friendUsername.trim());
            setSuccess(`Friend request sent to ${friendUsername}`);
            setFriendUsername("");
            fetchPendingRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send friend request");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (username) => {
        try {
            await api.friends.acceptFriendRequest(username);
            fetchFriends();
            fetchPendingRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to accept request");
        }
    };

    const handleDeclineRequest = async (username) => {
        try {
            await api.friends.declineFriendRequest(username);
            fetchPendingRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to decline request");
        }
    };

    const handleRemoveFriend = async (username) => {
        if (window.confirm(`Are you sure you want to remove ${username} from your friends?`)) {
            try {
                await api.friends.removeFriend(username);
                fetchFriends();
                setOpenChats(prev => prev.filter(c => c !== username));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to remove friend");
            }
        }
    };

    const handleStartChat = async (username) => {
        if (!openChats.includes(username)) {
            if (openChats.length >= 3) {
                // Limit to 3 open chats for UI sanity, removing the oldest one if needed
                setOpenChats(prev => [...prev.slice(1), username]);
            } else {
                setOpenChats(prev => [...prev, username]);
            }
        }
        const loaded = await loadConversation(username);
        if (loaded) {
            markAsRead(username);
        }
    };

    const handleCloseChat = (username) => {
        setOpenChats(prev => prev.filter(c => c !== username));
    };

    if (!isAuthenticated) return null;

    return (
        <div className="chatBarContainer">
            <div className="openChatsContainer">
                {openChats.map(recipient => (
                    <div key={recipient} className="floatingChatWindow">
                        <ChatWindow
                            currentUser={user}
                            recipient={recipient}
                            messages={messages[recipient] || []}
                            onSendMessage={(content) => sendMessage(recipient, content)}
                            onClose={() => handleCloseChat(recipient)}
                        />
                    </div>
                ))}
            </div>

            <div className={`friendsDropUp ${isExpanded ? 'expanded' : ''}`}>
                <button
                    className="friendsToggleBtn"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    Friends ({friends.length})
                </button>

                {isExpanded && (
                    <div className="friendsListContent">
                        <div className="chatBarHeader">
                            <h2>Friends</h2>
                        </div>

                        <div className="addFriendSection">
                            <form onSubmit={handleSendRequest} className="addFriendForm">
                                <input
                                    type="text"
                                    placeholder="Friend Username"
                                    value={friendUsername}
                                    onChange={(e) => setFriendUsername(e.target.value)}
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading || !friendUsername.trim()}>
                                    {loading ? "..." : "Add"}
                                </button>
                            </form>
                            {error && <p className="error-text">{error}</p>}
                            {success && <p className="success-text">{success}</p>}
                        </div>

                        <div className="friendSection">
                            <h3>Pending ({pendingRequests.length})</h3>
                            {pendingRequests.length === 0 ? (
                                <p className="empty-text">No pending requests.</p>
                            ) : (
                                <ul className="friendList">
                                    {pendingRequests.map(req => (
                                        <li key={req.id} className="friendItem">
                                            <span className="friend-username">{req.username}</span>
                                            <div className="friendActions">
                                                <button onClick={() => handleAcceptRequest(req.username)}
                                                        className="acceptBtn" title="Accept">✓
                                                </button>
                                                <button onClick={() => handleDeclineRequest(req.username)}
                                                        className="declineBtn" title="Decline">✕
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="friendSection">
                            <h3>My Friends ({friends.length})</h3>
                            {friends.length === 0 ? (
                                <p className="empty-text">No friends yet.</p>
                            ) : (
                                <ul className="friendList">
                                    {friends.map(friend => (
                                        <li key={friend.id} className="friendItem">
                                            <button
                                                type="button"
                                                className="friend-username clickable"
                                                onClick={() => handleStartChat(friend.username)}
                                                title="Start Chat"
                                            >
                                                {friend.username}
                                            </button>
                                            <button onClick={() => handleRemoveFriend(friend.username)}
                                                    className="removeBtn" title="Remove">Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {isAdmin && (
                            <div className="friendSection adminSection">
                                <button
                                    onClick={() => setShowAllFriendships(!showAllFriendships)}
                                    className="adminToggleBtn"
                                >
                                    {showAllFriendships ? "Hide All Friendships" : "Show All Friendships (Admin)"}
                                </button>
                                {showAllFriendships && (
                                    <ul className="friendList">
                                        {allFriendships.length === 0 ? (
                                            <li className="empty-text">No friendships found.</li>
                                        ) : (
                                            allFriendships.map(f => (
                                                <li key={f.id} className="friendItem adminItem">
                                                    <div className="adminFriendInfo">
                                                        <span className="friend-username">{f.username}</span>
                                                        <span
                                                            className={`status-badge status-${f.status.toLowerCase()}`}>{f.status}</span>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatBar;