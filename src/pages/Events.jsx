import React, { useState, useEffect, useContext, useRef } from "react";
import { PacmanLoader } from "react-spinners";
import AuthContext from "../context/AuthContext";
import EventCard from "../components/EventCard";
import EventCardMini from "../components/EventCardMini";
import EventDetails from "../components/EventDetails";
import SearchAndCreateEvents from "../components/SearchAndCreateEvents";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { socket } from "../socket";
import "../style/Events.css";

const API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null); // Estado para almacenar los detalles del evento seleccionado
  const [searchEvents, setSearchEvents] = useState(""); // Estado para almacenar la búsqueda de eventos
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("Todas");
  const [selectedDate, setSelectedDate] = useState("Todos");

  const eventRefs = useRef({});
  const eventsPerPage = 12;

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Conectamos el socket solo si el usuario está logueado
    socket.connect();

    socket.on("newEvent", (newEvent) => {
      setEvents((prev) => {
        const exists = prev.some((ev) => ev._id === newEvent._id);
        if (exists) return prev;

        const updated = [...prev, newEvent];

        // Ordenamos por fecha más cercana
        updated.sort((a, b) => new Date(a.date) - new Date(b.date));
        return updated;
      });
    });

    return () => {
      socket.off("newEvent");
      socket.disconnect(); // buena práctica si este componente se desmonta
    };
  }, [isLoggedIn]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) {
      setSearchEvents(query.toLocaleLowerCase());
    }
  }, [location.search]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();
        setEvents(data.events);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [location.search]); // Dependencia para recargar eventos al cambiar la búsqueda y location.search para que se actualice al cambiar la URL

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const platformMatch =
        selectedPlatform === "Todas" ||
        event.platform?.name === selectedPlatform;

      const now = new Date();
      const eventDate = new Date(event.date); // incluye hora real del evento

      let dateMatch = true;

      if (selectedDate === "Hoy") {
        const isSameDay =
          eventDate.getFullYear() === now.getFullYear() &&
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getDate() === now.getDate();

        dateMatch = isSameDay && eventDate > now;
      } else if (selectedDate === "Esta semana") {
        const dayOfWeek = now.getDay(); // 0 (domingo) a 6 (sábado)
        const diffToMonday = (dayOfWeek + 6) % 7;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        dateMatch =
          eventDate >= startOfWeek && eventDate <= endOfWeek && eventDate > now;
      } else if (selectedDate === "Este mes") {
        const startOfMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
          0,
          0,
          0
        );
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        dateMatch =
          eventDate >= startOfMonth &&
          eventDate <= endOfMonth &&
          eventDate > now;
      } else if (selectedDate === "Todos") {
        dateMatch = eventDate > now;
      }

      const searchMatch =
        searchEvents === "" ||
        event.title.toLowerCase().includes(searchEvents.toLowerCase()) ||
        event.game?.name?.toLowerCase().includes(searchEvents.toLowerCase()) ||
        event.platform?.name
          ?.toLowerCase()
          .includes(searchEvents.toLowerCase());

      return platformMatch && dateMatch && searchMatch;
    });
  }, [events, selectedPlatform, selectedDate, searchEvents]);

  const indexOfLastEvent = currentPage * eventsPerPage; // Índice del último evento en la página actual = pagina actual * eventos por página,ej: si estamos en la página 1 y hay 10 eventos por página, indexOfLastEvent será 10
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage; // Índice del primer evento en la página actual = índice del último evento - eventos por página, ej: si estamos en la página 1(10*1) y hay 10 eventos por página, indexOfFirstEvent será 0(10-10)
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  ); // usamos .slice para obtener los eventos de la página actual, ej: si estamos en la página 1 y hay 10 eventos por página, currentEvents será los eventos del 0 al 9
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage); // Total de páginas = número total de eventos / eventos por página, ej: si hay 25 eventos y hay 10 eventos por página, totalPages será 3 (25/10=2.5, redondeado a 3)math.ceil redondea hacia arriba el número de páginas totales.

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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

      console.log(events);
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("Error al crear el evento. Inténtalo de nuevo.");
    }
  };

  const onEventDeleted = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${API_URL}/platforms`);
        if (!response.ok) throw new Error("Error al cargar plataformas");
        const data = await response.json();
        setPlatforms(data.platforms); // Ajusta según cómo venga la respuesta
      } catch (error) {
        console.error("Error al obtener plataformas:", error);
      }
    };

    fetchPlatforms();
  }, []);

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
      <div className="event-header">
        <h1 className="title-event-page">Explora y crea eventos</h1>
        <div className="center-search-create">
          <SearchAndCreateEvents
            isLoggedIn={isLoggedIn}
            searchEvents={searchEvents}
            setSearchEvents={setSearchEvents}
            onCreate={handleCreateEvent}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            platforms={platforms}
          />
        </div>
      </div>
      <div className="event-content">
        <div className="event-main">
          <section className="mini-events-section">
            <h2 className="section-title-next-events">Próximos Eventos</h2>
            {filteredEvents.length === 0 ? (
              <p>No hay eventos próximos.</p>
            ) : (
              <div className="mini-events-grid">
                {[...filteredEvents]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
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

          <p className="section-title-next-events">Eventos disponibles</p>
          <section className="all-events">
            {filteredEvents.length === 0 ? (
              <p className="no-events-title">
                No hay eventos disponibles en este momento.
              </p>
            ) : (
              currentEvents.map((event) => (
                <div
                  key={event.id}
                  ref={(el) => (eventRefs.current[event.id] = el)}
                >
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event.id)}
                  />
                </div>
              ))
            )}
          </section>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn-events"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span className="pagination-info-events">
                {currentPage} / {totalPages}
              </span>
              <button
                className="pagination-btn-events"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

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
