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
      <div className="no-events-today">
        <h2>No hay eventos programados para hoy</h2>
      </div>
    );
  }

  return (
    <div className="events-today-container">
      {events.map((event) => (
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
            <span className="events-platform-name">{event.platform.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventsToday;
