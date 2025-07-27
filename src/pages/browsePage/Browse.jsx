import './Browse.css';
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import api from "../../helpers/api.js";
import GameCard from "../../components/gameCard/GameCard.jsx";
import {getAllCategories, getCategoryDisplayName} from "../../helpers/categoryHelpers.js";

function Browse() {
    const [allGames, setAllGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentSearch, setCurrentSearch] = useState('');

    const categories = ['All', ...getAllCategories()];

    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        const searchQuery = searchParams.get('search') || '';
        if (searchQuery && searchQuery !== currentSearch) {
            setCurrentSearch(searchQuery);
            setSearchParams({});
        }
        filterGames(searchQuery || currentSearch);
    }, [searchParams, allGames, selectedCategory, currentSearch]);

    async function fetchGames() {
        setLoading(true);
        setError(null);
        try {
            const games = await api.games.getAllGames();
            setAllGames(games);
        } catch (err) {
            console.error("Error fetching games:", err);
            setError("Failed to load games.");
        } finally {
            setLoading(false);
        }
    }

    function filterGames(searchQuery) {
        let filtered = [...allGames];

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(game => game.category === selectedCategory);
        }

        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(game =>
                game.title.toLowerCase().includes(query) ||
                game.description?.toLowerCase().includes(query) ||
                game.developerUsername.toLowerCase().includes(query)
            );
        }

        setFilteredGames(filtered);
    }

    return (
        <div className="browse-page">
            <h2>Browse Games</h2>

            <div className="category-filter">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {getCategoryDisplayName(category)}
                    </button>
                ))}
            </div>

            <div className="games-section">
                <h3>
                    {currentSearch ? `Search results for "${currentSearch}"` : getCategoryDisplayName(selectedCategory) + ' Games'}
                    ({filteredGames.length} found)
                </h3>

                {loading && <p className="loading">Loading games...</p>}
                {error && <p className="error">{error}</p>}

                {filteredGames.length > 0 ?
                    <div className="games-grid">
                        {filteredGames.map((game) => (
                            <GameCard key={game.id} game={game}/>
                        ))}
                    </div>
                    :
                    !loading && <p>No games found.</p>
                }
            </div>
        </div>
    );
}

export default Browse;
