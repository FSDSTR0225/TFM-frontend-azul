import React, { useState } from "react";
import "../style/SearchAndCreateEvents.css";
import CreateEventModal from "./CreateEventModal.jsx";
import { TbCubePlus } from "react-icons/tb";

function SearchAndCreateEvents({
  isLoggedIn,
  searchEvents,
  setSearchEvents,
  onCreate,
  platforms = [],
  selectedPlatform,
  setSelectedPlatform,
  selectedDate,
  setSelectedDate,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="search-all-container">
        <div className="search-create-event">
          <div className="search-left">
            <input
              aria-label="Buscar eventos"
              type="text"
              value={searchEvents}
              onChange={(e) => setSearchEvents(e.target.value)}
              placeholder="Filtra por título, juego o plataforma..."
              className="search-input-event"
            />
            {searchEvents && (
              <div className="search-chip-container">
                <div className="search-chip">
                  <span>{searchEvents}</span>
                  <button onClick={() => setSearchEvents("")}>✕</button>
                </div>
              </div>
            )}
            {/* NUEVA SECCIÓN DE FILTROS */}
            <div className="event-inline-filters">
              <div className="chip-group">
                <p>Por plataforma: </p>
                <button
                  key="platform-todas"
                  type="button"
                  className={`chip-button ${
                    selectedPlatform === "Todas" ? "active" : ""
                  }`}
                  onClick={() => setSelectedPlatform("Todas")}
                >
                  Todas
                </button>

                {platforms.map((p) => (
                  <button
                    key={p._id || p.name}
                    type="button"
                    className={`chip-button ${
                      selectedPlatform === p.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedPlatform(p.name)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="chip-group">
                <p>Por fecha: </p>
                {["Todos", "Hoy", "Esta semana", "Este mes"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`chip-button ${
                      selectedDate === name ? "active" : ""
                    }`}
                    onClick={() => setSelectedDate(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="search-create-event-right">
          {isLoggedIn && (
            <button className="create-event-btn" onClick={handleOpenModal}>
              <TbCubePlus className="event-icon-create" /> Crear Evento
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <CreateEventModal onClose={handleCloseModal} onCreate={onCreate} />
      )}
    </>
  );
}

export default SearchAndCreateEvents;
