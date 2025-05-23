import React from "react";
import "../style/Profile2.css";

const EventsList = ({ events }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Ultimos eventos</h3>
        <button className="add-button cyan">➕ new</button>
      </div>
      <div className="diamond-list">
        {events.map(( index) => (
          <div className="diamond" key={index}>
            <img src="/src/assets/8674309.png" alt="event" className="event-img" />
          </div>
        ))}
        <p>{events?events.map((event) => event.title):""}</p>
      </div>
    </div>
  );
};

export default EventsList;
