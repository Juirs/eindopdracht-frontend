import './CreateGameJam.css';
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../helpers/api.js";
import {AuthContext} from "../../context/AuthContext.jsx";

function CreateGameJam() {
    const {user, isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rules: '',
        theme: '',
        gameJamImageUrl: '',
        startDate: '',
        endDate: '',
        maxParticipants: 100
    });

    const isAdmin = user?.roles?.includes('ADMIN') || false;

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Game jam name is required.');
            return false;
        }
        if (formData.name.length > 100) {
            setError('Name cannot exceed 100 characters.');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required.');
            return false;
        }
        if (formData.description.length > 1000) {
            setError('Description cannot exceed 1000 characters.');
            return false;
        }
        if (!formData.rules.trim()) {
            setError('Rules are required.');
            return false;
        }
        if (formData.rules.length > 1000) {
            setError('Rules cannot exceed 1000 characters.');
            return false;
        }
        if (!formData.theme.trim()) {
            setError('Theme is required.');
            return false;
        }
        if (formData.theme.length > 100) {
            setError('Theme cannot exceed 100 characters.');
            return false;
        }
        if (!formData.startDate) {
            setError('Start date is required.');
            return false;
        }
        if (!formData.endDate) {
            setError('End date is required.');
            return false;
        }
        if (new Date(formData.startDate) <= new Date()) {
            setError('Start date must be in the future.');
            return false;
        }
        if (new Date(formData.endDate) <= new Date()) {
            setError('End date must be in the future.');
            return false;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setError('End date must be after start date.');
            return false;
        }
        if (formData.maxParticipants < 1) {
            setError('Maximum participants must be positive.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.gameJams.createGameJam(formData);
            console.log('Game jam created successfully:', response);
            alert('Game jam created successfully!');
            navigate('/game-jams');
        } catch (err) {
            console.error('Error creating game jam:', err);
            setError(err.response?.data || 'Failed to create game jam. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/game-jams');
    };

    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="create-gamejam-page">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You must be logged in as an admin to create game jams.</p>
                    <button onClick={() => navigate('/signin')} className="signin-btn">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-gamejam-page">
            <div className="create-gamejam-header">
                <h1>Host New Game Jam</h1>
                <p>Create an exciting game development competition for the community</p>
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit} className="create-gamejam-form">
                <div className="form-section">
                    <h3>Basic Information</h3>

                    <div className="form-group">
                        <label htmlFor="name">Game Jam Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter the game jam name"
                            disabled={loading}
                            maxLength="100"
                            required
                        />
                        <div className="character-count">
                            {formData.name.length}/100 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="theme">Theme *</label>
                        <input
                            type="text"
                            id="theme"
                            name="theme"
                            value={formData.theme}
                            onChange={handleInputChange}
                            placeholder="Enter the game jam theme"
                            disabled={loading}
                            maxLength="100"
                            required
                        />
                        <div className="character-count">
                            {formData.theme.length}/100 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the game jam, its goals, and what participants can expect..."
                            disabled={loading}
                            rows="6"
                            maxLength="1000"
                            required
                        />
                        <div className="character-count">
                            {formData.description.length}/1000 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="rules">Rules & Guidelines *</label>
                        <textarea
                            id="rules"
                            name="rules"
                            value={formData.rules}
                            onChange={handleInputChange}
                            placeholder="Enter detailed rules and guidelines for participants..."
                            disabled={loading}
                            rows="4"
                            maxLength="1000"
                            required
                        />
                        <div className="character-count">
                            {formData.rules.length}/1000 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="gameJamImageUrl">Game Jam Image URL (Optional)</label>
                        <input
                            type="url"
                            id="gameJamImageUrl"
                            name="gameJamImageUrl"
                            value={formData.gameJamImageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            disabled={loading}
                        />
                        <div className="file-upload-info">
                            Enter a URL for the game jam banner image
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Event Details</h3>

                    <div className="form-two-columns">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date & Time *</label>
                            <input
                                type="datetime-local"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                disabled={loading}
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date & Time *</label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                disabled={loading}
                                min={new Date().toISOString().slice(0, 16)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxParticipants">Maximum Participants *</label>
                        <input
                            type="number"
                            id="maxParticipants"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleInputChange}
                            placeholder="100"
                            min="1"
                            max="10000"
                            disabled={loading}
                            required
                        />
                        <div className="file-upload-info">
                            Enter the maximum number of participants (minimum 1)
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="create-gamejam-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Game Jam'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateGameJam;
