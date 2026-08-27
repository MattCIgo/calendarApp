import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App.tsx';
import './index.css';

import { TokenProvider } from "./contexts/TokenContext";

createRoot(document.getElementById('root')!).render(
  <Router>
    <StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
    </StrictMode>
  </Router>
);
