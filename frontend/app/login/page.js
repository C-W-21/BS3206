'use client'

import { useEffect, useState } from "react";
import { Box, Button, TextField, ThemeProvider, Typography } from "@mui/material";
import theme from "../theme";
import Validation from "./validation";
import LoginAPI from "./api"
import bcrypt from 'bcryptjs';

// Function to login a user who has already signed up
export default function Login() {
  const [values, setValues] = useState({
    username: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('');

  const handleInput =(event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  // On submit, run the api request. Check the username and password to the one hashed and salted in the database
  // Comparison is made in the backend. If successful, success message is returned and user is redirected to homepage
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    const { username, password } = values;
    
    LoginAPI(username, password)

    .then(data => {
        if (data.message === "success") {
            sessionStorage.setItem('isLoggedIn', true);
            window.location.href = '/';
        } else if (data.message === "incorrect_credentials") {
            setLoginError('Username, Password, or both are incorrect');
          } else {
            console.log(data.message)
            setLoginError('An error occurred during login');
          }
      .catch(error => {
          console.error('Error during login:', error);
          setLoginError('An error occurred during login');
      });
};

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                <Box bgcolor="#f0f0f0" p={4} borderRadius={8} maxWidth={400} width="80%">
                    <Typography variant="h1" align="center" style={{ color: '#000000', fontFamily: 'Helvetica' }} gutterBottom>Login</Typography>
                    <form action="" onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField label="Email" variant="outlined" name="username" onChange={handleInput} fullWidth />
                        <span style={{ color: 'red' }}>{errors.username}</span>
                    </Box>
                    <Box mb={2}>
                        <TextField label="Password" variant="outlined" name="password" onChange={handleInput} type="password" fullWidth/>
                        <span style={{ color: 'red' }}>{errors.password}</span>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>Login</Button>
                    </Box>
                    {loginError && <Typography variant="body1" style={{ color: 'red' }}>{loginError}</Typography>}
                    <Button variant="outlined" href="/signup" style={{ color: '#000000' }} fullWidth>Sign Up</Button>
                    </form>
                </Box>
            </Box>
        </ThemeProvider>
    );    
}    
