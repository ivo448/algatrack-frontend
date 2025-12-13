import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulacion from './pages/Simulacion';
import Calendario from './pages/Calendario';
import GestionLotes from './pages/GestionLotes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulacion" element={<Simulacion />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/gestion-lotes" element={<GestionLotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;