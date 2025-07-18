import React, { useEffect, useState } from "react";
import "../style/Comments.css";

const Comments = ({
  postId,
  token,
  userId, // ← se recibe desde el padre
  onNewComment,
  comments: initialComments = [],
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar comentarios del post
  useEffect(() => {
    if (!postId) return;
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${postId}/comments`);
        if (!res.ok) throw new Error("Error al obtener comentarios");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchComments();
  }, [postId]);

  // Crear nuevo comentario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Debes estar autenticado para comentar");
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) throw new Error("Error al crear comentario");
      const data = await res.json();
      setComments((prev) => [...prev, data]);
      setNewComment("");
      onNewComment && onNewComment(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Iniciar edición
  const startEditing = (id, content) => {
    setEditingId(id);
    setEditingContent(content);
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
  };

  // Guardar edición
  const saveEdit = async (id) => {
    if (!editingContent.trim())
      return alert("El comentario no puede estar vacío");

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editingContent }),
      });
      if (!res.ok) throw new Error("Error al editar comentario");
      const updatedComment = await res.json();

      setComments((prev) =>
        prev.map((c) => (c._id === id ? updatedComment : c))
      );
      cancelEditing();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Borrar comentario
  const deleteComment = async (commentId) => {
    if (!token) return alert("Debes estar autenticado para borrar comentarios");

    try {
      const res = await fetch(
        `${API_URL}/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al borrar comentario");
      }

      // Actualizamos la lista local de comentarios
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="comments">
      <h4>Comentarios</h4>
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c._id} className="comment-item">
            <img
              src={c.author?.avatar || "avatar_default.png"}
              alt="avatar"
              className="comment-avatar"
            />
            <div className="comment-content">
              <strong>{c.author?.username || "Anónimo"}:</strong>
              {editingId === c._id ? (
                <>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="edit-textarea"
                  />
                  <button onClick={() => saveEdit(c._id)}>Guardar</button>
                  <button onClick={cancelEditing}>Cancelar</button>
                </>
              ) : (
                <p>{c.content}</p>
              )}
            </div>

            {/* Mostrar botones solo si el usuario es el autor */}
            {token && c.author && userId === c.author._id && (
              <div className="comment-actions">
                <button onClick={() => startEditing(c._id, c.content)}>
                  Editar
                </button>
                <button onClick={() => deleteComment(c._id)}>Borrar</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario..."
          required
        />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
};

export default Comments;
