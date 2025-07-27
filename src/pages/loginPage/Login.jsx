import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import api from "../../helpers/api.js";
import {Link, useNavigate} from "react-router-dom";
import './Login.css';
import logo from '../../assets/indieVerse_Logo_Transparent.png';

function Login() {
    const auth = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await api.auth.login(username, password);
            auth.login(response);
            setMessage('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (e) {
            console.error("Error during signing in:", e);
            setError('Login failed. Please check your username and password.');
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
                <form onSubmit={handleLogin} className="login-form auth-form">
                    {error && <div className="error">{error}</div>}
                    {message && <div className="success">{message}</div>}

                    <div className="form-group">
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

export default Login;