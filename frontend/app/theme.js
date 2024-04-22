// styles/theme.js
import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
    },
    background: {
        default: '#004d40', // Dark green background color
    },
});

export default theme;
