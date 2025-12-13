import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) window.location.href = '/';
        return res.json();
      })
      .then(setData);
  }, []);

  if (!data) return <div className="text-center mt-5">Cargando datos de producción...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="mb-4">Panel de Control Gerencial</h2>
        
        <div className="row">
          {/* KPI 1 */}
          <div className="col-md-6 mb-4">
            <div className="card text-white bg-primary h-100 shadow">
              <div className="card-body text-center">
                <h5 className="card-title">Lotes Activos (En Cultivo)</h5>
                <p className="display-3 fw-bold">{data.kpis.lotes_activos}</p>
                <small>Datos en tiempo real (PostgreSQL)</small>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="col-md-6 mb-4">
            <div className="card text-white bg-warning h-100 shadow">
              <div className="card-body text-center">
                <h5 className="card-title">Pedidos Pendientes</h5>
                <p className="display-3 fw-bold">{data.kpis.pedidos_pendientes}</p>
                <small>Requieren atención comercial</small>
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