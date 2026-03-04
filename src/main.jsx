import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import {ChatContextProvider} from "./context/ChatContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <AuthContextProvider>
                <ChatContextProvider>
                    <App/>
                </ChatContextProvider>
            </AuthContextProvider>
        </Router>
    </StrictMode>,
)
