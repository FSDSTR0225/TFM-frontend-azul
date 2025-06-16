import React from "react";
import "../style/EventCard.css";
import { BsController } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { GiBossKey } from "react-icons/gi";

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function EventCard({ event, onClick }) {
  if (!event) return null;

  const isFull =
    event.maxParticipants && event.participants.length >= event.maxParticipants;

  return (
    <div className="event-card-pro">
      <div className="event-header-pro">
        <img
          src={event.platform.icon}
          alt={event.platform}
          className="platform-icon-event"
        />
        <h3 className="event-title-pro">{event.title}</h3>
        <span className="event-icon">
          <GiBossKey />
        </span>
        <span className="event-info-label">Creador:</span>
        <span className="event-date-badge">{event.creator.username}</span>
      </div>

      <div className="event-main-pro">
        <div className="event-info-block">
          <span className="event-icon">
            <BsController />
          </span>
          <span className="event-info-label">Juego:</span>
          <span className="event-info-value">{event.game.name}</span>
        </div>
        <div className={`event-info-block ${isFull ? "full" : "participants"}`}>
          <span className="event-icon">
            <RiTeamFill />
          </span>
          <span className="event-info-label">Participantes:</span>
          <span className="event-info-value">
            {event.maxParticipants && event.participants.lengt > 0
              ? `${event.participants}/${event.maxParticipants}`
              : "Sin límite"}
          </span>
        </div>
        <div className="event-info-block">
          <span className="event-info-value">{formatDateTime(event.date)}</span>
        </div>
      </div>

      <div className="event-btn-block-centered">
        <button className="btn-card-event-pro" onClick={onClick}>
          Ver detalles
        </button>
      </div>
    </div>
  );
}

export default EventCard;
