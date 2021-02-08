import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles'
import colors from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline'

const color = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
}

const theme = createMuiTheme({
  palette: {
    primary: {
      ...color,
      main: color['800'],
      dark: color['900'],
      light: color['700'],
      contrastText: color['100'],
    },
    secondary: {
      ...color,
      main: color['100'],
      dark: color['300'],
      light: color['50'],
    },
  },
})

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = props => {
  return (
    <MuiThemeProvider theme={theme}>
      <>
        <CssBaseline />
        {props.children}
      </>
    </MuiThemeProvider>
  )
}
