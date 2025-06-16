import React, { useState, useEffect, useContext, useRef } from "react";
import { PacmanLoader } from "react-spinners";
import AuthContext from "../context/AuthContext";
import EventCard from "../components/EventCard";
import EventCardMini from "../components/EventCardMini";
import EventDetails from "../components/EventDetails";
import SearchAndCreateEvents from "../components/SearchAndCreateEvents";
import { useLocation } from "react-router-dom";
import "../style/Events.css";

const API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null); // Estado para almacenar los detalles del evento seleccionado
  const [searchEvents, setSearchEvents] = useState(""); // Estado para almacenar la búsqueda de eventos
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación

  const eventRefs = useRef({});
  const eventsPerPage = 10;

  const { isLoggedIn } = useContext(AuthContext);

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
        setLoading(false);
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

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchEvents.toLowerCase()) ||
      event.game?.name?.toLowerCase().includes(searchEvents.toLowerCase())
  );

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

      {/* {searchEvents && (
        <div className="search-chip">
          <span>{searchEvents}</span>
          <button onClick={() => setSearchEvents("")}>✕</button>
        </div>
      )} */}
      <div className="center-search-create">
        <SearchAndCreateEvents
          isLoggedIn={isLoggedIn}
          searchEvents={searchEvents}
          setSearchEvents={setSearchEvents}
          onCreate={handleCreateEvent}
        />
      </div>

      <section className="mini-events-section">
        <h2 className="section-title-next-events">Próximos Eventos</h2>
        {filteredEvents.length === 0 ? (
          <p></p>
        ) : (
          <div className="mini-events-grid">
            {[...filteredEvents]
              .sort((a, b) => new Date(a.date) - new Date(b.date)) // ordenar de más próximo a más lejano
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

      <section className="all-events">
        <p className="section-title-next-events">Eventos disponibles</p>
        {filteredEvents.length === 0 ? (
          <p className="no-events-title">
            No hay eventos disponibles en este momento.
          </p>
        ) : (
          currentEvents.map((event) => (
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
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            ← Anterior
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}

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

//   return (
//     <div className="event-page">
//       <h1 className="title-event-page">Explora y crea eventos</h1>
//       <SearchAndCreateEvents
//         isLoggedIn={isLoggedIn}
//         searchEvents={searchEvents}
//         setSearchEvents={setSearchEvents}
//         onCreate={handleCreateEvent}
//       />
//       <section className="all-events">
//         {filteredEvents.length === 0 ? (
//           <p>No hay eventos disponibles en este momento.</p>
//         ) : (
//           filteredEvents.map((event) => (
//             <EventCard
//               key={event.id}
//               event={event}
//               onClick={() => {
//                 handleEventClick(event.id);
//               }}
//             />
//           ))
//         )}
//       </section>
//       {eventDetails && (
//         <EventDetails
//           event={eventDetails}
//           onClose={handleCloseModal}
//           setSelectedEvent={setEventDetails}
//           onEventDeleted={onEventDeleted}
//         />
//       )}
//     </div>
//   );
// };

// export default Events;

//   return (
//     <div className="events-container">
//       <div className="events-header">
//         <div className="create-event-container">
//           <button className="create-event-btn" onClick={openModal}>
//             + Crear nuevo evento
//           </button>
//         </div>

//         <input
//           className="search-bar"
//           placeholder="Buscar eventos por juego..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="filters">
//           <button className="filter-btn">Fecha</button>
//           <button className="filter-btn">Horario</button>
//           <button className="filter-btn">Plataforma</button>
//           <button className="filter-btn">Juego</button>
//         </div>
//       </div>

//       <section className="event-section">
//         <h2>Próximos eventos</h2>
//         <div className="highlighted-events">
//           {eventosFiltrados.map((event) => (
//             <div key={event.id} className="highlight-card">
//               <span className="highlight-day">{event.fecha}</span>
//               <span className="highlight-hour">{event.hora}</span>
//               <p>{event.juego}</p>
//               <button className="details-btn">Detalles</button>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="event-section">
//         <h2>Todos los eventos</h2>
//         <div className="event-list">
//           {eventosFiltrados.map((event) => (
//             <div
//               key={event.id}
//               className="event-card"
//               onClick={() => toggleExpand(event.id)}
//             >
//               <div className="event-summary">
//                 <span className="event-icon">🎮</span>
//                 <div className="event-info">
//                   <h3>{event.juego}</h3>
//                   <p>
//                     {event.fecha} • {event.plataforma}
//                   </p>
//                 </div>
//                 <div className="event-meta">
//                   <span>{event.creador}</span>
//                   <button className="view-btn">{event.jugadores}</button>
//                 </div>
//               </div>

//               {expandedId === event.id && (
//                 <div className="event-details">
//                   <p>
//                     <strong>Título:</strong> {event.titulo}
//                   </p>
//                   <p>
//                     <strong>Horario:</strong> {event.hora}
//                   </p>
//                   <p>
//                     <strong>Plataforma:</strong> {event.plataforma}
//                   </p>
//                   <p>
//                     <strong>Creador:</strong> {event.creador}
//                   </p>
//                   <p>
//                     <strong>jugadores:</strong> {event.jugadores}
//                   </p>

//                   {event.creador === currentUser && (
//                     <div className="edit-delete-buttons">
//                       <button
//                         className="edit-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEdit(event);
//                         }}
//                       >
//                         Editar
//                       </button>
//                       <button
//                         className="delete-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(event.id);
//                         }}
//                       >
//                         Eliminar
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="pagination">
//           <span>ANTERIOR - 1 - SIGUIENTE</span>
//         </div>
//       </section>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h2>{isEditing ? "Editar evento" : "Crear nuevo evento"}</h2>
//             <form onSubmit={handleSubmit} className="modal-form">
//               {/* Juego */}
//               <input
//                 type="text"
//                 name="juego"
//                 placeholder="Juego"
//                 value={nuevoEvento.juego}
//                 onChange={handleChange}
//               />

//               {/* Plataforma */}
//               <input
//                 type="text"
//                 name="plataforma"
//                 placeholder="Plataforma"
//                 value={nuevoEvento.plataforma}
//                 onChange={handleChange}
//               />

//               {/* Fecha */}
//               <input
//                 type="date"
//                 name="fecha"
//                 value={nuevoEvento.fecha}
//                 onChange={handleChange}
//               />

//               {/* Hora */}
//               <input
//                 type="time"
//                 name="hora"
//                 value={nuevoEvento.hora}
//                 onChange={handleChange}
//               />

//               {/* jugadores */}
//               <select
//                 name="jugadores"
//                 value={nuevoEvento.jugadores}
//                 onChange={handleChange}
//               >
//                 {jugadoresOptions.map((num) => (
//                   <option key={num} value={num}>
//                     {num} jugador{num > 1 ? "es" : ""}
//                   </option>
//                 ))}
//               </select>

//               <div className="modal-buttons">
//                 <button type="submit" className="save-btn">
//                   {isEditing ? "Guardar cambios" : "Guardar"}
//                 </button>
//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={closeModal}
//                 >
//                   Cancelar
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Events;
