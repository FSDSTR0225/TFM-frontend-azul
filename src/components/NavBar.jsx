import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../style/NavBar.css";
import blankImg from "/images/profile/blankImg.jpg";
import SearchInputExplore from "./SearchInputExplore";

const API_URL = import.meta.env.VITE_API_URL;

const NavBar = ({ showSearch }) => {
  const authContext = useContext(AuthContext);

  const [platforms, setPlatforms] = useState([]);
  const [isUserOpen, setIsUserOpen] = useState(false); // Estado para el dropdown de usuario
  const [isPlatOpen, setIsPlatOpen] = useState(false); // Estado para el dropdown de plataformas
  const [search, setSearch] = useState("");

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

  // const toggleExplore = () => {
  //   setShowSearch(!showSearch);
  //   if (showSearch) setSearch("");
  // };

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
              <li>
                <NavLink
                  to="/messages"
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
          <li
            className="navbar-user-dropdown"
            onMouseEnter={() => setIsUserOpen(true)}
            onMouseLeave={() => setIsUserOpen(false)}
          >
            <img
              src={authContext.user?.avatar || blankImg}
              alt="Avatar"
              className="navbar-avatar"
            />
            <NavLink to="/users/me" id="perfil">
              <span className="navbar-username">
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
