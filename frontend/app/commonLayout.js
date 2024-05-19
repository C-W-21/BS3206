// commonLayout.js
import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import theme from "./theme";

const CommonLayout = ({ title, children }) => {

    const handleSignOut = () => {
        sessionStorage.clear();
      };

    return (
        <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ height: "100vh", width: "100vw" }}>
            <Box display="flex" alignItems="center" width="80%" p={1} mt={1} mb={0}>
            <Button href="/" style={{ color: '#ffffff' }}>Home</Button>
            <Button href="/route" style={{ marginLeft: '5px', color: '#ffffff' }}>Route</Button>
            <Button href="/management" style={{ marginLeft: '5px', color: '#ffffff' }}>Create</Button>
            <Button href="/management-search" style={{ marginLeft: '5px', color: '#ffffff' }}>Specs</Button>
            <Button href="/vehicle-search" style={{ marginLeft: '5px', color: '#ffffff' }}>Vehicles</Button>
            <Typography variant="h1" align="center" style={{ marginRight: ' 200px', fontFamily: 'Helvetica', fontSize: '35px', flexGrow: 0.75 }}>{title}</Typography>
            <Button onClick={handleSignOut} href="/login" style={{ marginLeft: 'auto', color: '#ffffff' }}>Sign Out</Button>
            </Box>

            <Box width="80%" bgcolor="white" p={2} mt={1} mb={0}>
                {children}
            </Box>
    
            <Box width="80%" display="flex" flexDirection="column" alignItems="center" bgcolor="grey" mt={0} p={2}>
                <Box mb={2}>
                </Box>
                <Typography variant="body1">Get Support Here.</Typography>
            </Box>
        </Box>
        </ThemeProvider>
    );    
}    

export default CommonLayout;
