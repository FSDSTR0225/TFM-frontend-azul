import React, { useEffect, useState } from "react";
import CreateThreadForm from "./CreateThreadForm";
import ThreadsList from "./ThreadsList";

export default function ForumThreads() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ Obtener el usuario autenticado desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setThreads(data.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar hilos:", err);
        setLoading(false);
      });
  }, []);

  const handleDeleteThread = async (threadId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este hilo?"
    );

    if (!confirmDelete) return; // Cancelado por el usuario

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/post/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setThreads((prev) => prev.filter((t) => t._id !== threadId));
    } catch (err) {
      console.error("Error al borrar hilo:", err);
    }
  };

  const handleClick = (thread) => {
    console.log("Hiciste clic en el hilo:", thread);
  };

  const handleNewThread = (newThread) => {
    setThreads((prev) => [newThread, ...prev]);
  };

  if (loading) return <p>Cargando hilos...</p>;

  return (
    <div>
      <CreateThreadForm onNewThread={handleNewThread} />
      <h2>Hilos del foro</h2>
      <ThreadsList
        threads={threads}
        onThreadClick={handleClick} // ✅ nombre correcto
        onDelete={handleDeleteThread}
        currentUserId={user?._id} // ✅ ahora user está definido
      />
    </div>
  );
}
