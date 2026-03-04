export const getErrorMessage = (e, defaultMessage) => {
    const errorData = e.response?.data;
    let errorMessage = '';

    if (typeof errorData === 'string') {
        errorMessage = errorData;
    } else if (errorData?.message) {
        errorMessage = errorData.message;
    } else if (errorData && typeof errorData === 'object') {
        // Handle field-specific errors like { password: "...", email: "..." }
        errorMessage = Object.values(errorData)
            .map(val => typeof val === 'string' ? val : JSON.stringify(val))
            .join(', ');
    }

    // Friendly mapping for database constraint errors
    if (errorMessage.includes('users_email_key')) {
        return 'This email is already registered. Please use a different email.';
    }
    if (errorMessage.includes('users_username_key')) {
        return 'This username is already taken. Please choose a different username.';
    }

    return errorMessage || defaultMessage;
};
