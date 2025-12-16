import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../css/index.css';
import App from './App';

// Find root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root with React 18 API
const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(<App />);
