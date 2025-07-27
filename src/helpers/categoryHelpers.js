export const getCategoryDisplayName = (category) => {
    const displayNames = {
        'ACTION': 'Action',
        'RPG': 'Role-Playing',
        'STRATEGY': 'Strategy',
        'PUZZLE': 'Puzzle',
        'ADVENTURE': 'Adventure',
        'SIMULATION': 'Simulation',
        'SPORTS': 'Sports',
        'RACING': 'Racing',
        'SHOOTER': 'Shooter',
        'PLATFORMER': 'Platformer',
        'HORROR': 'Horror',
        'INDIE': 'Indie'
    };
    return displayNames[category] || category;
};

export const getAllCategories = () => {
    return [
        'ACTION',
        'RPG',
        'STRATEGY',
        'PUZZLE',
        'ADVENTURE',
        'SIMULATION',
        'SPORTS',
        'RACING',
        'SHOOTER',
        'PLATFORMER',
        'HORROR',
        'INDIE'
    ];
};
