import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { usuariosService } from '../utils/api';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({
    usuario: '', email: '', contrasena: '', rol: 'Personal'
  });
  const [error, setError] = useState('');

  // 1. Cargar Usuarios
  const cargarUsuarios = async () => {
    try {
        const data = await usuariosService.getUsuarios();
        setUsuarios(data);
        setError('');
    } catch (err) {
        // Si el error es 403 (Prohibido), mostramos mensaje amigable
        if (err.status === 403) {
            setError("⛔ Acceso denegado: Solo Gerencia puede ver esto.");
        } else {
            console.error("Error cargando usuarios:", err);
            setError("Error al cargar lista de usuarios");
        }
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  // 2. Crear Usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await usuariosService.crearUsuario(nuevo);
        alert("✅ Usuario creado exitosamente");
        setNuevo({ usuario: '', email: '', contrasena: '', rol: 'Personal' });
        cargarUsuarios(); // Recargar lista
    } catch (err) {
        alert("Error al crear usuario: " + err.message);
    }
  };

  // 3. Eliminar
  const eliminar = async (id) => {
    if(!confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
        await usuariosService.eliminarUsuario(id);
        cargarUsuarios(); // Recargar lista
    } catch (err) {
        alert("Error al eliminar: " + err.message);
    }
  };

  if (error) return (
    <>
        <Navbar />
        <div className="container mt-5 text-center alert alert-danger">
            <h3>{error}</h3>
        </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>👥 Administración de Usuarios</h2>
        
        <div className="row mt-4">
          {/* Formulario */}
          <div className="col-md-4">
            <div className="card shadow-sm border-dark">
              <div className="card-header bg-dark text-white">Nuevo Usuario</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label>Usuario (Login)</label>
                    <input type="text" className="form-control" required
                      value={nuevo.usuario} onChange={e => setNuevo({...nuevo, usuario: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input type="email" className="form-control" required
                      value={nuevo.email} onChange={e => setNuevo({...nuevo, email: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label>Contraseña</label>
                    <input type="password" className="form-control" required minLength="6"
                      value={nuevo.contrasena} onChange={e => setNuevo({...nuevo, contrasena: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label>Rol / Permisos</label>
                    <select className="form-select" value={nuevo.rol} onChange={e => setNuevo({...nuevo, rol: e.target.value})}>
                        <option value="Personal">Personal (Campo)</option>
                        <option value="Comercial">Comercial (Ventas)</option>
                        <option value="Gerencia">Gerencia (Admin)</option>
                    </select>
                  </div>
                  <button className="btn btn-dark w-100">Crear Usuario</button>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="col-md-8">
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead className="table-secondary">
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th className="text-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}>
                                    <td className="fw-bold">{u.usuario}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge bg-${u.rol === 'Gerencia' ? 'danger' : u.rol === 'Comercial' ? 'primary' : 'secondary'}`}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <button onClick={() => eliminar(u.id)} className="btn btn-sm btn-outline-danger">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GestionUsuarios;