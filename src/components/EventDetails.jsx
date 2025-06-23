import React, { useContext, useState } from "react";
import "../style/EventDetails.css";
import AuthContext from "../context/AuthContext";
import EditEventForm from "./EditEventForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

function EventDetails({ event, onClose, setSelectedEvent, onEventDeleted }) {
  const authContext = useContext(AuthContext);
  const { user, token, isLoggedIn } = authContext;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!event) return null;

  const isCreator = isLoggedIn && event.creator === user.username;

  const isParticipant = event.participants.some(
    (participant) => participant.username === user.username
  );
  const isPrivate = event.requiresApproval;
  const isFull =
    event.maxParticipants && event.participants.length >= event.maxParticipants;

  const handleJoinEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/events/${event.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message?.includes("solicitud para unirte")) {
          toast.info("Ya has enviado una solicitud para este evento.", {
            className: "mi-toast",
            icon: "",
          });
          return;
        }
        throw new Error("Error al unirse al evento");
      }

      const data = await response.json();

      setSelectedEvent(data.currentEvent);

      toast.success(
        isPrivate ? "Solicitud enviada con éxito." : "¡Te has unido al evento!",
        { className: "mi-toast", icon: isPrivate ? "📩" : "🎉" }
      );
    } catch (error) {
      console.error("Error al unirse al evento:", error);
      toast.error(
        "Hubo un error al intentar unirte al evento. Por favor, inténtalo de nuevo más tarde.",
        { className: "mi-toast", icon: "⚠️" }
      );
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al elimiar el evento");
      }

      toast.success("Evento eliminado con éxito.", {
        className: "mi-toast",
        icon: "🗑️",
      });
      onClose(); // Cerrar el modal después de eliminar
      setSelectedEvent(null); // Limpiar el evento seleccionado
      onEventDeleted(event.id); // Notificar al padre que se ha eliminado el evento
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error(
        "Hubo un error al eliminar el evento.Por favor, inténtalo de nuevo más tarde.",
        { className: "mi-toast", icon: "⚠️" }
      );
    }
  };

  if (isEditing) {
    return (
      <EditEventForm
        event={event}
        onClose={() => setIsEditing(false)}
        onUpdate={(updatedEvent) => {
          setSelectedEvent({
            ...updatedEvent,
            creator: event.creator, // Mantener el creador original
          });
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div
      className="modal-overlay-events"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay-events")) {
          onClose();
        }
      }}
    >
      <div className="modal-event-content event-details-card">
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
        <span className="close-btn" onClick={onClose} aria-label="Cerrar modal">
          ✖
        </span>
        <section className="details-event-content">
          <div className="event-organizer">
            {event.creatorAvatar && (
              <img
                src={event.creatorAvatar}
                alt={event.creator}
                className="organizer-avatar"
              />
            )}
            <span className="organizer-name">{event.creator}</span>
          </div>

          <div className="event-info">
            <p>
              <span>🎮 Juego:</span> {event.game.name}
            </p>
            <p>
              <span>🗓️ Fecha:</span> {new Date(event.date).toLocaleString()}
            </p>
            <p>
              <span>🕹️ Plataforma:</span> {event.platform.name}
            </p>
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
                {event.participants.map((user, index) => (
                  <li key={index} className="participant-item">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="participant-avatar"
                      />
                    )}
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {!isCreator && !isParticipant && (
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
          <p className="joined">- Ya estas apuntado en este evento. -</p>
        )}

        {isCreator && (
          <div className="event-actions">
            <button
              className="edit-event-btn"
              onClick={() => setIsEditing(true)}
            >
              Editar evento
            </button>
            <button
              className="delete-event-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Eliminar evento
            </button>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <ConfirmDeleteModal
          eventTitle={event.title}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteEvent}
        />
      )}
    </div>
  );
}

export default EventDetails;
