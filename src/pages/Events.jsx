import React, { useState } from "react";
import "../style/Events.css";

const initialEventos = [
  {
    id: 1,
    titulo: "Ranked Valorant",
    fecha: "2025-04-14",
    hora: "20:00",
    categoria: "Próximos eventos",
    plataforma: "PC",
    creador: "User1",
    juego: "Valorant",
    jugadores: "1",
  },
  {
    id: 2,
    titulo: "Torneo Fifa",
    fecha: "2025-04-15",
    hora: "12:00",
    categoria: "Próximos eventos",
    plataforma: "PS5",
    creador: "User2",
    juego: "Fifa",
    jugadores: "2",
  },
  {
    id: 3,
    titulo: "Leveo WOW",
    fecha: "2025-04-23",
    hora: "12:00",
    categoria: "Próximos eventos",
    plataforma: "PC",
    creador: "User3",
    juego: "WoW",
    jugadores: "3",
  },
];

// Simulación usuario actual
const currentUser = "User1";

const Events = () => {
  const [eventos, setEventos] = useState(initialEventos);
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

    if (isEditing) {
      setEventos((prev) =>
        prev.map((ev) => (ev.id === editId ? { ...ev, ...nuevoEvento } : ev))
      );
    } else {
      const newEvent = {
        id: eventos.length + 1,
        categoria: "Próximos eventos",
        creador: currentUser,
        titulo: `${juego} Event`,
        ...nuevoEvento,
      };
      setEventos([newEvent, ...eventos]);
    }

    closeModal();
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
      setEventos((prev) => prev.filter((ev) => ev.id !== id));
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
