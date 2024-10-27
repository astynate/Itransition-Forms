class ValidateHandler {
    static validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            return { error: "This field is required", isValid: false };
        } else if (emailRegex.test(email) === false) {
            return { error: "Invalid email", isValid: false };
        }

        return { error: null, isValid: true };
    }

    static validatePassword = (password) => {
        if (!password) {
            return { error: "This field is required", isValid: false };
        } else if (password.length < 8) {
            return { error: "Password should contain at least 8 symbols", isValid: false };
        }

        return { error: null, isValid: true };
    }
}

export default ValidateHandler;