import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaSearchengin } from "react-icons/fa6";
import "../style/NavBar.css";
import blankImg from "/images/profile/blankImg.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const NavBar = ({ setSearch, showSearch, setShowSearch }) => {
  const authContext = useContext(AuthContext);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${API_URL}/platforms`);
        if (!response.ok) throw new Error("Error fetching platforms");
        const data = await response.json();
        setPlatforms(data.platforms);
      } catch (error) {
        console.error("Error al cargar plataformas en navbar:", error);
      }
    };

    fetchPlatforms();
  }, []);

  const toggleExplore = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearch("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {authContext.isLoggedIn ? (
          <NavLink to="/lobby" className="logo">
            Link2play
          </NavLink>
        ) : (
          <NavLink to="/" className="logo">
            Link2play
          </NavLink>
        )}
      </div>
      <div className="navbar-center">
        <ul className="navbar-links">
          <li className="dropdown">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
            >
              Juegos
            </NavLink>
            <ul className="dropdown-platforms">
              {platforms.map((platform) => (
                <li key={platform._id}>
                  <NavLink to={`/platforms/${platform._id}/games`}>
                    {platform.name}
                  </NavLink>
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
              <li>
                <NavLink
                  to="/Mensajes"
                  className={({ isActive }) =>
                    isActive ? "active-link" : "nav-link"
                  }
                >
                  Mensajes
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
              <li>
                <button
                  className="navbar-btn"
                  onClick={toggleExplore}
                  title="Explorar juegos"
                  aria-label="Buscar juegos"
                >
                  <FaSearchengin className="navbar-icon" />
                </button>
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
              Login in/Sign Up
            </NavLink>
          </li>
        ) : (
          <li className="navbar-user">
            <img
              src={authContext.user?.avatar || blankImg}
              alt="Avatar"
              className="navbar-avatar"
            />
            <NavLink to="/users/me" id="perfil">
              {/* <span className="navbar-username">{user.username}</span> */}
              <span className="navbar-username">
                {authContext.user?.username}
              </span>
            </NavLink>
            <ul className="dropdown-user">
              <li>
                <NavLink to="/edit/profile" className="dropdown-options">
                  Editar perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="/solicitudes" className="dropdown-options">
                  Amigos
                </NavLink>
              </li>
              <li>
                <NavLink to="/management" className="dropdown-options">
                  Gestión de solicitudes
                </NavLink>
              </li>
              <li>
                <NavLink to="/configuracion" className="dropdown-options">
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
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
