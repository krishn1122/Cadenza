import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import Bootstrap CSS directly (no SCSS)
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import our custom styles
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
