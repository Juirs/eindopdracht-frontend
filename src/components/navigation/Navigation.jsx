import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import logo from '../../assets/indieVerse_Logo_Transparent.png';
import userAvatar from '../../assets/user-placeholder.png';
import api from "../../helpers/api.js";
import './Navigation.css';

function Navigation() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const getUserAvatarUrl = () => {
        if (auth.user?.avatar) {
            return api.profiles.getUserAvatarUrl(auth.user.username);
        }
        return userAvatar;
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (<nav>
        <Link to="/" className="logo-link">
                <div className="logo-container">
                    <span className="logo-image">
                        <img src={logo} alt="logo"/>
                    </span>
                    <h3>
                        IndieVerse
                    </h3>
                </div>
        </Link>

        <div className="search-container">
            <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
        </div>
        <div className="user-profile">
            {auth.isAuthenticated ? <>
                <div className="user-avatar">
                    <img
                        src={getUserAvatarUrl()}
                        alt="User Avatar"
                    />
                </div>
                <Link to="/profile" className="username-email">
                    <p>{auth.user?.username}</p>
                    <p>{auth.user?.email}</p>
                </Link>

                <button
                    type="button"
                    onClick={auth.logout}
                >Log out</button>
            </> : <>
                <button
                    type="button"
                    onClick={() => navigate('/signin')}
                >
                    Log in
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                >
                    Sign up
                </button>
            </>}
        </div>
    </nav>);
}

export default Navigation;