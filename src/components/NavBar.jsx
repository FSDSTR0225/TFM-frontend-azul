import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import NotificationContext from "../context/NotificationContext";
import "../style/NavBar.css";
import blankImg from "/images/profile/blankImg.jpg";
import SearchInputExplore from "./SearchInputExplore";
import { FaBell } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const NavBar = ({ showSearch }) => {
  const authContext = useContext(AuthContext);
  const { notifications, markAllRead } = useContext(NotificationContext);

  const [platforms, setPlatforms] = useState([]);
  const [isUserOpen, setIsUserOpen] = useState(false); // Estado para el dropdown de usuario
  const [isPlatOpen, setIsPlatOpen] = useState(false); // Estado para el dropdown de plataformas
  const [search, setSearch] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [totalUnreadChat, setTotalUnreadChat] = useState(0);

  useEffect(() => {
    setIsUserOpen(false);
  }, [authContext.isLoggedIn]); // Resetea el dropdown de usuario al cambiar el estado de login haciendo que se inicialice en falso

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/platforms`);
        if (!res.ok) throw new Error();
        const { platforms } = await res.json();
        setPlatforms(platforms);
      } catch {
        console.error("Error fetching platforms");
      }
    })();
  }, []);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/chats/unread-count`, {
          headers: {
            Authorization: `Bearer ${authContext.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener los mensajes no leidos");
        }

        const data = await response.json();
        setTotalUnreadChat(data.totalUnread || 0);
      } catch (error) {
        console.error("Error al obtener mensajes no leídos:", error);
      }
    };

    if (authContext.isLoggedIn) {
      fetchUnreadMessages();
    }
  }, [authContext.isLoggedIn, authContext.token]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to={authContext.isLoggedIn ? "/lobby" : "/"} className="logo">
          Link2play
        </NavLink>
      </div>

      <div className="navbar-center">
        <ul className="navbar-links">
          <li
            className="dropdown"
            onMouseEnter={() => setIsPlatOpen(true)}
            onMouseLeave={() => setIsPlatOpen(false)}
          >
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Juegos
            </NavLink>

            {/* bridge invisible para mantener hover */}
            <div className="dropdown-platforms-bridge" />

            <ul className={`dropdown-platforms ${isPlatOpen ? "show" : ""}`}>
              {platforms.map((p) => (
                <li key={p._id}>
                  <NavLink to={`/platforms/${p._id}/games`}>{p.name}</NavLink>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Eventos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/post"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Comunidad
            </NavLink>
          </li>

          {authContext.isLoggedIn && (
            <>
              <li className="messages-badge">
                <NavLink
                  to="/messages"
                  onClick={() => setTotalUnreadChat(0)} // cambair logica si queremos que se vayan eliminando 1 a 1
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Mensajes
                  {totalUnreadChat > 0 && (
                    <span className="message-ball-badge">
                      {totalUnreadChat}
                    </span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/players"
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Jugadores
                </NavLink>
              </li>
              <li className="navbar-explore">
                <SearchInputExplore
                  search={search}
                  setSearch={setSearch}
                  showSearch={showSearch}
                />
              </li>
            </>
          )}
        </ul>
      </div>

      <ul className="navbar-login">
        {!authContext.isLoggedIn ? (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Login/Sign Up
            </NavLink>
          </li>
        ) : (
          <>
            <li
              className="notification-container"
              style={{
                position: "relative",
                cursor: "pointer",
                marginRight: "15px",
              }}
              onClick={(e) => {
                e.stopPropagation(); // que no abra el menú de usuario
                markAllRead(); // marcamos todas las notificaciones como leídas
                setIsNotifOpen((prev) => !prev);
                setIsUserOpen(false);
              }}
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}

              {isNotifOpen && (
                <div className="notification-dropdown">
                  {notifications.length === 0 ? (
                    <p style={{ padding: "10px" }}>No tienes notificaciones</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className="notification-item">
                        <p>
                          {/* Ya viene formateado desde el back en n.message */}
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
            <li
              className="navbar-user-dropdown"
              onMouseEnter={() => {
                setIsUserOpen(true);
                setIsNotifOpen(false); // Opcional: cerrar notificaciones si está abierto
              }}
              onMouseLeave={() => setIsUserOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                position: "relative",
              }}
            >
              <img
                src={authContext.user?.avatar || blankImg}
                alt="Avatar"
                className="navbar-avatar"
              />
              <NavLink to="/users/me" id="perfil">
                <span
                  className="navbar-username"
                  title={
                    authContext.user.username.length > 12
                      ? authContext.user.username
                      : ""
                  }
                >
                  {authContext.user.username}
                </span>
              </NavLink>

              {/* bridge invisible para mantener hover */}
              <div className="dropdown-bridge" />

              <ul className={`dropdown-user ${isUserOpen ? "show" : ""}`}>
                <li>
                  <NavLink to="/edit/profile" className="dropdown-options">
                    Editar perfil
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/friends" className="dropdown-options">
                    Amigos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-events" className="dropdown-options">
                    Mis eventos
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/management" className="dropdown-options">
                    Gestión de solicitudes
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to="/settings" className="dropdown-options">
                    Configuración
                  </NavLink>
                </li>
                <li>
                  <button
                    className="dropdown-options"
                    onClick={() => authContext.logout()}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
