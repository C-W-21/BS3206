// components/CommonLayout.js
import { Box, Button, Typography, ThemeProvider } from "@mui/material";
import theme from "./theme";

const CommonLayout = ({ title, children }) => {
    return (
        <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" width="80%" p={2} mt={1} mb={0}>
            <Button href="/" color="buttonPrimary">Home</Button>
            <Button href="/route" style={{ marginLeft: '10px' }} color="buttonPrimary">Plan Route</Button>
            <Typography variant="h1" align="center" style={{ fontFamily: 'Helvetica', fontSize: '35px', marginRight: '10px', flexGrow: 0.75 }}>{title}</Typography>
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
