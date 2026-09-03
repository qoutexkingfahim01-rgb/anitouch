import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0A0A0A',
              color: '#FAFAFA',
              border: '1px solid #27272A',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }} 
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);