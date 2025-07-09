import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/NoEventSuggested.css";

function NoEventSuggested() {
  const navigate = useNavigate();

  return (
    <div className="no-suggestions-container">
      {/* 🗨️ Mensaje amigable */}
      <h3 className="no-suggestions-title">
        ¡No hay eventos sugeridos por ahora!
      </h3>
      <p className="no-suggestions-text">
        No encontramos partidas ideales para ti en este momento. Pero puedes...
      </p>

      {/* 🔘 Acciones */}
      <div className="placeholder-actions">
        <button
          className="btn-preferences"
          onClick={() => navigate("/profile/preferences")}
        >
          🎯 Ajustar preferencias
        </button>
        <button className="btn-explore" onClick={() => navigate("/events")}>
          🔍 Ver todos los eventos
        </button>
      </div>
    </div>
  );
}

export default NoEventSuggested;
