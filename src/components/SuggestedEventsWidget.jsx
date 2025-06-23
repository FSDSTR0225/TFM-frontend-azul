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
        {suggestedEvents.length === 0 && <p>No hay sugerencias por ahora.</p>}
        <div>
          {suggestedEvents.length > 0 && (
            <ul className="event-suggestions-list">
              {suggestedEvents.map((event) => (
                <li key={event._id} className="event-suggestion-card">
                  <img
                    src={event.game.imageUrl}
                    alt={event.game.name}
                    className="event-card-bg-img"
                  />
                  <div className="event-suggestion-content">
                    <h4>- {event.title} -</h4>
                    <div className="event-suggestion-details">
                      <p>
                        <strong>Juego:</strong> {event.game.name}
                      </p>
                      <p>
                        <strong>Plataforma:</strong> {event.platform.name}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()} -{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="event-participants-info">
                      {event.maxParticipants
                        ? `${event.participants.length}/${event.maxParticipants}`
                        : "Sin límite"}
                    </div>
                    <button
                      className="btn-unirse"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      Ver evento
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuggestedEventsWidget;

//  OPCION 2: IMG POR FUERA

// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "../context/AuthContext";
// import { FaCalendarPlus } from "react-icons/fa";
// import "../style/SuggestedEventsWidget.css";

// const API_URL = import.meta.env.VITE_API_URL;

// function SuggestedEventsWidget() {
//   const [suggestedEvents, setSuggestedEvents] = useState([]);
//   const { token } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       try {
//         const res = await fetch(
//           `${API_URL}/dashboard/widgets/suggestions/events`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setSuggestedEvents(data.events);
//         } else {
//           console.error("Error:", data.message);
//         }
//       } catch (err) {
//         console.error("Error al obtener eventos sugeridos:", err);
//       }
//     };

//     fetchSuggestions();
//   }, [token]);

//   return (
//     <div className="modular-card suggested-events-card">
//       <div className="modular-card-header">
//         <FaCalendarPlus className="modular-card-icon" />
//         <h3>Eventos sugeridos</h3>
//       </div>
//       <div className="modular-card-content">
//         {suggestedEvents.length === 0 && <p>No hay sugerencias por ahora.</p>}
//         <div>
//           {suggestedEvents.length > 0 && (
//             <ul className="event-suggestions-list">
//               {suggestedEvents.map((event) => (
//                 <li key={event._id} className="event-suggestion-card">
//                   <img
//                     src={event.game.imageUrl}
//                     alt={event.game.name}
//                     className="event-card-bg-img"
//                   />
//                   <h4>{event.title}</h4>
//                   <div className="event-suggestion-details">
//                     <p>
//                       <strong>Juego:</strong> {event.game.name}
//                     </p>
//                     <p>
//                       <strong>Plataforma:</strong> {event.platform.name}
//                     </p>
//                     <p>
//                       <strong>Fecha:</strong>{" "}
//                       {new Date(event.date).toLocaleDateString()} -{" "}
//                       {new Date(event.date).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>
//                   <div className="event-participants-info">
//                     {event.maxParticipants
//                       ? `${event.participants.length}/${event.maxParticipants}`
//                       : "Sin límite"}
//                   </div>
//                   <button
//                     className="btn-unirse"
//                     onClick={() => navigate(`/events/${event._id}`)}
//                   >
//                     Ver evento
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SuggestedEventsWidget;
