import {useState} from 'react';
import "../style/Profile2.css";
import CreateEventModal from './CreateEventModal';
const LastEventsList = ({ events , onEventCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
const handleCreateEvent = async (newEventData) => {
    try {
      // Se hai un endpoint per crear el evento:
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventData),
      });

      if (!res.ok) throw new Error("Error creando evento");

      const createdEvent = await res.json();

      // Se vuoi notificare il componente padre:
      if (onEventCreated) onEventCreated(createdEvent);
    } catch (err) {
      console.error("Error creando evento:", err);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h3>Ultimos eventos</h3>
        <button className="add-button-p cyan" onClick={() => setModalOpen(true)}>➕ Crear Nuevo</button>
      </div>
      <div className="diamond-list">
        {events.map((event) => (
          <div className="diamond-list-element" key={event?._id}>
            <div className="diamond" >
              <img
                src={event.game.imageUrl}
                alt="event"
                className="last-event-img"
              />
            </div>
            <div className="event-profile-info">
              <p>- {event.title} -</p>
              <p className="info-game-name">{event.game.name}</p>
              {/* <p>
            {event.date} - {event.time}
          </p> */}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && <CreateEventModal className="modal-create-event-in-profile" onCreate={handleCreateEvent}  onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default LastEventsList;
