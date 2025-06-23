// src/components/MiniEventCard.jsx
import React from "react";
import "../style/EventCardMini.css";

function formatDateTimeShort(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month} - ${hours}:${minutes}`;
}

function EventCardMini({ event, onClick }) {
  if (!event) return null;

  return (
    <>
      <span className="event-card-mini" onClick={onClick} type="button">
        <div className="mini-event-card">
          <div className="mini-event-header">
            <img
              src={event.platform.icon}
              alt={event.platform.name}
              className="mini-platform-icon"
            />
            <span className="mini-event-title">{event.title}</span>
          </div>
          <div className="mini-event-info">
            <div className="mini-info-line">
              <span>🎮 {event.game.name}</span>
            </div>
            <div className="mini-info-line">
              <span>
                👥{" "}
                {event.maxParticipants
                  ? `${event.participants.length}/${event.maxParticipants}`
                  : "∞"}
              </span>
            </div>
            <div className="mini-info-line">
              <span>{formatDateTimeShort(event.date)}</span>
            </div>
          </div>
        </div>
      </span>
    </>
  );
}

export default EventCardMini;
