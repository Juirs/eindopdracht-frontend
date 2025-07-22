import {useContext, useState} from "react";
import {AuthContext} from "../../context/auth/AuthContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import logo from '../../assets/indieverse-logo.jpg';
import userAvatar from '../../assets/user-placeholder.png';
import './Navigation.css';

function Navigation() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        // will handle this later
    };

    return (<nav>
        <Link to="/" className="logo-link">
                <span className="logo-container">
                    <img src={logo} alt="logo"/>
                    <h3>
                        IndieVerse
                    </h3>
                </span>
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
                        src={auth.user?.avatar || userAvatar}
                        alt="User Avatar"
                    />
                </div>
                <Link to={auth.user?.username} className="username-email">
                    <p>{auth.user?.username}</p>
                    <p>{auth.user?.email}</p>
                </Link>

                {/*For testing, will be moved to profile page later*/}
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