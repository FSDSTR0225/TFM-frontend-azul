import React from "react";
import mocksEvent from "./mocks/mocksEvent";

function EventList() {
  return (
    <section className="event-section">
      <h2 className="section-title">
        <img src="/src/assets/game-controller.png" alt="controller" /> Próximos
        eventos
      </h2>
      <div className="card-event">
        {mocksEvent.map((event) => (
          <div className="next-event" key={event.id}>
            <h3>{event.title}</h3>
            <p>
              {event.date} - {event.time}h
            </p>

            <h2>{event.game}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EventList;
