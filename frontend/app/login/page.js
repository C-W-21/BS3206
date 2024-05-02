'use client'

import { useEffect, useState } from "react";
import { Box, Button, TextField, ThemeProvider, Typography } from "@mui/material";
import theme from "../theme";
import "./validation";


export default function Login() {
  const [values, setValues] = useState({
    username: '',
    password: ''
  })
  
  const handleInput =(event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  const handleSubmit =(event) => {
    event.preventDefault();
    setValues(validation(values));
  }

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                <Box bgcolor="#f0f0f0" p={4} borderRadius={8} maxWidth={400} width="80%">
                    <Typography variant="h1" align="center" style={{ color: '#000000', fontFamily: 'Helvetica' }} gutterBottom>Login</Typography>
                    <form action="" onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField label="User" variant="outlined" name="username" onChange={handleInput} fullWidth />
                    </Box>
                    <Box mb={2}>
                        <TextField label="Password" variant="outlined" name="password" onChange={handleInput} type="password" fullWidth/>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" href="/" color="primary" type="submit" fullWidth>Login</Button>
                    </Box>
                    <Button variant="outlined" href="/signup" style={{ color: '#000000' }} fullWidth>Sign Up</Button>
                    </form>
                </Box>
            </Box>
        </ThemeProvider>
    );    
}    
