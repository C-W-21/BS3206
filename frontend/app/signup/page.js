'use client'

import { useState } from "react";
import { Box, Button, Typography, ThemeProvider, TextField } from "@mui/material";
import theme from "../theme";
import Validation from "./validation";
import signup from "./api";
import bcrypt from 'bcryptjs';


function SignUp() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = Validation(values);
        setErrors(validationErrors);

        const isValid = Object.values(validationErrors).every(error => error === '');

        if (isValid) {
            const { username, password } = values;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                await signup(username, hashedPassword);
                window.location.href = '/login';
            } catch (error) {
                console.error('Error during signup:', error);
            }
        } else {
            console.log("Sign Up validation failed.");
        }
    };
    
    

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                <Box bgcolor="#f0f0f0" p={4} borderRadius={8} maxWidth={400} width="80%">
                    <Typography variant="h1" align="center" style={{ color: '#000000', fontFamily: 'Helvetica' }} gutterBottom>Sign Up</Typography>
                    <form action="" onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField label="User" name="username" onChange={handleInput} variant="outlined" fullWidth />
                        <span style={{ color: 'red' }}>{errors.username}</span>
                    </Box>
                    <Box mb={2}>
                        <TextField label="Password" name="password" onChange={handleInput} variant="outlined" type="password" fullWidth />
                        <span style={{ color: 'red' }}>{errors.password}</span>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>Sign Up</Button>
                    </Box>
                    <Button variant="outlined" href="/login" style={{ color: '#000000' }} fullWidth>Return to Login</Button>
                    </form>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default SignUp;
