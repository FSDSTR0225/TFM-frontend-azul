import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/SuggestedEventsWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedEventsWidget() {
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setSuggestedEvents(data.events);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error al obtener eventos sugeridos:", err);
      }
    };

    fetchSuggestions();
  }, [token]);

  return (
    <div className="suggested-events-widget">
      <h3 className="widget-title">Eventos sugeridos</h3>
      {suggestedEvents.length === 0 ? (
        <p>No hay sugerencias por ahora.</p>
      ) : (
        <ul className="event-suggestions-list">
          {suggestedEvents.map((event) => (
            <li key={event._id} className="event-suggestion-card">
              <h4>{event.title}</h4>
              <p>
                <strong>Juego:</strong> {event.game.name}
              </p>
              <p>
                <strong>Plataforma:</strong> {event.platform.name}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <button className="btn-unirse">Ver evento</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SuggestedEventsWidget;
