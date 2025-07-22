import {useContext, useState} from "react";
import {AuthContext} from "../../context/auth/AuthContext.jsx";
import api from "../../helpers/api/api.js";
import {Link, useNavigate} from "react-router-dom";
import './LoginPage.css';
import logo from '../../assets/indieVerse_Logo_Transparent.png';

function LoginPage() {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.auth.login(username, password);
            auth.login(response);
            navigate('/');
        } catch (e) {
            console.error("Error during signing in:", e);
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo"/>
                </div>
                <p>Don't have an account yet? <Link to="/signup">Sign up!</Link></p>
                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="username"></label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Please enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Please enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="login-btn">
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
                <p>Forgot Password? <Link to="/password-reset">Click here.</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;