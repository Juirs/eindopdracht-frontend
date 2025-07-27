import './GameDemo.css';
import {useEffect, useState, useContext} from "react";
import {useParams} from "react-router-dom";
import api from "../../helpers/api.js";
import {AuthContext} from "../../context/AuthContext.jsx";
import userAvatar from '../../assets/user-placeholder.png';
import {getCategoryDisplayName} from "../../helpers/categoryHelpers.js";

function GameDemo() {
    const {gameId} = useParams();
    const {isAuthenticated, user} = useContext(AuthContext);

    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedMediaType, setSelectedMediaType] = useState('image');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [developerProfile, setDeveloperProfile] = useState({
        username: '',
        avatar: userAvatar,
        bio: ''
    });

    const isAdmin = user?.roles?.includes('ADMIN') || false;

    useEffect(() => {
        if (gameId) {
            fetchGameData();
            fetchReviews();
        }
    }, [gameId]);

    async function fetchGameData() {
        setLoading(true);
        setError(null);
        try {
            const gameDetails = await api.games.getGameById(gameId);
            console.log("Game details fetched:", gameDetails);
            setGame(gameDetails);

            const gameImageUrl = api.games.getGameImageUrl(gameDetails.id);
            if (gameImageUrl) {
                setSelectedMedia(gameImageUrl);
                setSelectedMediaType('image');
            } else if (gameDetails.trailerUrl) {
                setSelectedMedia(gameDetails.trailerUrl);
                setSelectedMediaType('trailer');
            } else if (gameDetails.screenshots && gameDetails.screenshots.length > 0) {
                setSelectedMedia(api.games.getScreenshotUrl(gameDetails.id, 0));
                setSelectedMediaType('screenshot');
            }

            if (gameDetails.developerUsername) {
                await fetchDeveloperUser(gameDetails.developerUsername);
            }
        } catch (err) {
            console.error("Error fetching game details:", err);
            setError("Failed to load game details.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchReviews() {
        try {
            const gameReviews = await api.reviews.getReviewsForGame(gameId);
            console.log("Reviews fetched:", gameReviews);
            setReviews(gameReviews);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    }

    async function fetchDeveloperUser(developerUsername) {
        try {
            const profileDetails = await api.profiles.getProfile(developerUsername);
            console.log("Developer profile details fetched:", profileDetails);
            setDeveloperProfile({
                username: developerUsername,
                avatar: profileDetails?.avatar
                    ? api.profiles.getUserAvatarUrl(developerUsername)
                    : userAvatar,
                bio: profileDetails?.bio || "No bio available."
            });
        } catch (err) {
            console.error("Error fetching developer profile details:", err);
            setDeveloperProfile({
                username: developerUsername,
                avatar: userAvatar,
                bio: "No bio available."
            });
        }
    }

    const handleDownload = async () => {
        try {
            await api.games.triggerGameDownload(game.id, game.title);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    };

    const handleMediaSelect = (mediaUrl, type) => {
        setSelectedMedia(mediaUrl);
        setSelectedMediaType(type);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.reviews.createReview(gameId, {
                rating: reviewRating,
                comment: reviewComment.trim() || null
            });

            setReviewRating(5);
            setReviewComment('');

            await fetchReviews();
            await fetchGameData();
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvoteReview = async (reviewId) => {
        try {
            await api.reviews.upvoteReview(reviewId);
            await fetchReviews();
        } catch (error) {
            console.error('Error upvoting review:', error);
            alert('Failed to vote. Please try again.');
        }
    };

    const handleDownvoteReview = async (reviewId) => {
        try {
            await api.reviews.downvoteReview(reviewId);
            await fetchReviews();
        } catch (error) {
            console.error('Error downvoting review:', error);
            alert('Failed to vote. Please try again.');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!isAuthenticated || !window.confirm('Delete this review?')) return;

        try {
            await api.reviews.deleteReview(reviewId);
            await fetchReviews();
            await fetchGameData();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review.');
        }
    };

    const renderStars = (rating) => {
        return Array.from({length: 5}, (_, i) => (
            <span key={i} className={`star ${i < Math.round(rating) ? 'full' : 'empty'}`}>
                {i < Math.round(rating) ? '★' : '☆'}
            </span>
        ));
    };

    const renderRatingStars = (rating, onStarClick) => {
        return Array.from({length: 5}, (_, i) => (
            <span
                key={i}
                className={`star ${i < rating ? 'full' : 'empty'} clickable`}
                onClick={() => onStarClick(i + 1)}
            >
                {i < rating ? '★' : '☆'}
            </span>
        ));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!game) return <div className="error">Game not found</div>;

    return (
        <main className="game-demo-page">
            <header className="game-header">
                <h1 className="game-title">{game.title}</h1>
                <div className="game-rating">
                    <div className="stars">
                        {renderStars(game.averageRating || 0)}
                    </div>
                    <span className="rating-text">
                        {(game.averageRating || 0).toFixed(1)}/5 ({game.reviewCount || 0} reviews)
                    </span>
                </div>
            </header>

            <div className="game-content">
                <div className="left-content">
                    <section className="media-section">
                        <div className="main-media">
                            {selectedMediaType === 'trailer' ?
                                <iframe
                                    src={selectedMedia}
                                    title="Game Trailer"
                                    allowFullScreen
                                />
                                :
                                <img
                                    src={selectedMedia}
                                    alt={game.title}
                                />
                            }
                        </div>

                        <div className="media-thumbnails">
                            {game.imageUrl && (
                                <div
                                    className={`thumbnail ${selectedMediaType === 'image' && selectedMedia === api.games.getGameImageUrl(game.id) ? 'active' : ''}`}
                                    onClick={() => handleMediaSelect(api.games.getGameImageUrl(game.id), 'image')}
                                >
                                    <img
                                        src={api.games.getGameImageUrl(game.id)}
                                        alt="Game Cover"
                                    />
                                </div>
                            )}

                            {game.trailerUrl && (
                                <div
                                    className={`thumbnail trailer ${selectedMediaType === 'trailer' ? 'active' : ''}`}
                                    onClick={() => handleMediaSelect(game.trailerUrl, 'trailer')}
                                >
                                    <div className="play-icon">▶</div>
                                </div>
                            )}

                            {game.screenshots && game.screenshots.map((screenshot, index) => {
                                const screenshotUrl = api.games.getScreenshotUrl(game.id, index);
                                return (
                                    <div
                                        key={index}
                                        className={`thumbnail screenshot ${selectedMedia === screenshotUrl ? 'active' : ''}`}
                                        onClick={() => handleMediaSelect(screenshotUrl, 'screenshot')}
                                    >
                                        <img
                                            src={screenshotUrl}
                                            alt={`Screenshot ${index + 1}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="about-section">
                        <h2>About this game</h2>
                        <p className="game-description">
                            {game.description || "No description available for this game."}
                        </p>
                    </section>

                    <section className="reviews-section">
                        <h2>User Reviews</h2>

                        {isAuthenticated && (
                            <div className="review-form-container">
                                <h3>Write a Review</h3>
                                <form onSubmit={handleSubmitReview} className="review-form">
                                    <div className="star-rating">
                                        {renderRatingStars(reviewRating, setReviewRating)}
                                    </div>
                                    <div className="comment-input">
                                        <label htmlFor="review-comment">Comment (optional):</label>
                                        <textarea
                                            id="review-comment"
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Share your thoughts about this game..."
                                            rows="8"
                                            disabled={loading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="submit-review-btn"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {reviews.length > 0 ?
                            <ul className="reviews-list">
                                {reviews.map((review) => (
                                    <li key={review.id} className="review-card">
                                        <article>
                                            <header className="review-header">
                                                <div className="reviewer-info">
                                                    <img
                                                        src={review.reviewerAvatar ?
                                                            api.profiles.getUserAvatarUrl(review.reviewerUsername) :
                                                            userAvatar
                                                        }
                                                        alt={`${review.reviewerUsername}'s avatar`}
                                                        className="reviewer-avatar"
                                                    />
                                                    <div className="reviewer-details">
                                                        <span className="reviewer-name">{review.reviewerUsername}</span>
                                                    </div>
                                                </div>
                                                <div className="review-rating">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </header>
                                            {review.comment && (
                                                <p className="review-content">{review.comment}</p>
                                            )}
                                            <footer className="review-meta">
                                                <div className="review-actions">
                                                    {isAuthenticated && (
                                                        <>
                                                            <div className="vote-buttons">
                                                                <button
                                                                    className={`vote-btn upvote-btn ${review.userVote === 'UPVOTE' ? 'voted' : ''}`}
                                                                    onClick={() => handleUpvoteReview(review.id)}
                                                                    title="Upvote this review"
                                                                >
                                                                    👍 {review.upvotes || 0}
                                                                </button>
                                                                <button
                                                                    className={`vote-btn downvote-btn ${review.userVote === 'DOWNVOTE' ? 'voted' : ''}`}
                                                                    onClick={() => handleDownvoteReview(review.id)}
                                                                    title="Downvote this review"
                                                                >
                                                                    👎 {review.downvotes || 0}
                                                                </button>
                                                            </div>
                                                            {(user && user.username === review.reviewerUsername || isAdmin) && (
                                                                <button
                                                                    className="delete-review-btn"
                                                                    onClick={() => handleDeleteReview(review.id)}
                                                                    title="Delete your review"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {!isAuthenticated && (
                                                        <span className="review-votes">
                                                            👍 {review.upvotes || 0} 👎 {review.downvotes || 0}
                                                        </span>
                                                    )}
                                                </div>
                                            </footer>
                                        </article>
                                    </li>
                                ))}
                            </ul>
                            :
                            <p className="no-reviews">No reviews yet. Be the first to review this game!</p>
                        }
                    </section>
                </div>

                <div className="right-sidebar">
                    <div className="download-section">
                        {game.gameFilePath ?
                            <button className="download-btn" onClick={handleDownload}>
                                <span className="download-icon">⬇️</span>
                                Download Demo
                            </button>
                            :
                            <button className="download-btn disabled" disabled>
                                <span className="download-icon">📄</span>
                                No Demo Available
                            </button>
                        }
                    </div>

                    <section className="game-details-section">
                        <h3>Game Details</h3>
                        <div className="detail-list">
                            <div className="detail-item">
                                <span>Developer:</span>
                                <span>{developerProfile.username}</span>
                            </div>
                            <div className="detail-item">
                                <span>Category:</span>
                                <span>{getCategoryDisplayName(game.category)}</span>
                            </div>
                            <div className="detail-item">
                                <span>Reviews:</span>
                                <span>{game.reviewCount || 0}</span>
                            </div>
                            <div className="detail-item">
                                <span>Rating:</span>
                                <span>{(game.averageRating || 0).toFixed(1)}/5</span>
                            </div>
                        </div>
                    </section>

                    <section className="developer-section">
                        <h3>Developer</h3>
                        <div className="developer-info">
                            <div className="developer-details">
                                <img
                                    src={developerProfile.avatar || userAvatar}
                                    alt={`${developerProfile.username}'s avatar`}
                                    className="developer-avatar"
                                />
                                <h4 className="developer-name">{developerProfile.username}</h4>
                            </div>
                            <p className="developer-bio">{developerProfile.bio}</p>
                        </div>
                    </section>

                    <section className="category-section">
                        <h3>Category</h3>
                        <div className="category-tags">
                            <span className="category-tag">{getCategoryDisplayName(game.category)}</span>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default GameDemo;