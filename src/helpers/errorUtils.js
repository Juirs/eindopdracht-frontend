export const getErrorMessage = (e, defaultMessage = 'Something went wrong.') => {
    const errorData = e?.response?.data;
    let errorMessage = '';

    if (typeof errorData === 'string') {
        errorMessage = errorData;
    } else if (errorData?.message) {
        errorMessage = typeof errorData.message === 'string'
            ? errorData.message
            : JSON.stringify(errorData.message);
    } else if (errorData && typeof errorData === 'object') {
        // Handle field-specific errors like { password: "...", email: "..." }
        errorMessage = Object.values(errorData)
            .map(val => typeof val === 'string' ? val : JSON.stringify(val))
            .join(', ');
    }

    const normalized = String(errorMessage || '');
    // Friendly mapping for database constraint errors
    if (normalized.includes('users_email_key')) {
        return 'This email is already registered. Please use a different email.';
    }
    if (normalized.includes('users_username_key')) {
        return 'This username is already taken. Please choose a different username.';
    }

    return normalized || defaultMessage;
};
