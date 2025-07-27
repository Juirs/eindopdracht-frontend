import {createContext, useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import isTokenValid from "../helpers/isTokenValid.js";
import api from "../helpers/api.js";

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
            (async () => {
                try {
                    const decodedToken = jwtDecode(token);
                    if (isTokenValid(decodedToken)) {
                        const userDetails = await fetchUserDetailsAndProfile(decodedToken.sub);
                        setAuth({
                            isAuthenticated: true,
                            user: userDetails,
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
            })();
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
            const userDetails = await fetchUserDetailsAndProfile(decoded.sub);
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

    async function fetchUserDetailsAndProfile(username) {
        try {
            const userDetails = await api.users.getUser(username);
            const userProfile = await api.profiles.getProfile(username);
            const fullUserDetails = {
                ...userDetails,
                ...userProfile,
            }
            console.log("User details fetched successfully:", fullUserDetails);
            return fullUserDetails;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    }

    return (
        <AuthContext.Provider value={data}>
            {Auth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;