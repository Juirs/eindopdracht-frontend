import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage.jsx";
import HomePage from "./pages/homePage/HomePage.jsx";

function App() {
    const location = useLocation();

    const authPages = ['/signin', '/signup'];
    const isAuthPage = authPages.includes(location.pathname);

    if (isAuthPage) {
        return (
            <div className="auth-layout">
                <Routes>
                    <Route path="/signin" element={<LoginPage />} />
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
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App
