import React, { useState } from "react";
import "../style/SearchAndCreateEvents.css";
import CreateEventModal from "./CreateEventModal.jsx";
import { TbCubePlus } from "react-icons/tb";

function SearchAndCreateEvents({
  isLoggedIn,
  searchEvents,
  setSearchEvents,
  onCreate,
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
      <div className="search-all-containier">
        <div className="search-create-event">
          <div className="search-left">
            <input
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
