import React, { useContext, useState } from "react";
import "../style/ThreadCard.css";
import consoleIcon from "../assets/game-controller.png";
import AuthContext from "../context/AuthContext";
import Comments from "./Comments"; // 👈 Importamos Comments

export default function ThreadCard({ thread, onClick, onDelete }) {
  const { user } = useContext(AuthContext);
  const isCreator = user && thread.creator?._id === user._id;

  // Para controlar si mostramos u ocultamos comentarios en la tarjeta
  const [showComments, setShowComments] = useState(false);

  const toggleComments = (e) => {
    e.stopPropagation(); // para no disparar onClick padre
    setShowComments((prev) => !prev);
  };

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

      <button className="toggle-comments-btn" onClick={toggleComments}>
        {showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
      </button>

      {isCreator && (
        <button
          className="delete-button-thread"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(thread._id);
          }}
        >
          X
        </button>
      )}

      {/* Mostrar comentarios si showComments está activo */}
      {showComments && (
        <Comments
          thread={thread}
          onNewComment={(newComment) => {
            // Aquí puedes actualizar estado padre si quieres
          }}
        />
      )}
    </div>
  );
}
