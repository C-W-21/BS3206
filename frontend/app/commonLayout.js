// commonLayout.js
import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import theme from "./theme";

const CommonLayout = ({ title, children }) => {
    return (
        <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ height: "100vh", width: "100vw" }}>
            <Box display="flex" alignItems="center" width="80%" p={1} mt={1} mb={0}>
            <Button href="/" style={{ color: '#ffffff' }}>Home</Button>
            <Button href="/route" style={{ marginLeft: '10px', color: '#ffffff' }}>Plan Route</Button>
            <Button href="/managementsearch" style={{ marginLeft: '10px', color: '#ffffff' }}>VMS</Button>
            <Button href="/" style={{ marginLeft: '10px', color: '#ffffff' }}>VS</Button>
            <Typography variant="h1" align="center" style={{ fontFamily: 'Helvetica', fontSize: '35px', flexGrow: 0.75 }}>{title}</Typography>
            <Button href="/login" style={{ marginLeft: 'auto', color: '#ffffff' }}>Sign Out</Button>
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
