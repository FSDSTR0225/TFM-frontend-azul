import React, { useContext, useState } from "react";
import "../style/ThreadCard.css";
import consoleIcon from "../assets/game-controller.png";
import AuthContext from "../context/AuthContext";
import Comments from "./Comments";
import { jwtDecode } from "jwt-decode"; // ✅ Correcto

export default function ThreadCard({ thread, onClick, onDelete }) {
  const { user, token } = useContext(AuthContext);
  const isCreator = user && thread.creator?._id === user._id;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(thread.comments || []);

  // Decodificar el token para obtener userId
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id || decoded._id;
    } catch (err) {
      console.error("Error al decodificar el token", err);
    }
  }

  const toggleComments = (e) => {
    e.stopPropagation();
    setShowComments((prev) => !prev);
  };

  const handleNewComment = (newComment) => {
    setComments((prev) => [...prev, newComment]);
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
        {showComments
          ? "Ocultar comentarios"
          : `Mostrar comentarios (${comments.length})`}
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

      {showComments && thread && thread._id && (
        <Comments
          postId={thread._id}
          token={token}
          userId={userId} // ← PASA userId al componente Comments
          onNewComment={handleNewComment}
          comments={comments}
        />
      )}
    </div>
  );
}
