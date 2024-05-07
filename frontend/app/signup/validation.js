function Validation(values) {
    let error = {}

    if (values.username ==="") {
        error.username = "Username should not be empty" 
    } else {
        error.email = ""
    }

    const password = values.password.toString().trim();
    if (password === "") {
        error.password = "Password should not be empty";
    } else if (password.length < 7) {
        error.password = "Password should be at least 7 characters long";
    } else if (!/\d{2}/.test(password)) {
        error.password = "Password should contain at least 2 numbers";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        error.password = "Password should contain at least 1 special character";
    } else {
        error.password = "";
    }
    return error
}

export default Validation;