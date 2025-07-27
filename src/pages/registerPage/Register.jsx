import {useState} from "react";
import api from "../../helpers/api.js";
import {useNavigate} from "react-router-dom";
import './Register.css';
import logo from '../../assets/indieVerse_Logo_Transparent.png';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleRegister(event) {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.users.register(username, password, email, isDeveloper);
            setMessage('User registered successfully. You can now log in.');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (e) {
            console.error("Error during registration:", e);

            if (e.response?.data?.includes('users_email_key')) {
                setError('This email is already registered. Please use a different email.');
            } else if (e.response?.data?.includes('users_username_key')) {
                setError('This username is already taken. Please choose a different username.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo"/>
                </div>
                <form onSubmit={handleRegister} className="register-form auth-form">
                    {error && <div className="error">{error}</div>}
                    {message && <div className="success">{message}</div>}

                    <div className="form-group">
                        <label htmlFor="username"></label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Please enter a valid username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"></label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Please enter a valid email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Please enter a valid password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="developer-checkbox">
                        <label htmlFor="isDeveloper">
                            <input
                                type="checkbox"
                                id="isDeveloper"
                                checked={isDeveloper}
                                onChange={(e) => setIsDeveloper(e.target.checked)}
                                disabled={isLoading}
                            />
                            Register as a developer
                        </label>
                    </div>
                    <button type="submit" disabled={isLoading} className="register-btn">
                        {isLoading ? 'Registering user...' : 'Sign up'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;