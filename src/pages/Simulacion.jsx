import { useState } from 'react';
import Navbar from '../components/navbar';

function Simulacion() {
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

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
      
      if (res.ok) {
        setResultado(data);
      } else {
        setError(data.error || 'Error en la simulación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">🔬 Simulador de Escenarios Productivos</h2>
        <p className="text-muted">Estima tiempos de ciclo completo (Cultivo + Cosecha + Proceso) según estacionalidad.</p>

        <div className="row">
          {/* Columna Izquierda: Formulario */}
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Parámetros de Entrada</h5>
                <form onSubmit={handleSimulacion}>
                  <div className="mb-3">
                    <label className="form-label">Solicitud (Toneladas)</label>
                    <input 
                      type="number" className="form-control" 
                      value={cantidad} onChange={e => setCantidad(e.target.value)}
                      required min="0.1" step="0.1" placeholder="Ej: 10"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fecha de Entrega Deseada</label>
                    <input 
                      type="date" className="form-control" 
                      value={fecha} onChange={e => setFecha(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Calculando Escenarios...' : 'Ejecutar Simulación'}
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
            
            {/* Pequeña leyenda */}
            <div className="alert alert-light border">
                <small>
                    ℹ️ <strong>Nota:</strong> El sistema considera factores climáticos (invierno/verano) para calcular tiempos de crecimiento de biomasa y secado.
                </small>
            </div>
          </div>

          {/* Columna Derecha: Resultados */}
          <div className="col-md-8">
            {!resultado && !loading && (
              <div className="alert alert-info text-center py-5">
                <h4>Esperando datos...</h4>
                <p>Ingresa los parámetros para calcular el ciclo productivo.</p>
              </div>
            )}

            {resultado && (
              <div className="fade-in">
                {/* Encabezado del Resultado */}
                <div className={`alert alert-${resultado.color === 'green' ? 'success' : 'warning'} shadow-sm`}>
                   <h4 className="alert-heading">
                     {resultado.color === 'green' ? '✅ ENTREGA INMEDIATA' : '⚠️ REQUIERE PLANIFICACIÓN AGRÍCOLA'}
                   </h4>
                   <p className="mb-0 fs-5">{resultado.resumen}</p>
                </div>

                {/* Tarjeta Única de Tiempos Operativos */}
                <div className="card shadow border-info mb-3">
                  <div className="card-header bg-info text-white fw-bold d-flex justify-content-between align-items-center">
                    <span>⏱️ Desglose de Tiempos Operativos</span>
                    <span className="badge bg-light text-dark">Estación: {resultado.datos.escenario.estacion}</span>
                  </div>
                  
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                        
                        {/* 1. Fase Agrícola */}
                        <li className={`list-group-item d-flex justify-content-between align-items-center ${resultado.datos.operaciones.desglose_dias.cultivo_cosecha > 0 ? 'list-group-item-warning' : ''}`}>
                            <div>
                                <span className="fw-bold">1. Fase Agrícola</span>
                                <div className="text-muted small">Tiempo de crecimiento de biomasa y cosecha en mar.</div>
                            </div>
                            <span className="badge bg-warning text-dark fs-6 rounded-pill">
                                {resultado.datos.operaciones.desglose_dias.cultivo_cosecha} días
                            </span>
                        </li>

                        {/* 2. Fase Industrial */}
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold">2. Fase Industrial</span>
                                <div className="text-muted small">Procesamiento, secado y conversión a pellet.</div>
                            </div>
                            <span className="badge bg-primary rounded-pill fs-6">
                                {resultado.datos.operaciones.desglose_dias.procesamiento} días
                            </span>
                        </li>

                        {/* 3. Logística */}
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold">3. Setup y Logística</span>
                                <div className="text-muted small">Configuración de máquinas y empaquetado final.</div>
                            </div>
                            <span className="badge bg-secondary rounded-pill fs-6">
                                2.0 días
                            </span>
                        </li>
                    </ul>
                  </div>
                  
                  <div className="card-footer bg-light text-center py-3">
                    <h5 className="mb-0 text-muted">Tiempo Total Estimado (Lead Time)</h5>
                    <h2 className="text-info fw-bold display-4">
                        {resultado.datos.operaciones.dias_totales_estimados} <span className="fs-4 text-muted">Días</span>
                    </h2>
                  </div>
                </div>

                {/* Datos de Stock */}
                <div className="d-flex justify-content-between text-muted small px-2">
                    <span>Stock Actual: {resultado.datos.resultado.stock_disponible} Ton</span>
                    <span>Déficit a Cubrir: {resultado.datos.resultado.deficit_a_cultivar} Ton</span>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Simulacion;