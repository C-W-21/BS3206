import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D3D3D3',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#004d40', // Dark green background color
        },
    },
    typography: {
        h1: {
            color: '#ffffff', // White text color for Header 1
        },
        h2: {
            color: '#000000', // Black text color for Header 2
        },
        body1: {
            color: '#000000', // Black text color for paragraphs
        },
    },
});

export default theme;
