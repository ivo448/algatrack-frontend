import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import { calendarioService } from '../utils/api';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es'; // Para que salga en español

function Calendario() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await calendarioService.getEventos();
        if (Array.isArray(data)) setEventos(data);
      } catch (err) {
        console.error("Error cargando calendario", err);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📅 Calendario Operativo</h2>
            <div>
                <span className="badge bg-primary me-2">🚚 Entregas (Pedidos)</span>
                <span className="badge bg-success">🌾 Cosechas (Lotes)</span>
            </div>
        </div>

        <div className="card shadow p-3">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={esLocale} // Pone días y meses en Español
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            events={eventos}
            eventClick={(info) => {
              alert(`Detalle: ${info.event.title}`);
            }}
            height="auto"
          />
        </div>
      </div>
    </>
  );
}

export default Calendario;