import React, { useState, useEffect } from "react";
import "../style/Events.css";

// Simulación usuario actual
const currentUser = "User1";

const Events = () => {
  const [eventos, setEventos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [nuevoEvento, setNuevoEvento] = useState({
    juego: "",
    plataforma: "",
    fecha: "",
    hora: "",
    jugadores: "1",
  });

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => {
        const eventosNormalizados = data.map((evento) => ({
          id: evento._id,
          titulo: evento.title, // traducir title a titulo
          juego: evento.game, // aquí está el id del juego, ojo
          plataforma: evento.platform, // id de la plataforma
          fecha: evento.date,
          hora: evento.hour,
          descripcion: evento.description,
          creador: evento.creator,
          imagen: evento.image,
          jugadores: 1, // Valor por defecto, backend no envía jugadores
        }));
        setEventos(eventosNormalizados);
      })
      .catch((err) => console.error("Error cargando eventos:", err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openModal = () => {
    setIsEditing(false);
    setNuevoEvento({
      juego: "",
      plataforma: "",
      fecha: "",
      hora: "",
      jugadores: "1",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setNuevoEvento({ ...nuevoEvento, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { juego, plataforma, fecha, hora, jugadores } = nuevoEvento;

    if (!juego || !plataforma || !fecha || !hora || !jugadores) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const payload = {
      game: nuevoEvento.juego,
      platform: nuevoEvento.plataforma,
      date: nuevoEvento.fecha,
      hour: nuevoEvento.hora,
      players: Number(nuevoEvento.jugadores),
      title: `${nuevoEvento.juego} Event`,
      creator: currentUser,
      description: nuevoEvento.descripcion || "Evento sin descripción",
      image: "", // <-- aquí envías string vacío
    };

    if (isEditing) {
      // EDITAR evento existente
      fetch(`http://localhost:3000/events/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Error actualizando evento");
          const updatedEvent = await res.json();
          setEventos((prev) =>
            prev.map((ev) =>
              ev.id === editId ? { ...updatedEvent, id: updatedEvent._id } : ev
            )
          );
          closeModal();
        })
        .catch((err) => {
          console.error("Error actualizando evento:", err);
          alert("No se pudo actualizar el evento.");
        });
    } else {
      // CREAR nuevo evento
      fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Error creando evento");
          const newEvent = await res.json();
          setEventos([{ ...newEvent, id: newEvent._id }, ...eventos]);
          closeModal();
        })
        .catch((err) => {
          console.error("Error creando evento:", err);
          alert("No se pudo crear el evento.");
        });
    }
  };

  const handleEdit = (evento) => {
    // Cargar solo los campos que están en el formulario
    const { juego, plataforma, fecha, hora, jugadores } = evento;
    setNuevoEvento({ juego, plataforma, fecha, hora, jugadores });
    setIsEditing(true);
    setEditId(evento.id);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este evento?");
    if (confirmed) {
      fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setEventos((prev) => prev.filter((ev) => ev.id !== id));
        })
        .catch((err) => {
          console.error("Error eliminando evento:", err);
          alert("No se pudo eliminar el evento.");
        });
    }
  };

  // Filtrar eventos según búsqueda
  const eventosFiltrados = eventos.filter((ev) =>
    ev.juego.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Opciones para jugadores
  const jugadoresOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="events-container">
      <div className="events-header">
        <div className="create-event-container">
          <button className="create-event-btn" onClick={openModal}>
            + Crear nuevo evento
          </button>
        </div>

        <input
          className="search-bar"
          placeholder="Buscar eventos por juego..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filters">
          <button className="filter-btn">Fecha</button>
          <button className="filter-btn">Horario</button>
          <button className="filter-btn">Plataforma</button>
          <button className="filter-btn">Juego</button>
        </div>
      </div>

      <section className="event-section">
        <h2>Próximos eventos</h2>
        <div className="highlighted-events">
          {eventosFiltrados.map((event) => (
            <div key={event.id} className="highlight-card">
              <span className="highlight-day">{event.fecha}</span>
              <span className="highlight-hour">{event.hora}</span>
              <p>{event.juego}</p>
              <button className="details-btn">Detalles</button>
            </div>
          ))}
        </div>
      </section>

      <section className="event-section">
        <h2>Todos los eventos</h2>
        <div className="event-list">
          {eventosFiltrados.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="event-summary">
                <span className="event-icon">🎮</span>
                <div className="event-info">
                  <h3>{event.juego}</h3>
                  <p>
                    {event.fecha} • {event.plataforma}
                  </p>
                </div>
                <div className="event-meta">
                  <span>{event.creador}</span>
                  <button className="view-btn">{event.jugadores}</button>
                </div>
              </div>

              {expandedId === event.id && (
                <div className="event-details">
                  <p>
                    <strong>Título:</strong> {event.titulo}
                  </p>
                  <p>
                    <strong>Horario:</strong> {event.hora}
                  </p>
                  <p>
                    <strong>Plataforma:</strong> {event.plataforma}
                  </p>
                  <p>
                    <strong>Creador:</strong> {event.creador}
                  </p>
                  <p>
                    <strong>jugadores:</strong> {event.jugadores}
                  </p>

                  {event.creador === currentUser && (
                    <div className="edit-delete-buttons">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(event);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event.id);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="pagination">
          <span>ANTERIOR - 1 - SIGUIENTE</span>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Editar evento" : "Crear nuevo evento"}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Juego */}
              <input
                type="text"
                name="juego"
                placeholder="Juego"
                value={nuevoEvento.juego}
                onChange={handleChange}
              />

              {/* Plataforma */}
              <input
                type="text"
                name="plataforma"
                placeholder="Plataforma"
                value={nuevoEvento.plataforma}
                onChange={handleChange}
              />

              {/* Fecha */}
              <input
                type="date"
                name="fecha"
                value={nuevoEvento.fecha}
                onChange={handleChange}
              />

              {/* Hora */}
              <input
                type="time"
                name="hora"
                value={nuevoEvento.hora}
                onChange={handleChange}
              />

              {/* jugadores */}
              <select
                name="jugadores"
                value={nuevoEvento.jugadores}
                onChange={handleChange}
              >
                {jugadoresOptions.map((num) => (
                  <option key={num} value={num}>
                    {num} jugador{num > 1 ? "es" : ""}
                  </option>
                ))}
              </select>

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {isEditing ? "Guardar cambios" : "Guardar"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
