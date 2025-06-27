import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { AnimatePresence, motion as Motion } from "framer-motion";
import EventSuggestionModal from "./EventSuggestionModal";
import { toast } from "sonner";
import "../style/SuggestedEventsWidget.css";
import NoEventSuggested from "./NoEventSuggested";
import CalendarWidget from "./CalendarWidget";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedEventsWidget() {
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); //para manejar el evento seleccionado

  const { token, user } = useContext(AuthContext);

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

  const handleJoinEvent = async (event) => {
    try {
      const response = await fetch(`${API_URL}/events/${event._id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes("solicitud para unirte")) {
          toast.info("Ya has enviado una solicitud para este evento.", {
            className: "mi-toast",
            icon: "",
          });
          return;
        }
        throw new Error("Error al unirse al evento");
      }

      const data = await response.json();

      if (data.currentEvent) {
        setSuggestedEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev._id === event._id ? data.currentEvent : ev
          )
        );
      }

      setSelectedEvent(data.currentEvent);

      toast.success(
        event.requiresApproval
          ? "Solicitud enviada con éxito."
          : "¡Te has unido al evento!",
        { className: "mi-toast", icon: event.requiresApproval ? "📩" : "🎉" }
      );
    } catch (error) {
      console.error("Error al unirse al evento:", error);
      toast.error(
        "Hubo un error al intentar unirte al evento. Por favor, inténtalo de nuevo más tarde.",
        { className: "mi-toast", icon: "⚠️" }
      );
    }
  };

  return (
    <div className="modular-card-suggested-events-card">
      <div className="modular-card-content">
        {suggestedEvents.length === 0 && (
          <NoEventSuggested
            showCalendar={true}
            CalendarComponent={<CalendarWidget />}
            // showAI={true} // lo activamos mañana
          />
        )}
        <div>
          {suggestedEvents.length > 0 && (
            <ul className="event-suggestions-list">
              {suggestedEvents.map((event) => (
                <Motion.li
                  layoutId={event._id}
                  key={event._id}
                  className="event-suggestion-card"
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      Ver evento
                    </button>
                  </div>
                </Motion.li>
              ))}
            </ul>
          )}
          {/* === MODAL === */}
          <AnimatePresence>
            {selectedEvent && (
              <Motion.div
                layoutId={selectedEvent._id}
                className="event-suggestion-details-modal"
                onClick={() => setSelectedEvent(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <EventSuggestionModal
                  event={selectedEvent}
                  user={user}
                  handleOnClose={() => setSelectedEvent(null)}
                  handleJoinEvent={() => handleJoinEvent(selectedEvent)}
                />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SuggestedEventsWidget;

{
  /* <button
                    className="btn-ver-evento"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${selectedEvent._id}`);
                    }}
                  >
                    Ir al evento
                  </button> */
}

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
