import './MyGames.css';
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import api from "../../helpers/api.js";
import GameCard from "../../components/gameCard/GameCard.jsx";

function MyGames() {
    const {user, isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();
    const [myGames, setMyGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isDeveloper = user?.roles?.includes('DEVELOPER') || false;

    useEffect(() => {
        if (isAuthenticated && isDeveloper) {
            fetchMyGames();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, isDeveloper]);

    const fetchMyGames = async () => {
        setLoading(true);
        setError(null);
        try {
            const allGames = await api.games.getAllGames();
            const myGames = allGames.filter(game => game.developerUsername === user.username);
            console.log("Fetched developer games:", myGames);
            setMyGames(myGames);
        } catch (err) {
            console.error("Error fetching my games:", err);
            setError("Failed to load your games.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewGame = () => {
        navigate('/upload-game');
    };

    const handleDeleteGame = async (gameId, gameTitle) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${gameTitle}"? This action cannot be undone.`);

        if (confirmDelete) {
            try {
                await api.games.deleteGame(gameId);
                setMyGames(prev => prev.filter(game => game.id !== gameId));
                alert('Game deleted successfully!');
            } catch (error) {
                console.error('Error deleting game:', error);
                alert('Failed to delete game. Please try again.');
            }
        }
    };

    if (!isAuthenticated || !isDeveloper) {
        return (
            <div className="my-games-page">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You must be logged in as a developer to view this page.</p>
                    <button onClick={() => navigate('/signin')} className="signin-btn">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-games-page">
            <div className="my-games-header">
                <div className="header-content">
                    <h1>My Games</h1>
                    <p>Manage and view all your published games</p>
                </div>
                <button onClick={handleCreateNewGame} className="create-new-btn">
                    <span>Create New Game</span>
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="games-stats">
                <div className="stat-card">
                    <span className="stat-number">{myGames.length}</span>
                    <span className="stat-label">Total Games</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {myGames.reduce((total, game) => total + (game.reviewCount || 0), 0)}
                    </span>
                    <span className="stat-label">Total Reviews</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">
                        {myGames.length > 0
                            ? (myGames.reduce((total, game) => total + (game.averageRating || 0), 0) / myGames.length).toFixed(1)
                            : '0.0'
                        }
                    </span>
                    <span className="stat-label">Average Rating</span>
                </div>
            </div>

            <div className="games-section">
                {loading && <div className="loading">Loading your games...</div>}

                {!loading && myGames.length === 0 && !error &&
                    <div className="empty-state">
                        <div className="empty-icon">🎮</div>
                        <h3>No Games Yet</h3>
                        <p>You haven't created any games yet. Start by creating your first game!</p>
                        <button onClick={handleCreateNewGame} className="create-new-btn">
                            <span>Create Your First Game</span>
                        </button>
                    </div>
                }

                {!loading && myGames.length > 0 &&
                    <>
                        <div className="games-list-header">
                            <h2>Your Published Games ({myGames.length})</h2>
                        </div>
                        <div className="my-games-grid">
                            {myGames.map((game) => (
                                <div key={game.id} className="my-game-card-wrapper">
                                    <GameCard game={game}/>
                                    <div className="game-actions">
                                        <button
                                            onClick={() => navigate(`/games/${game.id}`)}
                                            className="view-btn"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGame(game.id, game.title)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="game-stats">
                                        <div className="game-stat">
                                            <span className="stat-icon">⭐</span>
                                            <span>{(game.averageRating || 0).toFixed(1)}/5</span>
                                        </div>
                                        <div className="game-stat">
                                            <span className="stat-icon">💬</span>
                                            <span>{game.reviewCount || 0} reviews</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default MyGames;
