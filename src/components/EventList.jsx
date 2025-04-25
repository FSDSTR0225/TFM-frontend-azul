import React from "react";
import mocksEvent from "./mocks/mocksEvent";

function EventList() {
  return (
    <section className="event-section">
      <h2 className="section-title">
        <img src="/src/assets/joystick.png" alt="controller" /> Próximos eventos
      </h2>
      <div className="card-event">
        {mocksEvent.map((event) => (
          <div className="next-event" key={event.id}>
            <img src={event.image} alt={event.game} className="event-img" />
            <h3 className="event-title">{event.title}</h3>
            <p className="event-date">
              {event.date} - {event.time}h
            </p>
            <p className="event-players">{event.players}</p>

            <h2 className="event-game">{event.game}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventList;
