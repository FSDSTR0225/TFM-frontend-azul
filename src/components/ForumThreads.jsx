import React, { useEffect, useState, useContext } from "react";
import CreateThreadForm from "./CreateThreadForm";
import ThreadsList from "./ThreadsList";
import AuthContext from "../context/AuthContext";
import "../style/ForumThreads.css"; // CSS personalizado para pestañas, etc.

const categories = ["General", "Bugs", "Juegos", "Eventos"];

export default function ForumThreads() {
  const { user, token } = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("general");

  // 🧠 Cargar hilos del backend
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

  // 🎯 Filtrar por categoría cuando threads o categoría activa cambian
  useEffect(() => {
    const filtered = threads.filter(
      (t) => t.category?.toLowerCase() === activeCategory.toLowerCase()
    );

    setFilteredThreads(filtered);
  }, [threads, activeCategory]);

  const handleDeleteThread = async (threadId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este hilo?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${threadId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setThreads((prev) => prev.filter((t) => t._id !== threadId));
    } catch (err) {
      console.error("Error al borrar hilo:", err);
    }
  };

  const handleNewThread = (newThread) => {
    setThreads((prev) => [newThread, ...prev]);
    if (newThread.category?.toLowerCase() === activeCategory.toLowerCase()) {
      setFilteredThreads((prev) => [newThread, ...prev]);
    }
  };

  const handleThreadClick = (thread) => {
    console.log("Hilo seleccionado:", thread);
    // Más adelante: abrir detalle, mostrar comentarios, etc.
  };

  if (loading) return <p>Cargando hilos...</p>;

  return (
    <div className="forum-container">
      {/* 🧭 Navegación por categorías */}
      <div className="forum-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-button ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📝 Formulario para crear hilo */}
      <div className="create-thread-section">
        <CreateThreadForm
          onNewThread={handleNewThread}
          defaultCategory={activeCategory}
        />
      </div>

      {/* 🧵 Lista de hilos */}
      <div className="threads-section">
        <h2>{activeCategory}</h2>
        <ThreadsList
          threads={threads} // sin filtro
          onThreadClick={handleThreadClick}
          onDelete={handleDeleteThread}
          currentUserId={user?._id}
        />
      </div>
    </div>
  );
}
