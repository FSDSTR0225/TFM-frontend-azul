import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
// import DailySummary from "../components/DailySummary";
// import PlayerSuggestion from "../components/PlayerSuggestion";
// import EventSuggestion from "../components/EventSuggestion";
import Dashboard from "../components/Dashboard";
import EventsToday from "../components/EventsToday";
import WidgetSystem from "../components/WidgetSystem";
import { PacmanLoader } from "react-spinners";
import "../style/Lobby.css";

function Lobby() {
  const [showLoading, setShowLoading] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.user) {
      // Loading mínimo de 2 segundos
      const timeout = setTimeout(() => setShowLoading(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [authContext.user]);

  if (!authContext.user) return null;

  if (showLoading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Prepárando tu lobby</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="lobby-content">
      <div className="lobby-title-container">
        <h1 className="lobby-title">
          ¡Bienvenido a tu lobby {authContext.user.username}!
        </h1>
        <h2 className="lobby-subtitle">¿Listo para jugar hoy?</h2>
      </div>
      <section className="lobby-section-main">
        <div className="lobby-dashboard-left">
          <Dashboard />
        </div>
        <div className="lobby-events-right">
          <EventsToday />
        </div>
      </section>
      <section className="lobby-section-widgets">
        <div className="lobby-widgets-container">
          <WidgetSystem />
        </div>
      </section>
    </div>
  );
}

export default Lobby;

{
  /* <div className="lobby-fixed-container">
        <h2 className="lobby-resume">Resumen diario</h2>
        <DailySummary />
        <div className="suggestions-container">
          <div className="suggestions-players">
            <h2>Sugerencia de jugadores</h2>
            <PlayerSuggestion />
          </div>
          <div className="suggestions-events">
            <h2>Sugerencia de eventos</h2>
            <EventSuggestion />
          </div>
        </div>
      </div> */
}
