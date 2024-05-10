function Validation(values) {
    let error = {}
    
    // Validate email is not empty and is the correct email address
    if (values.username === "") {
        error.username = "Username should not be empty";
    } else if (!values.username.endsWith("@armydemo.com")) {
        error.username = "Email address not valid";
    } else {
        error.username = "";
    }

    // Validate password is  < 7 characters, 2 numbers and 1 special character
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