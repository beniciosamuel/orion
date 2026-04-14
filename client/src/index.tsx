import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import "./i18n/config";
import "./index.css";

const AppWithTheme: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Theme
      appearance={theme}
      accentColor="purple"
      grayColor="slate"
      radius="large"
    >
      <App />
    </Theme>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
