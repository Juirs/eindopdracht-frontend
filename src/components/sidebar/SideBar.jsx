import {NavLink, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import api from "../../helpers/api.js";
import './Sidebar.css';

function Sidebar() {
    const {isAuthenticated, user} = useContext(AuthContext);
    const navigate = useNavigate();
    const isDeveloper = user?.roles?.includes('DEVELOPER') || false;

    const handleRandomGame = async () => {
        try {
            const allGames = await api.games.getAllGames();
            const randomIndex = Math.floor(Math.random() * allGames.length);
            const randomGame = allGames[randomIndex];

            navigate(`/games/${randomGame.id}`);
        } catch (error) {
            console.error('Error fetching random game:', error);
            alert('Failed to load a random game. Please try again.');
        }
    };

    return (
        <div className="sidebar-container">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🏠 Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/browse" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🔍 Browse Games
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/game-jams" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🏆 Game Jams
                    </NavLink>
                </li>
                <li>
                    <button
                        onClick={handleRandomGame}
                        className="default-link"
                    >
                        🎲 Random Game
                    </button>
                </li>

                {isAuthenticated && isDeveloper && (
                    <>
                        <li>
                            <NavLink to="/my-games" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                                🛠️ My Games
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/upload-game" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                                ➕ Upload Game
                            </NavLink>
                        </li>
                    </>
                )}

                {isAuthenticated && (
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                            👤 Profile
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Sidebar;