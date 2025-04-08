// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import { AuthProvider } from './scenes/context/AuthContext'; // Ensure this path is correct
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);