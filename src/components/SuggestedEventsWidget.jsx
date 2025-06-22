import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaCalendarPlus } from "react-icons/fa";
import "../style/SuggestedEventsWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedEventsWidget() {
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="modular-card suggested-events-card">
      <div className="modular-card-header">
        <FaCalendarPlus className="modular-card-icon" />
        <h3>Eventos sugeridos</h3>
      </div>
      <div className="modular-card-content">
        {suggestedEvents.length === 0 ? (
          <p>No hay sugerencias por ahora.</p>
        ) : (
          <ul className="event-suggestions-list">
            {suggestedEvents.map((event) => {
              const eventDate = new Date(event.date);
              const dateStr = eventDate.toLocaleDateString();
              const timeStr = eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <li key={event._id} className="event-suggestion-card">
                  <h4>{event.title}</h4>
                  <p>
                    <strong>Juego:</strong> {event.game.name}
                  </p>
                  <p>
                    <strong>Plataforma:</strong> {event.platform.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {dateStr} - {timeStr}
                  </p>
                  {event.maxParticipants && (
                    <p>
                      <strong>Cupo:</strong> {event.participants?.length ?? 0} /{" "}
                      {event.maxParticipants}
                    </p>
                  )}
                  <button
                    className="btn-unirse"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    Ver evento
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SuggestedEventsWidget;
