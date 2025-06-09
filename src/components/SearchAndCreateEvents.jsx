import React, { useState } from "react";
import "../style/SearchAndCreateEvents.css";
import CreateEventModal from "./CreateEventModal.jsx";
import { FaSearchengin } from "react-icons/fa6";

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
      <div className="search-create-event">
        <input
          type="text"
          value={searchEvents}
          onChange={(e) => setSearchEvents(e.target.value)}
          placeholder="Filtra por título, juego o plataforma..."
          className="search-input-event"
        />

        {isLoggedIn && (
          <button className="create-event-btn" onClick={handleOpenModal}>
            ➕ Crear Evento
          </button>
        )}
      </div>

      {showModal && (
        <CreateEventModal onClose={handleCloseModal} onCreate={onCreate} />
      )}
    </>
  );
}

export default SearchAndCreateEvents;
