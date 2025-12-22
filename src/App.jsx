import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulacion from './pages/Simulacion';
import Calendario from './pages/Calendario';
import GestionLotes from './pages/GestionLotes';
import GestionPedidos from './pages/GestionPedidos';
import GestionClientes from './pages/GestionClientes';
import GestionUsuarios from './pages/GestionUsuarios';
import Configuracion from './pages/Configuracion';

// --- COMPONENTE DE SEGURIDAD ---
// Si el usuario no tiene el rol correcto, lo echamos al Dashboard o al Login
const RutaProtegida = ({ children, rolesPermitidos }) => {
    const rolUsuario = localStorage.getItem('usuario_rol');

    if (!rolUsuario) {
        return <Navigate to="/" replace />; // No logueado -> Login
    }

    if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
        return <Navigate to="/dashboard" replace />; // Rol incorrecto -> Dashboard
    }

    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* RUTAS PÚBLICAS (Para cualquier logueado) */}
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/calendario" element={<RutaProtegida><Calendario /></RutaProtegida>} />

        {/* RUTAS COMERCIALES (Comercial + Gerencia) */}
        <Route path="/simulacion" element={
            <RutaProtegida rolesPermitidos={['Comercial', 'Gerencia']}>
                <Simulacion />
            </RutaProtegida>
        } />
        <Route path="/gestion-pedidos" element={
            <RutaProtegida rolesPermitidos={['Comercial', 'Gerencia']}>
                <GestionPedidos />
            </RutaProtegida>
        } />
        <Route path="/gestion-clientes" element={
            <RutaProtegida rolesPermitidos={['Comercial', 'Gerencia']}>
                <GestionClientes />
            </RutaProtegida>
        } />

        {/* RUTAS OPERATIVAS (Personal + Gerencia) */}
        <Route path="/gestion-lotes" element={
            <RutaProtegida rolesPermitidos={['Personal', 'Gerencia']}>
                <GestionLotes />
            </RutaProtegida>
        } />

        {/* RUTAS ADMIN (Solo Gerencia) */}
        <Route path="/admin-usuarios" element={
            <RutaProtegida rolesPermitidos={['Gerencia']}>
                <GestionUsuarios />
            </RutaProtegida>
        } />
        <Route path="/configuracion" element={
            <RutaProtegida rolesPermitidos={['Gerencia']}>
                <Configuracion />
            </RutaProtegida>
        } />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;