import React from "react";
import { BsController } from "react-icons/bs";
import { GiGameConsole } from "react-icons/gi";
import { TbCalendarBolt } from "react-icons/tb";

function EventSuggestionModal({ event, user, handleJoinEvent }) {
  const isParticipant = event.participants.some(
    (participant) => participant.username === user.username
  );
  const isPrivate = event.requiresApproval;
  const isFull =
    event.maxParticipants && event.participants.length >= event.maxParticipants;

  return (
    <div
      className="modal-event-content event-details-card"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        className="try-img"
        src={event.game.imageUrl}
        alt={event.game.name}
      />
      <div className="neon-bg"></div>
      <img
        src={event.platform.icon}
        alt={`Icono de ${event.platform.name}`}
        className="event-platform-icon-corner"
      />

      <div className="event-header-row">
        <h2 className="event-title">{event.title}</h2>
      </div>

      <section className="details-event-content">
        <div className="event-organizer">
          {event.creator && (
            <img
              src={event.creator.avatar}
              alt={event.creator.username}
              className="organizer-avatar"
            />
          )}
          <span className="organizer-name">{event.creator.username}</span>
        </div>
        <div className="event-info">
          <div className="info-data">
            <div className="event-info-game">
              <BsController className="icons-event-details" />{" "}
              <span className="event-info-label">Juego:</span>
              <span className="event-info-name">{event.game.name}</span>
              <GiGameConsole className="icons-event-details" />
              <span className="event-info-label">Plataforma:</span>
              <span className="event-info-name">{event.platform.name}</span>
            </div>
            <div className="event-info-date">
              <TbCalendarBolt className="icons-event-details" />
              <span className="event-info-label">Fecha:</span>
              <span className="event-info-name">
                {new Date(event.date).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-description">
          <h3>📝 Descripción</h3>
          <p>{event.description}</p>
        </div>

        <div className="modal-participants">
          <h3>👥 Participantes</h3>
          {event.participants.length === 0 ? (
            <p>No hay participantes aún.</p>
          ) : (
            <ul className="participant-list">
              {event.participants.map((participant, index) => (
                <li key={index} className="participant-item">
                  {participant.avatar && (
                    <img
                      src={participant.avatar}
                      alt={participant.username}
                      className="participant-avatar"
                    />
                  )}
                  <span>{participant.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isParticipant && (
          <div className="event-actions">
            {event.hasPendingRequest ? (
              <>
                <button disabled className="pending-btn">
                  Solicitud pendiente
                </button>
                <p>
                  Ya has solicitado unirte. Espera la aprobación del creador del
                  evento.
                </p>
              </>
            ) : (
              <button
                className="join-btn"
                onClick={handleJoinEvent}
                disabled={isFull}
                title={isFull ? "Este evento está completo" : ""}
              >
                {isPrivate ? "Solicitar unirse" : "Unirse al evento"}
              </button>
            )}
          </div>
        )}

        {isParticipant && (
          <p className="joined">- Ya estás apuntado a este evento. -</p>
        )}
      </section>
    </div>
  );
}

export default EventSuggestionModal;
