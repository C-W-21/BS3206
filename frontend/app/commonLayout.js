// components/CommonLayout.js
import { Box, Typography } from "@mui/material";

const CommonLayout = ({ children }) => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h1" align="center">Emissions Calculator</Typography>
            <Box width="80%" bgcolor="white" p={2} mt={2}>
                {children}
            </Box>
            <Box width="80%" bgcolor="grey" mt={2} p={2}>
                <Typography variant="body1">Get Support Here.</Typography>
            </Box>
        </Box>
    );
};

export default CommonLayout;
