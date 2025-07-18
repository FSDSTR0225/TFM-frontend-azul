// ThreadsList.jsx
import React from "react";
import ThreadCard from "./ThreadCard";
import "../style/ThreadsList.css";

export default function ThreadsList({
  threads,
  onThreadClick,
  onDelete,
  currentUserId,
}) {
  if (!threads.length) {
    return <p className="no-threads">No hay hilos aún.</p>;
  }

  return (
    <div className="threads-list">
      {threads.map((thread) => (
        <div key={thread._id} className="thread-with-comments">
          <ThreadCard
            thread={thread}
            onClick={() => onThreadClick(thread)}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </div>
  );
}
