import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./contexts/userContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HelmetProvider>
  <CssBaseline />
   <Provider store={store}>
    <UserProvider>
    <App />
  </UserProvider>
  </Provider>
  </HelmetProvider>
 
  </StrictMode>,
)
