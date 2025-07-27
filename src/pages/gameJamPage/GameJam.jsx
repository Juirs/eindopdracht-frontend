import './GameJam.css';
import {useEffect, useState, useContext} from "react";
import api from "../../helpers/api.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

function GameJam() {
    const {isAuthenticated, user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [gameJams, setGameJams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joiningJam, setJoiningJam] = useState(null);

    const isAdmin = user?.roles?.includes('ADMIN') || false;
    const isDeveloper = user?.roles?.includes('DEVELOPER') || false;

    useEffect(() => {
        fetchGameJams();
    }, []);

    const fetchGameJams = async () => {
        setLoading(true);
        setError(null);
        try {
            const jams = await api.gameJams.getAllGameJams();
            console.log("Game jams fetched:", jams);
            setGameJams(jams);
        } catch (err) {
            console.error("Error fetching game jams:", err);
            setError("Failed to load game jams.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGameJam = async (jamId, jamName) => {
        if (!isAuthenticated) {
            alert('Please log in to join game jams.');
            return;
        } else if (!isDeveloper) {
            alert('Only developers can join game jams.');
            return;
        }

        setJoiningJam(jamId);
        try {
            await api.gameJams.joinGameJam(jamId);
            await fetchGameJams();
            alert(`Successfully joined "${jamName}"!`);
        } catch (error) {
            console.error('Error joining game jam:', error);
            const errorMessage = error.response?.data || 'Failed to join game jam.';
            alert(errorMessage);
        } finally {
            setJoiningJam(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGameJamStatus = (jam) => {
        if (jam.isCurrentlyActive) {
            return {status: 'Active Now', className: 'status-active'};
        } else if (new Date(jam.startDate) > new Date()) {
            return {status: 'Upcoming', className: 'status-upcoming'};
        } else {
            return {status: 'Ended', className: 'status-ended'};
        }
    };

    const canJoinGameJam = (jam) => {
        return jam.canAcceptParticipants && jam.isActive && isAuthenticated;
    };

    const getJoinButtonText = (jam) => {
        if (!isAuthenticated) return 'Login to Join';
        if (!jam.isActive) return 'Inactive';
        if (!jam.canAcceptParticipants) return 'Full';
        if (jam.isCurrentlyActive) return 'Join Now';
        return 'Join';
    };

    const getProgressPercentage = (current, max) => {
        return max > 0 ? (current / max) * 100 : 0;
    };

    const handleHostGameJam = () => {
        navigate('/admin/create-gamejam');
    };

    if (loading) return <div className="loading">Loading game jams...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="gamejam-page">
            <div className="gamejam-header">
                <h1>Game Jams</h1>
                <p>Join exciting game development competitions and showcase your creativity!</p>
                {isAdmin &&
                    <button onClick={handleHostGameJam} className="host-gamejam-btn">
                        Host Game Jam
                    </button>
                }
            </div>

            {gameJams.length > 0 ?
                <div className="gamejam-grid">
                    {gameJams.map((jam) => {
                        const statusInfo = getGameJamStatus(jam);
                        const progressPercentage = getProgressPercentage(jam.currentParticipants, jam.maxParticipants);

                        return (
                            <div key={jam.id} className="gamejam-card">
                                <div className="gamejam-image">
                                    {jam.gameJamImageUrl ?
                                        <img src={jam.gameJamImageUrl} alt={jam.name}/>
                                        :
                                        <div className="gamejam-image-placeholder">🏆</div>
                                    }
                                    <div className={`gamejam-status ${statusInfo.className}`}>
                                        {statusInfo.status}
                                    </div>
                                </div>

                                <div className="gamejam-content">
                                    <h3 className="gamejam-title">{jam.name}</h3>

                                    {jam.theme &&
                                        <div className="gamejam-theme">
                                            Theme: {jam.theme}
                                        </div>
                                    }

                                    <p className="gamejam-description">
                                        {jam.description || "No description available."}
                                    </p>

                                    <div className="gamejam-meta">
                                        <div className="meta-item">
                                            <span className="meta-icon">👥</span>
                                            <span>{jam.currentParticipants}/{jam.maxParticipants} participants</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            <span>Created {formatDate(jam.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="participants-progress">
                                        <div className="progress-label">
                                            <span>Participants</span>
                                            <span>{jam.currentParticipants}/{jam.maxParticipants}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{width: `${progressPercentage}%`}}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="gamejam-dates">
                                        <div className="date-item">
                                            <span className="date-label">Starts:</span>
                                            <span className="date-value">{formatDate(jam.startDate)}</span>
                                        </div>
                                        <div className="date-item">
                                            <span className="date-label">Ends:</span>
                                            <span className="date-value">{formatDate(jam.endDate)}</span>
                                        </div>
                                    </div>

                                    {jam.rules &&
                                        <div className="gamejam-rules">
                                            <h4>Rules:</h4>
                                            <p>{jam.rules}</p>
                                        </div>
                                    }

                                    <div className="gamejam-actions">
                                        <button
                                            className="join-btn"
                                            onClick={() => handleJoinGameJam(jam.id, jam.name)}
                                            disabled={!canJoinGameJam(jam) || joiningJam === jam.id}
                                        >
                                            {joiningJam === jam.id ? 'Joining...' : getJoinButtonText(jam)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                :
                <div className="no-gamejams">
                    <div className="no-gamejams-icon">🎮</div>
                    <h3>No Game Jams Available</h3>
                    <p>Check back later for exciting game development competitions!</p>
                </div>
            }
        </div>
    );
}

export default GameJam;
