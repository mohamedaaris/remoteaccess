import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Disable StrictMode to prevent double mounting and WebSocket reconnection issues
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
