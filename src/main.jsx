import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppWrapper } from "./Contexts/GlobalContext.jsx";
import Errorboundry from "./ErrorBoundries/Errorboundry.jsx";
import "./index.css"



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper >
      <Errorboundry>
        <App />
      </Errorboundry>
    </AppWrapper>
  </React.StrictMode>
);
