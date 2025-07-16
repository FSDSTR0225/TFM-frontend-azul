import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import EventsToday from "../components/EventsToday";
// import WidgetSystem from "../components/WidgetSystem";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { PacmanLoader } from "react-spinners";
import "../style/Lobby.css";
import FriendsOnlineWidget from "../components/FriendsOnlineWidget";
import SuggestedUsersWidget from "../components/SuggestedUsersWidget";
import CalendarWidget from "../components/CalendarWidget";
import SuggestedEventsWidget from "../components/SuggestedEventsWidget";
import SuggestedGamesWidget from "../components/SuggestedGamesWidget";
import { GiRetroController, GiWingedSword } from "react-icons/gi";
import { TbCalendarBolt } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import BotAssistant from "../components/BotAssistant";
import LibrarySteam from "../components/LibrarySteam";

function Lobby() {
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventsOfDay, setEventsOfDay] = useState([]);
  const [allMyEvents, setAllMyEvents] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/events/my-events`,
          {
            headers: { Authorization: `Bearer ${authContext.token}` },
          }
        );
        const data = await res.json();
        setAllMyEvents(data.eventos);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    if (authContext.token) {
      fetchUserEvents();
    }
  }, [authContext.token]);

  useEffect(() => {
    if (authContext.user) {
      const timeout = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [authContext.user]);

  if (!authContext.user) return null;

  const handleDayClick = (day) => {
    const clickedDateStr = new Date(day).toDateString();
    const selectedDateStr = selectedDay?.toDateString();

    // Si ya está abierto el mismo día, cierra
    if (clickedDateStr === selectedDateStr) {
      setSelectedDay(null);
      setEventsOfDay([]);
      return;
    }

    // Si es otro día, busca eventos y abre
    const eventsThatDay = allMyEvents.filter((ev) => {
      return new Date(ev.date).toDateString() === clickedDateStr;
    });

    setSelectedDay(eventsThatDay.length > 0 ? day : null);
    setEventsOfDay(eventsThatDay);
  };

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
      <div className="hud-container">
        <h1 className="lobby-title scan-effect">
          ¡Bienvenido a tu lobby <span>{authContext.user.username}</span>!
        </h1>
        <h2 className="lobby-subtitle">¿Listo para jugar hoy?</h2>
      </div>
      <div className="lobby-content">
        <section className="lobby-top-section fade in">
          <div className="left-zone fade-in-delayed">
            <FriendsOnlineWidget />

            <div className="users-widget-glass">
              <h3 className="section-title-users-suggestions">
                <FaUsers className="icon-lobby-suggestions-users" />
                Usuarios afines a ti
              </h3>
              <SuggestedUsersWidget />
            </div>
          </div>

          <div className="right-zone fade-in-delayed">
            <div className="top-right-widgets">
              <Dashboard />

              <div className="calendar-widget-glass">
                <h3 className="section-title-events">
                  <TbCalendarBolt className="icon-lobby-suggestions" />
                  Calendario de eventos
                </h3>
                <CalendarWidget onEventClick={handleDayClick} />
              </div>

              <AnimatePresence>
                {selectedDay && eventsOfDay.length > 0 && (
                  <Motion.div
                    key="event-cards"
                    initial={{ opacity: 0, x: -50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="calendar-events-card-container"
                  >
                    <div className="calendar-event-cards">
                      {eventsOfDay.slice(0, 2).map((event) => (
                        <div key={event.id} className="events-today-card">
                          <h2 className="card-title-events">¡Evento!</h2>
                          <h3 className="events-title-card-lobby">
                            {event.title}
                          </h3>
                          <p className="events-date-card-lobby">
                            <strong>Hora:</strong>{" "}
                            {new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="events-game-card-lobby">
                            <strong>Juego:</strong> {event.game.name}
                          </p>
                          <div className="events-platform-card-lobby">
                            <img
                              src={event.platform.icon}
                              alt={`Icono de ${event.platform.name}`}
                              className="events-icon-platform-card-lobby"
                            />
                            <span className="events-platform-name">
                              {event.platform.name === "Nintendo Switch"
                                ? "Switch"
                                : event.platform.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="events-suggestions-glass">
              <h3 className="section-title">
                <GiWingedSword className="icon-lobby-suggestions" />
                Eventos recomendados{" "}
              </h3>
              <SuggestedEventsWidget />
            </div>
          </div>
        </section>

        <section className="lobby-bottom-section fade-in-delayed">
          <div className="games-slider-section reduced-size">
            <h3 className="section-title-game-suggestions">
              <GiRetroController className="icon-lobby-suggestions" />
              Juegos que quizás te gusten
            </h3>
            <div className="games-slider-glass">
              <SuggestedGamesWidget />
            </div>
          </div>
          {authContext.user.steamId && (
            <div className="steam-library-glass">
              <LibrarySteam />
            </div>
          )}
        </section>
        <BotAssistant />
      </div>
    </div>
  );
}

export default Lobby;
