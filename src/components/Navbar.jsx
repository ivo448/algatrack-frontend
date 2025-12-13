import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', { 
        method: 'POST',
        credentials: 'include' // IMPORTANTE: Para borrar la cookie de sesión
      });
      navigate('/');
    } catch (error) {
      console.error("Error al salir", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">🌿 Algatrack</Link>
        <div className="d-flex gap-3">
          <Link className="nav-link text-white" to="/dashboard">Panel</Link>
          <Link className="nav-link text-white" to="/simulacion">Simulador</Link>
          <Link className="nav-link text-white" to="/calendario">Calendario</Link>
          <Link className="nav-link text-white" to="/gestion-lotes">Gestión de Lotes</Link>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;