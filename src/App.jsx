import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import Login from "./pages/loginPage/Login.jsx";
import Home from "./pages/homePage/Home.jsx";
import Register from "./pages/registerPage/Register.jsx";
import PasswordReset from "./pages/passwordResetPage/PasswordReset.jsx";
import Browse from "./pages/browsePage/Browse.jsx";
import GameDemo from "./pages/gameDetailsPage/GameDemo.jsx";
import Profile from "./pages/profilePage/Profile.jsx";
import CreateGame from "./pages/createGamePage/CreateGame.jsx";
import MyGames from "./pages/myGamesPage/MyGames.jsx";
import GameJam from "./pages/gameJamPage/GameJam.jsx";
import CreateGameJam from "./pages/createGameJamPage/CreateGameJam.jsx";

function App() {
    const location = useLocation();

    const authPages = ['/signin', '/signup', '/password-reset'];
    const isAuthPage = authPages.includes(location.pathname);

    if (isAuthPage) {
        return (
            <div className="auth-layout">
                <Routes>
                    <Route path="/signin" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Navigation />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/browse" element={<Browse />} />
                        <Route path="/game-jams" element={<GameJam />} />
                        <Route path="/admin/create-gamejam" element={<CreateGameJam />} />
                        <Route path="/games/:gameId" element={<GameDemo />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/upload-game" element={<CreateGame />} />
                        <Route path="/my-games" element={<MyGames />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App
