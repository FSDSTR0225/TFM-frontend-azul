import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/NoEventSuggested.css";
// import IABotEventHelper from "./IABotEventHelper";

function NoEventSuggested() {
// showCalendar = false,
//   showAI = false,
// CalendarComponent = null,
  const navigate = useNavigate();

  return (
    <div className="no-suggestions-container">
      {/* 🎮 Ilustración o ícono */}
      <div className="illustration-zone">
        <img
          src="/img/placeholder-joystick.png"
          alt="Sin eventos sugeridos"
          className="placeholder-image"
        />
      </div>

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

      {/* 📅 Calendario si se pasa como prop */}
      {/* {showCalendar && CalendarComponent && (
        <div className="calendar-wrapper">
          <h4>Tu calendario de eventos</h4>
          <div className="calendar-slot">{CalendarComponent}</div>
        </div>
      )} */}

      {/* 🤖 IA de descubrimiento de eventos (comentado por ahora) */}
      {/*
      {showAI && (
        <div className="ai-helper-block">
          <IABotEventHelper />
        </div>
      )}
      */}
    </div>
  );
}

export default NoEventSuggested;
