import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/Comments.css";

export default function Comments({ thread, onNewComment }) {
  const { user, token } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(thread.comments || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/post/${thread._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (!res.ok) throw new Error("Error al crear comentario");

      const data = await res.json();

      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
      if (onNewComment) onNewComment(data.comment);
    } catch (error) {
      console.error("Error creando comentario:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-container">
      <h4>Comentarios ({comments.length})</h4>

      <div className="comments-list">
        {comments.length === 0 && <p>No hay comentarios aún.</p>}
        {comments.map((c) => (
          <div key={c._id} className="comment-item">
            {c.author?.avatar && (
              <img src={c.author.avatar} alt="avatar" className="avatar-icon" />
            )}
            <div className="comment-content">
              <strong>{c.author?.username || "Anónimo"}</strong>
              <p>{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={3}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p>Inicia sesión para comentar.</p>
      )}
    </div>
  );
}
