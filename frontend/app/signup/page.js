'use client'

import { useState } from "react";
import { Box, Button, Typography, ThemeProvider, TextField } from "@mui/material";
import theme from "../theme";

const SignUpLayout = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async () => {
        try {
            const response = await axios.post("/signup", { username, password });
            console.log(response.data);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                <Box bgcolor="#f0f0f0" p={4} borderRadius={8} maxWidth={400} width="80%">
                    <Typography variant="h1" align="center" style={{ color: '#000000', fontFamily: 'Helvetica' }} gutterBottom>Sign Up</Typography>
                    <Box mb={2}>
                        <TextField label="User" variant="outlined" fullWidth />
                    </Box>
                    <Box mb={2}>
                        <TextField label="Password" variant="outlined" type="password" fullWidth />
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" href="/login" color="primary" fullWidth>Sign Up</Button>
                    </Box>
                    <Button variant="outlined" href="/login" style={{ color: '#000000' }} fullWidth>Return to Login</Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default SignUpLayout;
