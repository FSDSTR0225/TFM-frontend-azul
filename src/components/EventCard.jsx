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
    <div
      className="event-card"
      // style={{ backgroundImage: `url(${event.game.imageUrl})` }}
      onClick={onClick}
    >
      <img
        src={event.game.imageUrl}
        alt={event.game.title}
        className="event-card-img"
      />
      {/* Capa oscura para legibilidad */}
      <div className="event-card__overlay" />

      {/* Plataforma arriba derecha */}

      {/* Contenido inferior */}
      <div className="event-card__info">
        <div className="event-card__platform-box">
          <img
            src={event.platform.icon}
            alt={event.platform.name}
            className="event-card__platform"
          />
        </div>
        <div className="event-card__right">
          <span
            className="event-card__platform-name"
            title={event.platform.name}
          >
            {event.platform.name === "Nintendo Switch"
              ? "Switch"
              : event.platform.name}
          </span>
        </div>
        <h3 className="event-card__title">- {event.title} -</h3>

        <div className="event-card__game">
          <span className="event-card__game-name">
            <BsController /> {event.game.name}
          </span>
        </div>
        <div className="event-card__row">
          <span className="event-card__date">{formatDateTime(event.date)}</span>
          <span
            className={
              isFull ? "event-card__row--full" : "event-card__row--slots"
            }
          >
            {event.maxParticipants
              ? `${event.participants.length}/${event.maxParticipants}`
              : "Sin límite"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
