import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS here
import App from './App';

// Create a root container for rendering the React application
const container = document.getElementById('root');
const root = createRoot(container!);

const renderApp = (Component: React.FC) => {
  root.render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>,
  );
};

renderApp(App);
