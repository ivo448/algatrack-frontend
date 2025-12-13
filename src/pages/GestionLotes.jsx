import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

function GestionLotes() {
  const [lotes, setLotes] = useState([]);
  const [nuevoLote, setNuevoLote] = useState({
    tipo_alga: 'Gracilaria',
    superficie: '',
    fecha_inicio: ''
  });

  // 1. Cargar Lotes
  const cargarLotes = async () => {
    const res = await fetch('http://localhost:5000/api/lotes', { credentials: 'include' });
    const data = await res.json();
    setLotes(data);
  };

  useEffect(() => { cargarLotes(); }, []);

  // 2. Crear Lote
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/lotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(nuevoLote)
    });
    if (res.ok) {
        alert("✅ Lote creado. Fecha de cosecha calculada automáticamente.");
        setNuevoLote({ tipo_alga: 'Gracilaria', superficie: '', fecha_inicio: '' });
        cargarLotes(); // Recargar tabla
    }
  };

  // 3. Acciones (Eliminar / Cosechar)
  const eliminarLote = async (id) => {
    if(!confirm("¿Borrar este lote?")) return;
    await fetch(`http://localhost:5000/api/lotes/${id}`, { method: 'DELETE', credentials: 'include' });
    cargarLotes();
  };

  const cosecharLote = async (id) => {
    await fetch(`http://localhost:5000/api/lotes/${id}/cosechar`, { method: 'PUT', credentials: 'include' });
    cargarLotes();
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>🌱 Gestión de Plantaciones</h2>
        <div className="row mt-4">
          
          {/* FORMULARIO */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">Nueva Siembra</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Tipo de Alga</label>
                    <select 
                        className="form-select" 
                        value={nuevoLote.tipo_alga}
                        onChange={e => setNuevoLote({...nuevoLote, tipo_alga: e.target.value})}
                    >
                        <option value="Gracilaria">Gracilaria (Rápida)</option>
                        <option value="Pelillo">Pelillo (Lenta)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Superficie (Hectáreas)</label>
                    <input 
                        type="number" step="0.1" className="form-control" required
                        value={nuevoLote.superficie}
                        onChange={e => setNuevoLote({...nuevoLote, superficie: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Fecha de Siembra</label>
                    <input 
                        type="date" className="form-control" required
                        value={nuevoLote.fecha_inicio}
                        onChange={e => setNuevoLote({...nuevoLote, fecha_inicio: e.target.value})}
                    />
                  </div>
                  <button className="btn btn-success w-100">Registrar Siembra</button>
                </form>
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div className="col-md-8">
            <div className="table-responsive shadow-sm">
                <table className="table table-hover border">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Superficie</th>
                            <th>Siembra</th>
                            <th>Cosecha Est.</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes.map(lote => (
                            <tr key={lote.id}>
                                <td>{lote.id}</td>
                                <td>{lote.tipo_alga}</td>
                                <td>{lote.superficie} Has</td>
                                <td>{new Date(lote.fecha_inicio).toLocaleDateString()}</td>
                                <td className="fw-bold text-success">
                                    {new Date(lote.fecha_cosecha_estimada).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className={`badge bg-${lote.estado === 'activo' ? 'primary' : 'secondary'}`}>
                                        {lote.estado}
                                    </span>
                                </td>
                                <td>
                                    {lote.estado === 'activo' && (
                                        <button onClick={() => cosecharLote(lote.id)} className="btn btn-sm btn-outline-warning me-2" title="Marcar como Cosechado">
                                            🌾
                                        </button>
                                    )}
                                    <button onClick={() => eliminarLote(lote.id)} className="btn btn-sm btn-outline-danger">
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
    </>
  );
}

export default GestionLotes;