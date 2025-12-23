import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
console.log("ENV VARS:", import.meta.env);
console.log("API URL DETECTADA:", import.meta.env.VITE_API_BASE_URL);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)