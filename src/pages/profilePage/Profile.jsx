import './Profile.css';
import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import api from "../../helpers/api.js";
import userAvatar from '../../assets/user-placeholder.png';
import {getCategoryDisplayName, getAllCategories} from "../../helpers/categoryHelpers.js";

function Profile() {
    const {user, isAuthenticated} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        preferredGenres: user?.preferredGenres || []
    });

    const handleBioChange = (e) => {
        setFormData(prev => ({
            ...prev,
            bio: e.target.value
        }));
    };

    const handleCategoryToggle = (category) => {
        setFormData(prev => {
            const currentGenres = prev.preferredGenres;
            const isSelected = currentGenres.includes(category);

            if (isSelected) {
                return {
                    ...prev,
                    preferredGenres: currentGenres.filter(genre => genre !== category)
                };
            } else {
                if (currentGenres.length >= 3) {
                    setError('You can only select up to 3 preferred categories.');
                    return prev;
                } else {
                    setError(null);
                    return {
                        ...prev,
                        preferredGenres: [...currentGenres, category]
                    };
                }
            }
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess('');

        try {
            await api.profiles.updateProfile(user.username, formData);
            setIsEditing(false);
            setSuccess('Profile updated successfully! Please refresh the page to see changes.');

            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                return;
            }
            setAvatarFile(file);
            setError(null);
        }
    };

    const handleUploadAvatar = async () => {
        setUploadingAvatar(true);
        setError(null);
        setSuccess('');

        try {
            await api.profiles.uploadAvatar(user.username, avatarFile);
            setSuccess('Avatar updated successfully! Please refresh the page to see changes.');
            setAvatarFile(null);

            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            console.error("Error uploading avatar:", err);
            setError("Failed to upload avatar. Please try again.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            bio: user?.bio || '',
            preferredGenres: user?.preferredGenres || []
        });
        setError(null);
    };

    const getAvatarUrl = () => {
        if (user?.avatar) {
            return api.profiles.getUserAvatarUrl(user.username);
        }
        return userAvatar;
    };

    const getRoleDisplayName = (roles) => {
        if (!roles || roles.length === 0) return 'User';
        if(roles.includes('ADMIN')) return 'Admin';
        return roles.includes('DEVELOPER') ? 'Developer' : 'User';
    };

    if (!isAuthenticated) {
        return (
            <div className="profile-page">
                <div className="error">Please log in to view your profile.</div>
            </div>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="profile-content">
                <div className="profile-left-content">
                    <section className="avatar-section">
                        <h3>Profile Picture</h3>
                        <div className="avatar-container">
                            <img
                                src={getAvatarUrl()}
                                alt="Profile Avatar"
                                className="current-avatar"
                            />
                        </div>
                        <div className="avatar-upload">
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                            />
                            <label htmlFor="avatar-upload" className="avatar-upload-label">
                                Choose Image
                            </label>
                            {avatarFile &&
                                <div>
                                    <p>
                                        Selected: {avatarFile.name}
                                    </p>
                                    <button
                                        onClick={handleUploadAvatar}
                                        disabled={uploadingAvatar}
                                        className="upload-avatar-btn"
                                    >
                                        {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                                    </button>
                                </div>
                            }
                        </div>
                    </section>

                    <div className="user-info-section">
                        <h3>Account Information</h3>
                        <div className="info-item">
                            <span className="info-label">Username:</span>
                            <span className="info-value">{user.username}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Role:</span>
                            <span className="role-badge">{getRoleDisplayName(user.roles)}</span>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <h3>Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">{user.gamesCreated || 0}</span>
                                <span className="stat-label">Games</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{user.reviewsWritten || 0}</span>
                                <span className="stat-label">Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-form-section">
                    <section className="about-me-section">
                        <h3>About Me</h3>
                        {!isEditing ?
                            <div className="info-label">{user?.bio || 'No bio provided'}</div>
                         :
                            <div className="profile-form-group">
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={handleBioChange}
                                    placeholder="Tell us about yourself..."
                                    disabled={loading}
                                    rows="8"
                                />
                            </div>
                        }
                    </section>

                    <section className="preferred-categories-section">
                        <h3>Preferred Categories</h3>
                        {!isEditing ?
                            <div>
                                {user?.preferredGenres && user.preferredGenres.length > 0 ?
                                    <div className="category-tags">
                                        {user.preferredGenres.map((category) =>
                                            <span key={category} className="category-tag">
                                                {getCategoryDisplayName(category)}
                                            </span>
                                        )}
                                    </div>
                                    :
                                    <p className="info-label">
                                        No preferred categories selected
                                    </p>
                                }
                            </div>
                            :
                            <div className="profile-form-group">
                                <label htmlFor="preferred-categories">Preferred Categories (up to 3):</label>
                                <div className="categories-selection">
                                    <div className="categories-grid">
                                        {getAllCategories().map((category) =>
                                            <button
                                                key={category}
                                                type="button"
                                                className={`category-selector ${
                                                    formData.preferredGenres.includes(category) ? 'selected' : ''
                                                }`}
                                                onClick={() => handleCategoryToggle(category)}
                                                disabled={loading}
                                            >
                                                {getCategoryDisplayName(category)}
                                            </button>
                                        )}
                                    </div>
                                    <p>
                                        Selected: {formData.preferredGenres.length}/3
                                    </p>
                                </div>
                            </div>
                        }
                    </section>

                    {isEditing &&
                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="cancel-btn"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="update-profile-btn"
                                >
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    }

                    {!isEditing &&
                        <div className="form-actions">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="update-profile-btn"
                            >
                                Edit Profile
                            </button>
                        </div>
                    }
                </div>
            </div>
        </main>
    );
}

export default Profile;
