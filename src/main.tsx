// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// ✅ IMPORTANTE: estilos do Mantine v7
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
