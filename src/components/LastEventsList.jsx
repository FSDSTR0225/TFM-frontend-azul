import {useState} from 'react';
import "../style/Profile2.css";
import CreateEventModal from './CreateEventModal';
import {useNavigate} from 'react-router-dom';
const LastEventsList = ({ events , isOwner, triggerRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="section">
      <div className="section-header">
        <h3>Ultimos eventos</h3>
        {isOwner &&
        <button className="add-button-p cyan" onClick={()=>navigate("/events")}>➕ Crear Nuevo</button>}
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
      {modalOpen && <CreateEventModal className="modal-create-event-in-profile" onCreate={()=>triggerRefresh}  onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default LastEventsList;
