import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // Leemos el rol guardado
  const rol = localStorage.getItem('usuario_rol');
  const usuario = localStorage.getItem('usuario_nombre');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      // Limpiamos los datos del navegador
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error("Error al salir", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">🌿 Algatrack</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav me-auto">
                {/* 1. COMÚN (Todos ven esto) */}
                <Link className="nav-link" to="/dashboard">Panel</Link>
                <Link className="nav-link" to="/calendario">Calendario</Link>

                {/* 2. ÁREA COMERCIAL (Solo Comercial y Gerencia) */}
                {(rol === 'Comercial' || rol === 'Gerencia') && (
                    <>
                        <Link className="nav-link" to="/simulacion">Simulador</Link>
                        <Link className="nav-link" to="/gestion-pedidos">Pedidos</Link>
                        <Link className="nav-link" to="/gestion-clientes">Clientes</Link>
                    </>
                )}

                {/* 3. ÁREA OPERATIVA (Solo Personal y Gerencia) */}
                {(rol === 'Personal' || rol === 'Gerencia') && (
                    <Link className="nav-link" to="/gestion-lotes">Plantaciones</Link>
                )}

                {/* 4. ADMIN (Solo Gerencia) */}
                {rol === 'Gerencia' && (
                    <Link className="nav-link text-warning" to="/admin-usuarios">Usuarios</Link>
                )}
                {rol === 'Gerencia' && (
                    <Link className="nav-link text-warning" to="/configuracion">Configuración</Link>
                )}
            </div>

            <div className="d-flex align-items-center gap-3">
                <span className="text-white small">
                    Hola, <strong>{usuario}</strong> ({rol})
                </span>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                    Salir
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;