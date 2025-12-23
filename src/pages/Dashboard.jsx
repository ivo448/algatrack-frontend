import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Agregamos useNavigate
import Navbar from '../components/Navbar';
import { dashboardService } from '../utils/api'; // <--- IMPORTANTE: Usamos el servicio centralizado

function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Reemplazamos el fetch directo por el servicio
    dashboardService.getDashboard()
      .then(setData)
      .catch(err => {
        console.error("Error cargando dashboard:", err);
        // Si el error es de autenticación (401), redirigir al login
        if (err.status === 401) {
            navigate('/');
        }
      });
  }, [navigate]);

  if (!data) return <div className="text-center mt-5">Cargando datos de producción...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <h2 className="mb-4">Panel de Control Gerencial</h2>
        
        <div className="row">
          {/* KPI 1 */}
          <div className="col-md-6 mb-4">
            <div className="card text-white bg-primary h-100 shadow">
              <div className="card-body text-center">
                <h5 className="card-title">Lotes Activos (En Cultivo)</h5>
                <p className="display-3 fw-bold">{data.kpis.lotes_activos}</p>
                <Link to="/gestion-lotes" className="btn btn-light">Ver Lotes</Link>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="col-md-6 mb-4">
            <div className="card text-white bg-warning h-100 shadow">
              <div className="card-body text-center">
                <h5 className="card-title">Pedidos Pendientes</h5>
                <p className="display-3 fw-bold">{data.kpis.pedidos_pendientes}</p>
                <Link to="/gestion-pedidos" className="btn btn-light">Ver Pedidos</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico Simple */}
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-white fw-bold">Historial de Producción (Toneladas)</div>
          <div className="card-body">
            <table className="table table-striped table-hover">
              <thead>
                <tr><th>Mes</th><th>Producción Realizada</th></tr>
              </thead>
              <tbody>
                {data.grafico.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <div className="progress" style={{height: '24px'}}>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{width: `${item.produccion}%`}}
                        >
                          {item.produccion} Ton
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;