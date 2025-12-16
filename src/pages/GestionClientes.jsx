import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function GestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevo, setNuevo] = useState({
    empresa: '', contacto: '', email: '', telefono: '', direccion: ''
  });

  const cargarClientes = async () => {
    const res = await fetch('http://localhost:5000/api/clientes', { credentials: 'include' });
    if (res.ok) setClientes(await res.json());
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(nuevo)
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Cliente registrado");
      setNuevo({ empresa: '', contacto: '', email: '', telefono: '', direccion: '' });
      cargarClientes();
    } else {
      alert("Error: " + data.error);
    }
  };

  const eliminar = async (id) => {
    if(!confirm("¿Eliminar este cliente de la base de datos?")) return;
    const res = await fetch(`http://localhost:5000/api/clientes/${id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    if (res.ok) cargarClientes();
    else alert(data.error);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>🤝 Directorio de Clientes</h2>
        
        <div className="row mt-4">
          {/* Formulario */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title mb-3">Nuevo Cliente</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Empresa / Razón Social</label>
                    <input type="text" className="form-control" required
                      value={nuevo.empresa} onChange={e => setNuevo({...nuevo, empresa: e.target.value})} 
                      placeholder="Ej: Salmonera Sur SPA" />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                        <label className="form-label small">Contacto</label>
                        <input type="text" className="form-control form-control-sm"
                        value={nuevo.contacto} onChange={e => setNuevo({...nuevo, contacto: e.target.value})} />
                    </div>
                    <div className="col-6 mb-2">
                        <label className="form-label small">Teléfono</label>
                        <input type="text" className="form-control form-control-sm"
                        value={nuevo.telefono} onChange={e => setNuevo({...nuevo, telefono: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Email</label>
                    <input type="email" className="form-control form-control-sm"
                      value={nuevo.email} onChange={e => setNuevo({...nuevo, email: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Dirección</label>
                    <textarea className="form-control form-control-sm" rows="2"
                      value={nuevo.direccion} onChange={e => setNuevo({...nuevo, direccion: e.target.value})}></textarea>
                  </div>
                  <button className="btn btn-primary w-100">Guardar Cliente</button>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="col-md-8">
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Empresa</th>
                                <th>Contacto</th>
                                <th>Info</th>
                                <th className="text-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(c => (
                                <tr key={c.id}>
                                    <td className="fw-bold text-primary">{c.empresa}</td>
                                    <td>
                                        <div className="small fw-bold">{c.contacto}</div>
                                        <div className="small text-muted">{c.email}</div>
                                    </td>
                                    <td className="small text-muted">{c.direccion}</td>
                                    <td className="text-end">
                                        <button onClick={() => eliminar(c.id)} className="btn btn-sm btn-outline-danger border-0">
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clientes.length === 0 && <tr><td colSpan="4" className="text-center p-3">Sin clientes registrados</td></tr>}
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

export default GestionClientes;