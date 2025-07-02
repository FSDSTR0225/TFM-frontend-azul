import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import EventsToday from "../components/EventsToday";
// import WidgetSystem from "../components/WidgetSystem";
import { PacmanLoader } from "react-spinners";
import "../style/Lobby.css";

import FriendsOnlineWidget from "../components/FriendsOnlineWidget";
import SuggestedUsersWidget from "../components/SuggestedUsersWidget";
import CalendarWidget from "../components/CalendarWidget";
import SuggestedEventsWidget from "../components/SuggestedEventsWidget";
import SuggestedGamesWidget from "../components/SuggestedGamesWidget";
import { GiRetroController, GiWingedSword } from "react-icons/gi";
import { TbCalendarBolt } from "react-icons/tb";

function Lobby() {
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.user) {
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
    <div className="lobby-container">
      <div className="lobby-content">
        <div className="lobby-header">
          <h1 className="lobby-title">
            ¡Bienvenido a tu lobby <span>{authContext.user.username}</span>!
          </h1>
          <h2 className="lobby-subtitle">¿Listo para jugar hoy?</h2>
        </div>

        <main className="lobby-main-content">
          <section className="lobby-suggestions-section">
            <div className="games-slider-section">
              <h3 className="section-title">
                <GiRetroController className="icon-lobby-suggestions" />
                Juegos sugeridos para ti
              </h3>
              <div className="games-slider-glass">
                <SuggestedGamesWidget />
              </div>
            </div>
          </section>
          <section className="lobby-info-section">
            <div className="dashboard-glass">
              <Dashboard />
            </div>
            <div className="events-today-glass">
              <EventsToday />
            </div>
          </section>

          <section className="lobby-section-events">
            <div className="events-left-section">
              <h3 className="section-title">
                <TbCalendarBolt className="icon-lobby-suggestions" />
                Calendario de eventos
              </h3>
              <div className="calendar-section">
                <CalendarWidget />
              </div>
            </div>
            <div className="events-right-section">
              <div className="events-grid-section">
                <h3 className="section-title">
                  <GiWingedSword className="icon-lobby-suggestions" />
                  Eventos recomendados
                </h3>
                <div className="lobby-events-suggestions">
                  <SuggestedEventsWidget />
                </div>
              </div>
            </div>
          </section>
          <section className="lobby-sidebar-section">
            <div className="friends-widget-glass">
              <FriendsOnlineWidget />
            </div>
            <div className="users-widget-glass">
              <SuggestedUsersWidget />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Lobby;
