import React from "react";
import "../style/Profile2.css";

const LastEventsList = ({ events }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3>Ultimos eventos</h3>
        <button className="add-button-p cyan">➕ Create New</button>
      </div>
      <div className="diamond-list">
        {events.map((event) => (
          <div className="diamond-list-element">
            <div className="diamond" key={event._id}>
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
    </div>
  );
};

export default LastEventsList;
