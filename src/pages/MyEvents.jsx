import { React, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";
import EventCard from "../components/EventCard";
import EventDetails from "../components/EventDetails";
import "../style/MyEvents.css";

const API_URL = import.meta.env.VITE_API_URL;

function MyEvents() {
  const [loading, setLoading] = useState(true);
  const [eventsfiltered, setEventsFiltered] = useState("todos");
  const [allMyEvents, setAllMyEvents] = useState([]);
  const [myEventsCreated, setMyEventsCreated] = useState([]);
  const [myEventsJoined, setMyEventsJoined] = useState([]);
  const [totalAll, setTotalAll] = useState(0);
  const [createdTotal, setCreatedTotal] = useState(0);
  const [joinedTotal, setJoinedTotal] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const authContext = useContext(AuthContext);
  const { token, isLoggedIn } = authContext;

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isLoggedIn) return;

      const url =
        eventsfiltered === "todos"
          ? `${API_URL}/events/my-events`
          : eventsfiltered === "creados"
          ? `${API_URL}/events/my-events/created`
          : eventsfiltered === "unido"
          ? `${API_URL}/events/my-events/joined`
          : null;
      if (!url) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener eventos");

        const data = await response.json();
        console.log("Evento recibido:", data.eventos);
        if (eventsfiltered === "todos") {
          setAllMyEvents(Array.isArray(data.eventos) ? data.eventos : []);
          setTotalAll(data.total);
        } else if (eventsfiltered === "creados") {
          setMyEventsCreated(Array.isArray(data.eventos) ? data.eventos : []);
          setCreatedTotal(data.total);
        } else if (eventsfiltered === "unido") {
          setMyEventsJoined(Array.isArray(data.eventos) ? data.eventos : []);
          setJoinedTotal(data.total);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener solicitudess:", error);
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [isLoggedIn, token, eventsfiltered]);

  // para gestionar la eliminación de eventos y que se actualicen las listas y sus totales para los badges
  const handleEventDeleted = (id) => {
    setAllMyEvents((prev) => prev.filter((e) => e._id !== id)); // Filtramos el evento eliminado de la lista de todos los eventos
    setMyEventsCreated((prev) => prev.filter((e) => e._id !== id)); // Filtramos el evento eliminado de la lista de eventos creados
    setMyEventsJoined((prev) => prev.filter((e) => e._id !== id)); // Filtramos el evento eliminado de la lista de eventos unidos

    if (eventsfiltered === "todos")
      setTotalAll((prev) => prev - 1); // Actualizamos el total de eventos
    else if (eventsfiltered === "creados") setCreatedTotal((prev) => prev - 1);
    // Actualizamos el total de eventos creados
    else if (eventsfiltered === "unido") setJoinedTotal((prev) => prev - 1); // Actualizamos el total de eventos unidos

    setShowModal(false);
  };

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando plataformas...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="myEvents-container">
      <div className="myEvents-btns">
        <button
          className={eventsfiltered === "todos" ? "active-btn" : ""}
          onClick={() => setEventsFiltered("todos")}
        >
          Todos mis eventos
          <span className="badge-total">{totalAll}</span>
        </button>
        <button
          className={eventsfiltered === "creados" ? "active-btn" : ""}
          onClick={() => setEventsFiltered("creados")}
        >
          Eventos creados por mi
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
        {eventsfiltered === "todos" &&
          allMyEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        {eventsfiltered === "todos" && myEventsCreated.length === 0 && (
          <p className="no-events-msg">
            No tienes eventos todavia.¡Únete o crea el tuyo propio!
          </p>
        )}
        {eventsfiltered === "creados" &&
          myEventsCreated.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        {eventsfiltered === "creados" && myEventsCreated.length === 0 && (
          <p className="no-events-msg">Aún no has creado ningún evento.</p>
        )}
        {eventsfiltered === "unido" &&
          myEventsJoined.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
      </div>
    </div>
  );
}

export default MyEvents;
