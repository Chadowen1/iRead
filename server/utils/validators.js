export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validateName(name) {
    const re = /^[a-zA-Z]+$/;
    return re.test(name);
}

export function validatePassword(password) {
    return password.length >= 8;
}

export function validateAge(birthdate) {
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    return age >= 18;
}
