import './GameCard.css';
import api from '../../helpers/api.js';
import { useNavigate } from "react-router-dom";

function GameCard({ game }) {
    const navigate = useNavigate();

    const handleGameClick = () => {
        navigate(`/games/${game.id}`);
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
        try {
            await api.games.triggerGameDownload(game.id, game.title);
            console.log('Download started for:', game.title);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const truncateDescription = (description, maxLength = 200) => {
        if (!description) return '';
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength).trim() + '...';
    };

    return (
        <div className="game-card" onClick={handleGameClick}>
            <div className="game-image-container">
                <img
                    src={api.games.getGameImageUrl(game.id)}
                    alt={game.title}
                />
                <div className="game-overlay">
                    <button
                        className="download-btn"
                        onClick={handleDownload}
                        title="Download Game"
                    >
                        ⬇️
                    </button>
                </div>
            </div>
            <div className="game-info">
                <h3 className="game-title">{game.title}</h3>
                <p className="game-description">{truncateDescription(game.description)}</p>
                <div className="game-meta">
                    <span className="game-category">{game.category}</span>
                    <span className="game-developer">by {game.developerUsername}</span>
                </div>
            </div>
        </div>
    );
}

export default GameCard;
