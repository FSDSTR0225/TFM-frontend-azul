import { React, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";
import EventCard from "../components/EventCard";
import EventDetails from "../components/EventDetails";
import "../style/MyEvents.css";

const API_URL = import.meta.env.VITE_API_URL;

function MyEvents() {
  const [loading, setLoading] = useState(true);
  const [eventsfiltered, setEventsFiltered] = useState("creados");
  const [myEventsCreated, setMyEventsCreated] = useState([]);
  const [myEventsJoined, setMyEventsJoined] = useState([]);
  const [createdTotal, setCreatedTotal] = useState(0);
  const [joinedTotal, setJoinedTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { token, isLoggedIn } = useContext(AuthContext);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isLoggedIn) return;

      try {
        const creados = await fetch(`${API_URL}/events/my-events/created`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const creadosData = await creados.json();
        setMyEventsCreated(
          Array.isArray(creadosData.eventos) ? creadosData.eventos : []
        );
        setCreatedTotal(creadosData.total || 0);

        const unidos = await fetch(`${API_URL}/events/my-events/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unidosData = await unidos.json();
        setMyEventsJoined(
          Array.isArray(unidosData.eventos) ? unidosData.eventos : []
        );
        setJoinedTotal(unidosData.total || 0);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [isLoggedIn, token]);

  const handleEventDeleted = (id) => {
    setMyEventsCreated((prev) => prev.filter((e) => e._id !== id));
    setMyEventsJoined((prev) => prev.filter((e) => e._id !== id));

    if (eventsfiltered === "creados") setCreatedTotal((prev) => prev - 1);
    else if (eventsfiltered === "unido") setJoinedTotal((prev) => prev - 1);

    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando eventos...</h1>
        <PacmanLoader color="#FFD700" size={40} />
      </div>
    );
  }

  return (
    <div className="myEvents-container">
      <div className="myEvents-btns">
        <button
          className={eventsfiltered === "creados" ? "active-btn" : ""}
          onClick={() => setEventsFiltered("creados")}
        >
          Eventos creados por mí
          <span className="badge-total">{createdTotal}</span>
        </button>
        <button
          className={eventsfiltered === "unido" ? "active-btn" : ""}
          onClick={() => setEventsFiltered("unido")}
        >
          Eventos que me he unido
          <span className="badge-total">{joinedTotal}</span>
        </button>
      </div>

      <div className="myEvents-tab">
        {showModal && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setShowModal(false)}
            setSelectedEvent={setSelectedEvent}
            onEventDeleted={handleEventDeleted}
          />
        )}

        {eventsfiltered === "creados" &&
          (myEventsCreated.length > 0 ? (
            myEventsCreated.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))
          ) : (
            <p className="no-events-msg">Aún no has creado ningún evento.</p>
          ))}

        {eventsfiltered === "unido" &&
          (myEventsJoined.length > 0 ? (
            myEventsJoined.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))
          ) : (
            <p className="no-events-msg">
              No te has unido a ningún evento aún.
            </p>
          ))}
      </div>
    </div>
  );
}

export default MyEvents;

//PARTE ELIMINADA PARA LA PESTAÑA DE "TODOS MIS EVENTOS"
// const [allMyEvents, setAllMyEvents] = useState([]);
// const [totalAll, setTotalAll] = useState(0);

// En useEffect:
// const all = await fetch(`${API_URL}/events/my-events`, {
//   headers: { Authorization: `Bearer ${token}` },
// });
// const allData = await all.json();
// setAllMyEvents(Array.isArray(allData.eventos) ? allData.eventos : []);
// setTotalAll(allData.total || 0);

// En botones:
// <button
//   className={eventsfiltered === "todos" ? "active-btn" : ""}
//   onClick={() => setEventsFiltered("todos")}
// >
//   Todos mis eventos
//   <span className="badge-total">{totalAll}</span>
// </button>

// En renderizado de eventos:
// {eventsfiltered === "todos" &&
//   (allMyEvents.length > 0 ? (
//     allMyEvents.map((event) => (
//       <EventCard
//         key={event._id}
//         event={event}
//         onClick={() => handleEventClick(event)}
//       />
//     ))
//   ) : (
//     <p className="no-events-msg">
//       No tienes eventos todavía. ¡Únete o crea el tuyo propio!
//     </p>
//   ))}
