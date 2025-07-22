function isTokenValid(token) {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        return token.exp > currentTime;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default isTokenValid;