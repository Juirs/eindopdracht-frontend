# IndieVerse Frontend - Installation Manual

## Overview
IndieVerse is a platform that connects indie game developers with gamers, creating a space where developers can showcase their work, get feedback, and build a community.

## Installation Steps

### 1. Clone the Repository

### 2. Install Dependencies with npm install

### 3. Environment Configuration
Create a `.env` file in the root directory with the following content:

- `VITE_API_BASE_URL=http://localhost:8080`

### 4. Start the Application with npm run dev (if on vite)

## API Endpoints
The frontend communicates with these main backend endpoints:

### Authentication
- `POST /authenticate` - User login
- `POST /users/register` - User registration

### Games
- `GET /games` - Fetch all games
- `GET /games/{id}` - Get specific game
- `POST /games/with-files` - Create new game
- `DELETE /games/{id}` - Delete game

### Reviews
- `GET /games/{gameId}/reviews` - Get game reviews
- `POST /games/{gameId}/reviews` - Create review

### User Profiles
- `GET /users/{username}` - Get user details
- `PUT /users/{username}/profile` - Update profile

### Game Jams
- `GET /gamejams` - Get all game jams
- `POST /gamejams` - Create game jam (admin only)

## Troubleshooting
- Ensure backend server is running
- Check `VITE_API_BASE_URL` in `.env` file
