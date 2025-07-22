import {useState} from "react";
import api from "../../helpers/api/api.js";
import {Link, useNavigate} from "react-router-dom";
import './PasswordReset.css';
import logo from '../../assets/indieVerse_Logo_Transparent.png';

function PasswordReset() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handlePasswordReset(event) {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.auth.changePassword(username, newPassword);
            setMessage('Password changed successfully! You can now log in with your new password.');
            setTimeout(() => {
                navigate('/signin');
            }, 2000);
        } catch (e) {
            console.error("Error during password change:", e);
            setError("An error occurred while changing your password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="password-reset-page">
            <div className="password-reset-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo"/>
                </div>
                <h2>Change Your Password</h2>
                <p>Enter your username and new password to change your password.</p>
                <form onSubmit={handlePasswordReset} className="password-reset-form">
                    {error && <div className="error">{error}</div>}
                    {message && <div className="success">{message}</div>}

                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="reset-btn">
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
                <div className="auth-links">
                    <Link to="/signin">Back to Login</Link>
                    <span> | </span>
                    <Link to="/signup">Create Account</Link>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;