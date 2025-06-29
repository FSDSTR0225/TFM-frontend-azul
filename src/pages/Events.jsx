import React, { useState, useEffect, useContext, useRef } from "react";
import { PacmanLoader } from "react-spinners";
import AuthContext from "../context/AuthContext";
import EventCard from "../components/EventCard";
import EventCardMini from "../components/EventCardMini";
import EventDetails from "../components/EventDetails";
import SearchAndCreateEvents from "../components/SearchAndCreateEvents";
import "../style/Events.css";

const API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null); // Estado para almacenar los detalles del evento seleccionado
  const [searchEvents, setSearchEvents] = useState("");
  const eventRefs = useRef({});
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventClick = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener detalles");

      const data = await response.json();
      console.log("Obtenido del backend:", data.currentEvent);
      setEventDetails(data.currentEvent); // Guardamos el evento detallado
    } catch (error) {
      console.error("Error al obtener el evento completo:", error);
    }
  };

  const handleMiniCardEventClick = (eventId) => {
    const ref = eventRefs.current[eventId];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCloseModal = () => {
    setEventDetails(null); // Limpiamos los detalles del evento al cerrar el modal
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchEvents.toLowerCase()) ||
      event.game?.name?.toLowerCase().includes(searchEvents.toLowerCase())
  );

  const { token } = useContext(AuthContext); // para enviar el token al backend

  const handleCreateEvent = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Evento creado:", data.event);

      if (!response.ok) {
        console.error("respuesta bakenc", data);
        throw new Error("Error al crear el evento");
      }

      const eventWhitId = {
        ...data.event,
        id: data.event._id || data.event.id, // usa _id si existe, si no id
      };

      // Opcional: recargar eventos tras crear uno nuevo
      setEvents((prev) => [...prev, eventWhitId]);
      console.log(events);
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("Error al crear el evento. Inténtalo de nuevo.");
    }
  };

  const onEventDeleted = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando eventos...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  if (error) {
    // Si hay un error, muestra el mensaje de error
    return <div>Error: {error}</div>;
  }

  return (
    <div className="event-page">
      <h1 className="title-event-page">Explora y crea eventos</h1>
      <SearchAndCreateEvents
        isLoggedIn={isLoggedIn}
        searchEvents={searchEvents}
        setSearchEvents={setSearchEvents}
        onCreate={handleCreateEvent}
      />

      <section className="mini-events-section">
        <h2 className="section-title">Proximos Eventos</h2>
        {filteredEvents.length === 0 ? (
          <p>No hay eventos disponibles en este momento.</p>
        ) : (
          <div className="mini-events-grid">
            {[...filteredEvents]
              .sort((a, b) => new Date(a.date) - new Date(b.date)) // ordenar de más próximo a más lejano
              .slice(0, 6)
              .map((event) => (
                <EventCardMini
                  key={event.id}
                  event={event}
                  onClick={() => handleMiniCardEventClick(event.id)}
                />
              ))}
          </div>
        )}
      </section>

      <section className="all-events">
        {filteredEvents.length === 0 ? (
          <p>No hay eventos disponibles en este momento.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              ref={(el) => (eventRefs.current[event.id] = el)} // <--- Aquí asignas la ref
            >
              <EventCard
                event={event}
                onClick={() => {
                  handleEventClick(event.id);
                }}
              />
            </div>
          ))
        )}
      </section>

      {eventDetails && (
        <EventDetails
          event={eventDetails}
          onClose={handleCloseModal}
          setSelectedEvent={setEventDetails}
          onEventDeleted={onEventDeleted}
        />
      )}
    </div>
  );
};

export default Events;
