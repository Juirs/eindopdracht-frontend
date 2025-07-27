import './Home.css';
import {useEffect, useState} from "react";
import api from "../../helpers/api.js";
import GameCard from "../../components/gameCard/GameCard.jsx";
import {useNavigate} from "react-router-dom";

function Home() {
    const [featuredGame, setFeaturedGame] = useState(null);
    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const games = await fetchAllGames();
                setFeaturedGame(games[0]); // Grab the first game as featured for now
            } catch (err) {
                console.error("Error loading featured game:", err);
                setError("Failed to load featured game.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function fetchAllGames() {
        try {
            const games = await api.games.getAllGames();
            console.log("Fetched all games:", games);
            setAllGames(games);
            return games;
        } catch (error) {
            console.error("Error fetching all games:", error);
            setError("Failed to load games.");
            return [];
        }
    }

    return (
        <div className="homepage">
            <h2>Featured Game</h2>
            <div className="hero-section">
                {loading && <p>Loading featured game...</p>}
                {error && <p className="error">{error}</p>}
                {featuredGame ?
                    <div className="featured-game">
                        <div className="featured-game-content">
                            <h3
                                onClick={() => navigate(`/games/${featuredGame.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {featuredGame.title}
                            </h3>
                            <p>{featuredGame.description}</p>
                            <div className="featured-game-meta">
                                <span className="featured-category">{featuredGame.category}</span>
                                <span className="featured-developer">by {featuredGame.developerUsername}</span>
                            </div>
                            <div className="featured-game-actions">
                                <button
                                    className="featured-download-btn"
                                    onClick={() => api.games.triggerGameDownload(featuredGame.id, featuredGame.title)}
                                >
                                    ⬇️ Download Game
                                </button>
                                <button
                                    className="secondary-btn"
                                    onClick={() => navigate(`/games/${featuredGame.id}`)}
                                >
                                    📖 View Details
                                </button>
                            </div>
                        </div>
                        <div
                            className="featured-game-image"
                            onClick={() => navigate(`/games/${featuredGame.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={api.games.getGameImageUrl(featuredGame.id)}
                                alt={featuredGame.title}
                            />
                            <div className="featured-image-overlay">
                                Featured
                            </div>
                        </div>
                    </div>
                    :
                    <p>No featured game available</p>}
            </div>

            <div className="content-section">
                <h2>Latest Games</h2>
                {loading && <p>Loading games...</p>}
                {error && <p>{error}</p>}
                {allGames.length > 0 ?
                    <div className="games-list">
                        {allGames.slice(0, 10).map((game) => (
                            <GameCard key={game.id} game={game}/>
                        ))}
                    </div>
                    :
                    <p>No games available</p>}
                {allGames.length > 10 && (
                    <div className="browse-more">
                        <button
                            className="browse-more-btn"
                            onClick={() => navigate("/browse")}
                        >
                            Browse All Games →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
