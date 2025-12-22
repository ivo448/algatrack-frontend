import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { simulacionService } from '../utils/api'; // Usamos el servicio centralizado

function Simulacion() {
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [cliente, setCliente] = useState(''); 
  
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
      // Usamos el servicio de api.js para mantener consistencia
      const data = await simulacionService.runSimulacion(cantidad, fecha);
      
      // El backend retorna { resumen, color, datos: {...} }
      if (data && data.datos) {
          setResultado(data);
      } else {
          setError("Respuesta inesperada del servidor");
      }
    } catch (err) { 
        setError(err.message || 'Error de conexión con el motor de simulación'); 
    } 
    finally { setLoading(false); }
  };

  const handleCrearPedido = async () => {
    if(!cliente) {
        alert("⚠️ Por favor ingresa el nombre del Cliente para confirmar.");
        return;
    }
    if(!confirm(`¿Confirmar venta a ${cliente} por ${cantidad} Toneladas?`)) return;

    try {
        // Aquí deberías llamar a un servicio en api.js, pero mantenemos fetch directo por brevedad
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
            alert("✅ ¡Pedido Creado Exitosamente!");
            navigate('/dashboard'); // Redirigir al dashboard es más lógico tras una venta
        } else {
            alert("❌ Error al guardar pedido");
        }
    } catch (e) { console.error(e); }
  };

  // Función auxiliar para formatear dinero (CLP)
  const formatoDinero = (monto) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h2 className="mb-1">🔬 Simulador ATP & Costos</h2>
                <p className="text-muted">Proyección Financiera y Biológica Parametrizada</p>
            </div>
            {/* Badge de conexión a BD Paramétrica */}
            <span className="badge bg-secondary">
                <i className="bi bi-database-check"></i> Conexión DB Activa
            </span>
        </div>

        <div className="row">
          {/* PANEL DE CONTROL (IZQUIERDA) */}
          <div className="col-md-4">
            <div className="card shadow-sm mb-4 border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title text-primary mb-3">🛠️ Parámetros de Entrada</h5>
                <form onSubmit={handleSimulacion}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Cliente / Proyecto</label>
                    <input 
                      type="text" className="form-control" 
                      value={cliente} onChange={e => setCliente(e.target.value)}
                      placeholder="Ej: Exportadora Atacama"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Cantidad (Toneladas)</label>
                    <input 
                      type="number" className="form-control form-control-lg" 
                      value={cantidad} onChange={e => setCantidad(e.target.value)}
                      required min="0.1" step="0.1" placeholder="0.0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Fecha Entrega Prometida</label>
                    <input 
                      type="date" className="form-control" 
                      value={fecha} onChange={e => setFecha(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
                    {loading ? (
                        <span><span className="spinner-border spinner-border-sm me-2"></span>Calculando...</span>
                    ) : '⚡ Ejecutar Simulación'}
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3 small">{error}</div>}
              </div>
            </div>
            
            {/* Info estática de ayuda */}
            <div className="alert alert-light text-muted small border">
                <i className="bi bi-info-circle me-1"></i>
                El sistema consultará los <strong>precios actualizados del agua y energía</strong> en la base de datos antes de calcular.
            </div>
          </div>

          {/* PANEL DE RESULTADOS (DERECHA) */}
          <div className="col-md-8">
            {!resultado && !loading && (
              <div className="text-center py-5 text-muted border rounded bg-white">
                <h1>📊</h1>
                <h4>Esperando simulación...</h4>
                <p>Ingresa los datos para calcular viabilidad técnica y económica.</p>
              </div>
            )}

            {resultado && (
              <div className="fade-in">
                {/* 1. DICTAMEN PRINCIPAL */}
                <div className={`alert alert-${resultado.color === 'green' ? 'success' : 'warning'} shadow-sm border-start border-5 border-${resultado.color === 'green' ? 'success' : 'warning'}`}>
                   <div className="d-flex justify-content-between align-items-center">
                       <div>
                           <h4 className="alert-heading fw-bold mb-1">
                             {resultado.color === 'green' ? '✅ VIABLE PARA VENTA' : '⚠️ RIESGO DE QUIEBRE'}
                           </h4>
                           <span className="fs-5">{resultado.resumen}</span>
                       </div>
                       <div className="text-end">
                           <small className="text-muted d-block">Estación Biológica</small>
                           {/* NUEVO: Muestra si es Invierno/Verano según BD */}
                           <span className="badge bg-info text-dark fs-6">
                               {resultado.datos.escenario.estacion_detectada}
                           </span>
                       </div>
                   </div>
                </div>

                <div className="row g-3">
                    {/* 2. TARJETA FINANCIERA (LA JOYA DE TU PROYECTO) */}
                    <div className="col-md-7">
                        <div className="card shadow-sm h-100 border-primary">
                            <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between">
                                <span>💰 Análisis de Costos (Zona Norte)</span>
                                <span>{formatoDinero(resultado.datos.financiero.costo_total)}</span>
                            </div>
                            <div className="card-body">
                                <p className="small text-muted mb-3">Costos calculados con parámetros de BD en tiempo real.</p>
                                
                                <ul className="list-group list-group-flush small">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>💧 Agua Industrial</span>
                                        <span className="fw-bold">{formatoDinero(resultado.datos.financiero.detalle_costos.agua)}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>⚡ Energía (Secado)</span>
                                        <span className="fw-bold">{formatoDinero(resultado.datos.financiero.detalle_costos.energia)}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>🚜 Diesel Maquinaria</span>
                                        <span className="fw-bold">{formatoDinero(resultado.datos.financiero.detalle_costos.diesel)}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>👷 Mano de Obra</span>
                                        <span className="fw-bold">{formatoDinero(resultado.datos.financiero.detalle_costos.mano_obra)}</span>
                                    </li>
                                    {/* Si hay déficit, mostramos el recargo */}
                                    {resultado.datos.resultado.deficit_a_cultivar > 0 && (
                                        <li className="list-group-item list-group-item-warning d-flex justify-content-between align-items-center">
                                            <span>⚠️ Recargo por Urgencia</span>
                                            <span className="text-danger fw-bold">+15%</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 3. TARJETA OPERATIVA */}
                    <div className="col-md-5">
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-dark text-white fw-bold">
                                ⏱️ Lead Time
                            </div>
                            <div className="card-body text-center d-flex flex-column justify-content-center">
                                <h2 className="display-4 fw-bold text-dark">
                                    {resultado.datos.operaciones.dias_totales}
                                </h2>
                                <span className="text-muted text-uppercase small ls-1">Días Estimados</span>
                                <hr />
                                <div className="text-start small">
                                    <p className="mb-1"><strong>Stock Actual:</strong> {resultado.datos.resultado.stock_disponible} Ton</p>
                                    <p className="mb-0 text-danger"><strong>Déficit:</strong> {resultado.datos.resultado.deficit_a_cultivar} Ton</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTÓN DE CIERRE */}
                {resultado.color === 'green' && (
                    <div className="mt-4 d-grid">
                        <button onClick={handleCrearPedido} className="btn btn-success btn-lg shadow fw-bold">
                            💾 Confirmar Pedido y Bloquear Stock
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