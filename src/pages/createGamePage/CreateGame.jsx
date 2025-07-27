import './CreateGame.css';
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../helpers/api.js";
import {getAllCategories, getCategoryDisplayName} from "../../helpers/categoryHelpers.js";
import {AuthContext} from "../../context/AuthContext.jsx";

function CreateGame() {
    const {user, isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        trailerUrl: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [gameFile, setGameFile] = useState(null);
    const [screenshotFiles, setScreenshotFiles] = useState([null, null, null, null]);

    const isDeveloper = user?.roles?.includes('DEVELOPER') || false;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file for the game cover.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Image file size should be less than 10MB.');
                return;
            }
            setImageFile(file);
            setError('');
        }
    };

    const handleGameFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 200 * 1024 * 1024) {
                setError('Game file size should be less than 200MB.');
                return;
            }
            setGameFile(file);
            setError('');
        }
    };

    const handleScreenshotChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file for screenshots.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Screenshot file size should be less than 10MB.');
                return;
            }

            const newScreenshots = [...screenshotFiles];
            newScreenshots[index] = file;
            setScreenshotFiles(newScreenshots);
            setError('');
        }
    };

    const removeScreenshot = (index) => {
        const newScreenshots = [...screenshotFiles];
        newScreenshots[index] = null;
        setScreenshotFiles(newScreenshots);
    };

    const removeFile = (fileType) => {
        if (fileType === 'image') {
            setImageFile(null);
        } else if (fileType === 'game') {
            setGameFile(null);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Game title is required.');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Game description is required.');
            return false;
        }
        if (!formData.category) {
            setError('Please select a game category.');
            return false;
        }
        if (!imageFile) {
            setError('Game cover image is required.');
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
            const validScreenshots = screenshotFiles.filter(file => file !== null);
            const response = await api.games.createGameWithFiles(
                formData,
                imageFile,
                gameFile,
                validScreenshots
            );

            console.log('Game created successfully:', response);
            navigate(`/games/${response.id}`);
        } catch (err) {
            console.error('Error creating game:', err);
            setError(err.response?.data || 'Failed to create game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/my-games');
    };

    if (!isAuthenticated || !isDeveloper) {
        return (
            <div className="my-games-page">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You must be logged in as a developer to view this page.</p>
                    <button onClick={() => navigate('/signin')} className="signin-btn">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-game-page">
            <div className="create-game-header">
                <h1>Create New Game</h1>
                <p>Share your game with the IndieVerse community. Fill in the details below to publish your
                    creation.</p>
            </div>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit} className="create-game-form">
                <div className="form-section">
                    <h3>Basic Information</h3>

                    <div className="form-two-columns">
                        <div className="form-group">
                            <label htmlFor="title">Game Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter your game title"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                disabled={loading}
                            >
                                <option value="">Select a category</option>
                                {getAllCategories().map(category => (
                                    <option key={category} value={category}>
                                        {getCategoryDisplayName(category)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your game, its features, and what makes it special..."
                            disabled={loading}
                            rows="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="trailerUrl">Trailer URL (Optional)</label>
                        <input
                            type="url"
                            id="trailerUrl"
                            name="trailerUrl"
                            value={formData.trailerUrl}
                            onChange={handleInputChange}
                            placeholder="https://www.youtube.com/embed/your-video-id"
                            disabled={loading}
                        />
                        <div className="file-upload-info">
                            Enter a YouTube embed URL to showcase your game trailer
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Game Files</h3>

                    <div className="file-upload-group">
                        <label>Game Cover Image *</label>
                        <input
                            type="file"
                            id="image-upload"
                            className="file-upload-input"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            disabled={loading}
                        />
                        <label htmlFor="image-upload" className="file-upload-label">
                            Choose Cover Image
                        </label>
                        <div className="file-upload-info">
                            Upload a cover image for your game (JPG, PNG, GIF - Max 10MB)
                        </div>

                        {imageFile && (
                            <div className="file-preview">
                                <h4>Selected Cover Image:</h4>
                                <span className="file-name">{imageFile.name}</span>
                                <span className="file-size">{formatFileSize(imageFile.size)}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile('image')}
                                    className="remove-file-btn"
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="file-upload-group">
                        <label>Game File (Optional)</label>
                        <input
                            type="file"
                            id="game-file-upload"
                            className="file-upload-input"
                            onChange={handleGameFileChange}
                            disabled={loading}
                        />
                        <label htmlFor="game-file-upload" className="file-upload-label">
                            Choose Game File
                        </label>
                        <div className="file-upload-info">
                            Upload your game file (ZIP, RAR, EXE - Max 100MB)
                        </div>

                        {gameFile && (
                            <div className="file-preview">
                                <h4>Selected Game File:</h4>
                                <span className="file-name">{gameFile.name}</span>
                                <span className="file-size">{formatFileSize(gameFile.size)}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile('game')}
                                    className="remove-file-btn"
                                    disabled={loading}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Screenshots (Optional)</h3>
                    <p>
                        Upload up to 4 screenshots to showcase your game
                    </p>

                    <div className="screenshots-grid">
                        {screenshotFiles.map((file, index) => (
                            <div key={index}>
                                <input
                                    type="file"
                                    id={`screenshot-${index}`}
                                    className="file-upload-input"
                                    accept="image/*"
                                    onChange={(e) => handleScreenshotChange(index, e)}
                                    disabled={loading}
                                />
                                <label
                                    htmlFor={`screenshot-${index}`}
                                    className={`screenshot-upload-slot ${file ? 'filled' : ''}`}
                                >
                                    {file ?
                                        <div className="screenshot-preview-container">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={'Screenshot'}
                                                className="screenshot-preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeScreenshot(index);
                                                }}
                                                className="remove-file-btn"
                                                disabled={loading}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        :
                                        <>
                                            <div className="upload-icon">📸</div>
                                            <div className="upload-text">
                                                Screenshot {index + 1}
                                            </div>
                                        </>
                                    }
                                </label>
                            </div>
                        ))}
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
                        className="create-game-btn"
                        disabled={loading}
                    >
                        {loading ?
                            <span>Creating...</span>
                            :
                            <>
                                <span>Create Game</span>
                            </>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateGame;