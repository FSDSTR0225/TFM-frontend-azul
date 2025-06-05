import React from "react";
import mocksEvent from "./mocks/mocksEvent";
import "../style/EventList.css";
import { useNavigate } from "react-router-dom";

function EventList() {
  const navigate = useNavigate();
  return (
    <section className="event-section">
      <h2 className="section-title">
        <img src="/src/assets/joystick.png" alt="controller" /> Próximos eventos
      </h2>
      <div className="card-event">
        {mocksEvent.map((event) => (
          <div className="next-event" key={event.id}>
            <img
              src={event.image}
              alt={event.game}
              className="event-img-list"
            />
            <h3 className="event-title-list">{event.title}</h3>
            <p className="event-date">
              {event.date} - {event.time}h
            </p>
            <p className="event-players">{event.players}</p>

            <h2 className="event-game">{event.game}</h2>
            <div className="event-join">
              <button onClick={() => navigate("/login")}>Unirse</button>
              <button onClick={() => navigate("/register")}>Detalles</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventList;
