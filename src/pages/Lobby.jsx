import React from "react";
import AuthContext from "../context/AuthContext";
// import DailySummary from "../components/DailySummary";
// import PlayerSuggestion from "../components/PlayerSuggestion";
// import EventSuggestion from "../components/EventSuggestion";
import Dashboard from "../components/Dashboard";
import "../style/Lobby.css";

function Lobby() {
  const authContext = React.useContext(AuthContext);

  return (
    <div className="lobby-content">
      <div className="lobby-title-container">
        <h1 className="lobby-title">
          ¡Bienvenido {authContext.user.username}!
        </h1>
      </div>
      {/* <div className="lobby-fixed-container">
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
      </div> */}
      <Dashboard />
    </div>
  );
}

export default Lobby;
