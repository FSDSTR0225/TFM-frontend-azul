import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
// import DailySummary from "../components/DailySummary";
// import PlayerSuggestion from "../components/PlayerSuggestion";
// import EventSuggestion from "../components/EventSuggestion";
import Dashboard from "../components/Dashboard";
import EventsToday from "../components/EventsToday";
// import WidgetSystem from "../components/WidgetSystem";
import { PacmanLoader } from "react-spinners";
import "../style/Lobby.css";
// import Panel from "../components/Panel";
// import Section from "../components/Section";
import FriendsOnlineWidget from "../components/FriendsOnlineWidget";
import SuggestedUsersWidget from "../components/SuggestedUsersWidget";
import CalendarWidget from "../components/CalendarWidget";
import SuggestedEventsWidget from "../components/SuggestedEventsWidget";
import SuggestedGamesWidget from "../components/SuggestedGamesWidget";
import { FaUserFriends, FaCalendarAlt, FaGamepad } from "react-icons/fa";

function Lobby() {
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.user) {
      // Loading mínimo de 2 segundos
      const timeout = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [authContext.user]);

  if (!authContext.user) return null;

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Preparando tu lobby</h1>
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
      <div className="lobby-glass-container">
        <section className="lobby-section-main">
          <div className="lobby-dashboard-left">
            <Dashboard />
          </div>
          <div className="lobby-events-right">
            <EventsToday />
          </div>
        </section>
        <section className="lobby-section-widgets">
          {/* <div className="lobby-widgets-container"> */}
          {/* <div className="widgets-grid"> */}
          <div className="lobby-left-sidebar">
            <div className="suggested-users-container">
              <SuggestedUsersWidget />
            </div>
            <div className="lobby-left-sidebar-friends">
              <FriendsOnlineWidget />
            </div>
            <div>
              <CalendarWidget />
            </div>
          </div>

          <div className="lobby-right-suggestions">
            <div className="lobby-event-suggestions">
              <SuggestedEventsWidget />
            </div>
            <SuggestedGamesWidget />
          </div>
          <div className="lobby-down-suggestions"></div>
        </section>
      </div>
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
