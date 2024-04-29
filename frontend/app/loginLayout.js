// LoginLayout.js
import { Box, Button, Typography, ThemeProvider, TextField } from "@mui/material";
import theme from "./theme";


const CommonLayout = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" alignItems="center" height="100vh" justifyContent="center">
                <Box bgcolor="#f0f0f0" p={4} borderRadius={8} maxWidth={400} width="80%">
                    <Typography variant="h1" align="center" style={{ color: '#000000', fontFamily: 'Helvetica' }} gutterBottom>Login</Typography>
                    <Box mb={2}>
                        <TextField label="User" variant="outlined" fullWidth />
                    </Box>
                    <Box mb={2}>
                        <TextField label="Password" variant="outlined" type="password" fullWidth />
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" href="/" color="primary" fullWidth>Login</Button>
                    </Box>
                    <Button variant="outlined" style={{ color: '#000000' }} fullWidth>Create an Account</Button>
                </Box>
            </Box>
        </ThemeProvider>
    );    
}    

export default CommonLayout;
