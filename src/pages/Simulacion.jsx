import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Simulacion() {
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [cliente, setCliente] = useState(''); // NUEVO: Estado para Cliente
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSimulacion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/simulacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cantidad, fecha })
      });
      const data = await res.json();
      if (res.ok) setResultado(data);
      else setError(data.error);
    } catch (err) { setError('Error de conexión'); } 
    finally { setLoading(false); }
  };

  // NUEVA FUNCIÓN: Guardar Pedido
  const handleCrearPedido = async () => {
    if(!cliente) {
        alert("Por favor ingresa el nombre del Cliente para confirmar.");
        return;
    }
    if(!confirm("¿Generar orden de venta real?")) return;

    try {
        const res = await fetch('http://localhost:5000/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                cliente: cliente,
                producto: 'Pellet Estándar',
                cantidad: cantidad,
                fecha_entrega: fecha
            })
        });

        if(res.ok) {
            alert("✅ ¡Pedido Creado! Redirigiendo al Calendario...");
            navigate('/calendario');
        } else {
            alert("Error al guardar pedido");
        }
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">🔬 Simulador de Escenarios Productivos</h2>
        <p className="text-muted">Análisis de factibilidad ATP (Available to Promise).</p>

        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Datos del Escenario</h5>
                <form onSubmit={handleSimulacion}>
                  
                  {/* CAMPO CLIENTE NUEVO */}
                  <div className="mb-3">
                    <label className="form-label">Cliente / Proyecto</label>
                    <input 
                      type="text" className="form-control" 
                      value={cliente} onChange={e => setCliente(e.target.value)}
                      placeholder="Ej: Salmonera Sur"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Solicitud (Ton)</label>
                    <input 
                      type="number" className="form-control" 
                      value={cantidad} onChange={e => setCantidad(e.target.value)}
                      required min="0.1" step="0.1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha Entrega</label>
                    <input 
                      type="date" className="form-control" 
                      value={fecha} onChange={e => setFecha(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Calculando...' : 'Ejecutar Simulación'}
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {!resultado && !loading && (
              <div className="alert alert-info text-center py-5">
                <h4>Esperando parámetros...</h4>
              </div>
            )}

            {resultado && (
              <div className="fade-in">
                <div className={`alert alert-${resultado.color === 'green' ? 'success' : 'warning'} shadow-sm`}>
                   <h4 className="alert-heading">
                     {resultado.color === 'green' ? '✅ FACTIBLE' : '⚠️ REQUIERE CULTIVO'}
                   </h4>
                   <p className="mb-0 fs-5">{resultado.resumen}</p>
                </div>

                {/* Tarjeta de Tiempos */}
                <div className="card shadow border-info mb-3">
                  <div className="card-header bg-info text-white fw-bold">
                    ⏱️ Desglose de Tiempos ({resultado.datos.escenario.estacion})
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between">
                            <span>1. Fase Agrícola (Siembra/Cosecha)</span>
                            <span className="badge bg-warning text-dark">
                                {resultado.datos.operaciones.desglose_dias.cultivo_cosecha} días
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>2. Fase Industrial (Secado/Proceso)</span>
                            <span className="badge bg-primary">
                                {resultado.datos.operaciones.desglose_dias.procesamiento} días
                            </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between bg-light fw-bold">
                            <span>TOTAL LEAD TIME</span>
                            <span>{resultado.datos.operaciones.dias_totales_estimados} Días</span>
                        </li>
                    </ul>
                  </div>
                </div>

                {/* BOTÓN DE CONFIRMACIÓN */}
                {resultado.color === 'green' && (
                    <div className="d-grid gap-2">
                        <button onClick={handleCrearPedido} className="btn btn-success btn-lg shadow">
                            💾 Confirmar y Crear Pedido
                        </button>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Simulacion;