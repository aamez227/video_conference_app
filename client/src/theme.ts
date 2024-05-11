import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#153448',
    },
    secondary: {
      main: '#4D869C',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;