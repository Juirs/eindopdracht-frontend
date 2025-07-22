import {createContext, useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import isTokenValid from "../../helpers/isTokenValid/isTokenValid";
import api from "../../helpers/api/api.js";

export const AuthContext = createContext({});

function AuthContextProvider({children}) {
    const [Auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        status: 'pending',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (isTokenValid(decodedToken)) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            username: decodedToken.sub,
                        },
                        status: 'done',
                    });
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                setAuth({
                    isAuthenticated: false,
                    user: null,
                    status: 'done',
                });
            }
        } else {
            setAuth({
                isAuthenticated: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    const data = {
        isAuthenticated: Auth.isAuthenticated,
        user: Auth.user,
        login,
        logout,
    }

    async function login(authResponse) {
        console.log("Login response received:", authResponse);
        localStorage.setItem('token', authResponse.jwt);

        try {
            const decoded = jwtDecode(authResponse.jwt);
            let userDetails;

            try {
                userDetails = await api.users.getUser(decoded.sub);
                console.log('User details fetched from API:', userDetails);
            } catch (error) {
                console.error('Failed to fetch user details from API', error);
                userDetails = null;
            }

            setAuth({
                isAuthenticated: true,
                user: userDetails,
                status: 'done',
            });
            console.log("User logged in successfully");
        } catch (error) {
            console.error('Error during login process:', error);
            localStorage.removeItem('token');
            setAuth({
                isAuthenticated: false,
                user: null,
                status: 'done',
            });
        }
    }

    function logout() {
        localStorage.removeItem('token');
        setAuth({
            isAuthenticated: false,
            user: null,
            status: 'done',
        });
        console.log("User logged out");
    }

    return (
        <AuthContext.Provider value={data}>
            {Auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;