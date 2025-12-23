import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [nuevo, setNuevo] = useState({
    cliente: '',
    producto: 'Pellet Premium',
    cantidad_ton: '',
    fecha_entrega: ''
  });

  // Cargar pedidos al inicio
  const cargarPedidos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pedidos', { credentials: 'include' });
      if (res.ok) setPedidos(await res.json());
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => { cargarPedidos(); }, []);

  // Crear Pedido
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(nuevo)
    });
    if (res.ok) {
      alert("✅ Pedido creado");
      setNuevo({ cliente: '', producto: 'Pellet Premium', cantidad_ton: '', fecha_entrega: '' });
      cargarPedidos();
    }
  };

  // Cambiar Estado (Entregar/Cancelar)
  const actualizarEstado = async (id, estado) => {
    if(!confirm(`¿Marcar este pedido como ${estado.toUpperCase()}?`)) return;
    
    await fetch(`http://localhost:5000/api/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ estado })
    });
    cargarPedidos();
  };

  // Eliminar
  const eliminar = async (id) => {
    if(!confirm("¿Eliminar este pedido permanentemente?")) return;
    await fetch(`http://localhost:5000/api/pedidos/${id}`, { method: 'DELETE', credentials: 'include' });
    cargarPedidos();
  };

  const [listaClientes, setListaClientes] = useState([]);

  // Cargar lista de clientes para el select
  const cargarClientes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clientes', { credentials: 'include' });
        if (res.ok) setListaClientes(await res.json());
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
    };
    useEffect(() => { cargarClientes(); }, []);
    

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>📦 Gestión de Pedidos</h2>
        
        <div className="row mt-4">
          {/* Formulario de Ingreso */}
          <div className="col-md-3">
            <div className="card shadow-sm border-primary">
              <div className="card-header bg-primary text-white">Nuevo Pedido</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label>Cliente</label>
                    <select className="form-select" required
                        value={nuevo.cliente} onChange={e => setNuevo({...nuevo, cliente: e.target.value})}>
                        <option value="">Seleccione Cliente...</option>
                        {listaClientes.map(c => (
                            <option key={c.id} value={c.empresa}>{c.empresa}</option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Producto</label>
                    <select className="form-select" value={nuevo.producto} onChange={e => setNuevo({...nuevo, producto: e.target.value})}>
                      <option>Pellet Premium</option>
                      <option>Biomasa Seca</option>
                      <option>Fertilizante</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Cantidad (Ton)</label>
                    <input type="number" step="0.1" className="form-control" required
                      value={nuevo.cantidad_ton} onChange={e => setNuevo({...nuevo, cantidad_ton: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label>Fecha Entrega</label>
                    <input type="date" className="form-control" required
                      value={nuevo.fecha_entrega} onChange={e => setNuevo({...nuevo, fecha_entrega: e.target.value})} />
                  </div>
                  <button className="btn btn-primary w-100">Registrar Venta</button>
                </form>
              </div>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Producto</th>
                      <th>Ton</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(p => (
                      <tr key={p.id} className={p.estado === 'entregado' ? 'table-success opacity-75' : ''}>
                        <td>{new Date(p.fecha_entrega).toLocaleDateString()}</td>
                        <td className="fw-bold">{p.cliente}</td>
                        <td>{p.producto}</td>
                        <td>{p.cantidad_ton}</td>
                        <td>
                          <span className={`badge bg-${
                            p.estado === 'entregado' ? 'success' : 
                            p.estado === 'cancelado' ? 'secondary' : 'warning text-dark'
                          }`}>
                            {p.estado.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end">
                          {p.estado === 'pendiente' && (
                            <>
                              <button onClick={() => actualizarEstado(p.id, 'entregado')} className="btn btn-sm btn-success me-1" title="Entregar">
                                ✅
                              </button>
                              <button onClick={() => actualizarEstado(p.id, 'cancelado')} className="btn btn-sm btn-secondary me-1" title="Cancelar">
                                🚫
                              </button>
                            </>
                          )}
                          <button onClick={() => eliminar(p.id)} className="btn btn-sm btn-outline-danger">🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && <tr><td colSpan="6" className="text-center p-4">No hay pedidos registrados</td></tr>}
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

export default GestionPedidos;