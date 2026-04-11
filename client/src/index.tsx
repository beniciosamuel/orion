import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Theme } from "@radix-ui/themes";
import "./i18n/config";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Theme
        appearance="dark"
        accentColor="purple"
        grayColor="slate"
        radius="large"
      >
        <App />
      </Theme>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
