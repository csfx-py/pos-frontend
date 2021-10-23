import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UtilityProvider } from "./Contexts/UtilityContext";
import { AuthProvider } from "./Contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981",
      light: "#5decb1",
      dark: "#008854",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ef4444",
      light: "#ff7970",
      dark: "#b5001c",
      contrastText: "#fff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        maxSnack={3}
      >
        <UtilityProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </UtilityProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
