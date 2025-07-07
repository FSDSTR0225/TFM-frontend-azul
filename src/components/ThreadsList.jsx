// ThreadsList.jsx
import React from "react";
import ThreadCard from "./ThreadCard";

export default function ThreadsList({
  threads,
  onThreadClick,
  onDelete,
  currentUserId,
}) {
  if (!threads.length) {
    return <p>No hay hilos aún.</p>;
  }

  return (
    <div>
      {threads.map((thread) => (
        <ThreadCard
          key={thread._id}
          thread={thread}
          onClick={onThreadClick}
          onDelete={onDelete}
          currentUserId={currentUserId} // ✅ Pasamos el ID del usuario autenticado
        />
      ))}
    </div>
  );
}
