import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import { Toaster } from "sonner";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
           <Toaster richColors position="top-right" /> {/* Add this */}
        <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
