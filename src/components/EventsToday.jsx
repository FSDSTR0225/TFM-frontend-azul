import React from "react";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/EventsToday.css";

const API_URL = import.meta.env.VITE_API_URL;

function EventsToday() {
  const [events, setEvents] = useState([]); //  ahora guardamos varios eventos
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEventsToday = async () => {
      try {
        const response = await fetch(`${API_URL}/events/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Error fetching events");
        }

        const data = await response.json();

        if (data.events && data.events.length > 0) {
          const ordenados = [...data.events].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          setEvents(ordenados);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventsToday();
  }, [token]);

  if (!events || events.length === 0) {
    return (
      <div className="no-events-today-visual">
        <div className="no-events-animated-text">
          <span>¡No tienes eventos para hoy!</span>
        </div>
      </div>
    );
  }

  // Limitar a un máximo de 4 eventos
  const maxEvents = 4;
  const eventsToShow = events.slice(0, maxEvents); //slice devuelve un nuevo array con los primeros 4 eventos

  // Agruparlos en filas de 2
  const rows = []; // Inicializamos un array para las filas
  // Recorremos los eventos y los agrupamos en filas de 2
  for (let i = 0; i < eventsToShow.length; i += 2) {
    rows.push(eventsToShow.slice(i, i + 2));
  }

  return (
    <div className="events-today-container">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`events-today-row ${
            row.length === 1 ? "center-single-card" : ""
          }`}
        >
          {row.map((event) => (
            <div key={event._id} className="events-today-card">
              <h2 className="card-title-events">¡Evento del dia!</h2>

              <h3 className="events-title-card-lobby">{event.title}</h3>

              <p className="events-date-card-lobby">
                <strong>Hora:</strong>{" "}
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="events-game-card-lobby">
                <strong>Juego:</strong> {event.game.name}
              </p>

              <div className="events-platform-card-lobby">
                <img
                  src={event.platform.icon}
                  alt={`Icono de ${event.platform.name}`}
                  className="events-icon-platform-card-lobby"
                />
                <span
                  className="events-platform-name"
                  title={event.platform.name}
                >
                  {event.platform.name === "Nintendo Switch"
                    ? "Switch"
                    : event.platform.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default EventsToday;
