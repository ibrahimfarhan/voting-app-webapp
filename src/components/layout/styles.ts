import { createMuiTheme } from "@material-ui/core";

const lightModeColors = {
  '--bg-color': 'white',
  '--font-color': 'black',
  '--border-color': '#8f8f8f',
  '--lighter-border-color': '#b6b6b6',
  '--scrollbar-color': 'gray',
  '--scrollbar-bg-color': 'white',
  '--blue-font-color': 'var(--blue)'
};

const darkModeColors = {
  '--bg-color': 'rgb(26, 26, 26)',
  '--font-color': 'white',
  '--border-color': '#424242',
  '--lighter-border-color': '#2c2c2c',
  '--scrollbar-color': '#2d2d2d',
  '--scrollbar-bg-color': 'rgb(26, 26, 26)',
  '--blue-font-color': 'var(--light-blue)'
};

export const rootHtmlElement = document.querySelector(':root') as HTMLElement;

export const getMuiTheme = (darkModeIsEnabled: boolean) => {
  const s = getComputedStyle(rootHtmlElement);
  return createMuiTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
    fontFamily: s.getPropertyValue('--main-font-family'),
    fontSize: 16,
    allVariants: {
      color: s.getPropertyValue('--font-color').trim()
    },
  },
  palette: {
    type: darkModeIsEnabled ? 'dark' : 'light',
    primary: {
      main: s.getPropertyValue('--blue').trim()
    },
    secondary: {
      main: s.getPropertyValue('--red').trim()
    }
  },
})
};

export const toggleDarkMode = (enabled: boolean) => {
  Object.entries(enabled ? darkModeColors : lightModeColors).forEach(([k, v]) => {
    rootHtmlElement.style.setProperty(k, v);
  });
};
