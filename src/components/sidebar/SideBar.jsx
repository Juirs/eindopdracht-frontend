import {NavLink} from "react-router-dom";
import './SideBar.css';

function SideBar() {
    return (
        <div className="sidebar-container">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🏠 Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/my-games" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🎮 My Games
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/game-jams" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🏆 GameJams
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/community" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        👥 Community
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/discover" className={({ isActive }) => isActive ? "active-link" : "default-link"}>
                        🔍 Discover
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;