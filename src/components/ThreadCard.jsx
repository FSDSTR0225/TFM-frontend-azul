import React, { useContext } from "react";
import "../style/ThreadCard.css";
import consoleIcon from "../assets/game-controller.png";
import AuthContext from "../context/AuthContext"; // 👈 importa el contexto

export default function ThreadCard({ thread, onClick, onDelete }) {
  const { user } = useContext(AuthContext); // 👈 obtenemos el usuario actual

  const isCreator = user && thread.creator?._id === user._id; // ✅ comprobamos si tú eres el creador

  return (
    <div className="thread-card" onClick={() => onClick && onClick(thread)}>
      <h3 className="thread-title">{thread.title}</h3>
      <p className="thread-description">{thread.description}</p>

      <p className="thread-meta">
        <span className="creator-info">
          {thread.creator?.avatar && (
            <img
              src={thread.creator.avatar}
              alt="avatar"
              className="avatar-icon"
            />
          )}
          <strong>{thread.creator?.username || "Anónimo"}</strong>
        </span>

        <span className="game-info">
          <img src={consoleIcon} alt="console" className="inline-icon" />
          <strong>{thread.game?.name || "N/D"}</strong>
        </span>

        <span className="platform-info">
          {thread.platform?.icon && (
            <img
              src={thread.platform.icon}
              alt={thread.platform.name}
              className="inline-icon"
            />
          )}
          <strong>{thread.platform?.name || "N/D"}</strong>
        </span>
      </p>

      {/* ✅ Botón de borrar solo si eres el creador */}
      {isCreator && (
        <button
          className="delete-button-thread"
          onClick={(e) => {
            e.stopPropagation(); // 👈 evita que se dispare el onClick de la tarjeta
            onDelete && onDelete(thread._id);
          }}
        >
          X
        </button>
      )}
    </div>
  );
}
