import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Clave para que Flask guarde la sesión
        body: JSON.stringify({ usuario, contrasena })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center text-success mb-4 fw-bold">🌿 Algatrack</h2>
        <h5 className="text-center text-muted mb-4">Acceso Corporativo</h5>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input 
              type="text" className="form-control" 
              value={usuario} onChange={(e) => setUsuario(e.target.value)} 
              required placeholder="Ej: comercial"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" className="form-control" 
              value={contrasena} onChange={(e) => setContrasena(e.target.value)} 
              required placeholder="Ej: comercial123"
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;