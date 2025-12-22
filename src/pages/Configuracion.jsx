import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { configService } from '../utils/api';

function Configuracion() {
  const [activeTab, setActiveTab] = useState('economica'); // economica | biologica
  const [paramsEconomicos, setParamsEconomicos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const eco = await configService.getEconomicos();
      const bio = await configService.getEstaciones();
      setParamsEconomicos(eco);
      setEstaciones(bio);
    } catch (error) {
      alert("Error cargando configuración: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJO DE CAMBIOS ECONÓMICOS ---
  const handleEcoChange = (clave, nuevoValor) => {
    setParamsEconomicos(prev => prev.map(item => 
      item.clave === clave ? { ...item, valor: parseFloat(nuevoValor) || 0 } : item
    ));
  };

  const guardarEconomicos = async () => {
    if(!confirm("¿Confirmar actualización de precios del sistema?")) return;
    setSaving(true);
    try {
      await configService.updateEconomicos(paramsEconomicos);
      alert("✅ Parámetros económicos actualizados");
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // --- MANEJO DE CAMBIOS BIOLÓGICOS ---
  const handleBioChange = (id, field, value) => {
    setEstaciones(prev => prev.map(est => 
        est.id === id ? { ...est, [field]: value } : est
    ));
  };

  const guardarEstacion = async (estacion) => {
    setSaving(true);
    try {
        // Convertir meses string a formato correcto si es necesario
        await configService.updateEstacion(estacion);
        alert(`✅ Estación ${estacion.nombre_estacion} actualizada`);
    } catch (error) {
        alert("❌ Error: " + error.message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando configuración...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <h2 className="mb-4">⚙️ Configuración del Sistema</h2>

        {/* PESTAÑAS */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
                className={`nav-link ${activeTab === 'economica' ? 'active fw-bold' : ''}`}
                onClick={() => setActiveTab('economica')}
            >
                💰 Variables Económicas
            </button>
          </li>
          <li className="nav-item">
            <button 
                className={`nav-link ${activeTab === 'biologica' ? 'active fw-bold' : ''}`}
                onClick={() => setActiveTab('biologica')}
            >
                🧬 Biología y Clima
            </button>
          </li>
        </ul>

        {/* CONTENIDO PESTAÑA ECONÓMICA */}
        {activeTab === 'economica' && (
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <span className="text-muted small">Estos valores afectan directamente el cálculo de costos financieros.</span>
                <button onClick={guardarEconomicos} disabled={saving} className="btn btn-primary btn-sm">
                    {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Parámetro</th>
                                <th>Valor Actual</th>
                                <th>Unidad</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paramsEconomicos.map((param) => (
                                <tr key={param.clave}>
                                    <td className="fw-bold text-primary">{param.clave}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm"
                                            style={{width: '120px'}}
                                            value={param.valor}
                                            onChange={(e) => handleEcoChange(param.clave, e.target.value)}
                                        />
                                    </td>
                                    <td><span className="badge bg-secondary">{param.unidad}</span></td>
                                    <td className="text-muted small">{param.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA BIOLÓGICA */}
        {activeTab === 'biologica' && (
          <div className="row">
            {estaciones.map((est) => (
                <div key={est.id} className="col-md-12 mb-3">
                    <div className="card border-info shadow-sm">
                        <div className="card-header bg-info text-white fw-bold d-flex justify-content-between">
                            <span>Temporada: {est.nombre_estacion}</span>
                            <button 
                                onClick={() => guardarEstacion(est)} 
                                disabled={saving}
                                className="btn btn-light btn-sm text-info fw-bold"
                            >
                                💾 Actualizar
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Meses Activos (CSV)</label>
                                    <input 
                                        type="text" className="form-control" 
                                        value={est.meses_asociados}
                                        onChange={(e) => handleBioChange(est.id, 'meses_asociados', e.target.value)}
                                    />
                                    <div className="form-text">Ej: 5,6,7,8 (Mayo a Agosto)</div>
                                </div>
                                <div className="col-md-6">
                                    <div className="alert alert-light border small mb-0">
                                        {est.descripcion}
                                    </div>
                                </div>
                                
                                <div className="col-md-3">
                                    <label className="form-label small">Factor Biomasa</label>
                                    <input 
                                        type="number" step="0.1" className="form-control" 
                                        value={est.factor_biomasa}
                                        onChange={(e) => handleBioChange(est.id, 'factor_biomasa', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small">Factor Crecimiento</label>
                                    <input 
                                        type="number" step="0.1" className="form-control" 
                                        value={est.factor_crecimiento}
                                        onChange={(e) => handleBioChange(est.id, 'factor_crecimiento', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small">Factor Energía</label>
                                    <input 
                                        type="number" step="0.1" className="form-control" 
                                        value={est.factor_energia}
                                        onChange={(e) => handleBioChange(est.id, 'factor_energia', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small">Factor Secado</label>
                                    <input 
                                        type="number" step="0.1" className="form-control" 
                                        value={est.factor_secado}
                                        onChange={(e) => handleBioChange(est.id, 'factor_secado', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Configuracion;