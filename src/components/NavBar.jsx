import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/NavBar.css";

const NavBar = ({ setSearch, showSearch, setShowSearch }) => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(), navigate("/");
  };

  const toggleExplore = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearch("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" className="logo">
          Link2play
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li className="dropdown">
          <NavLink
            to="/platforms"
            className={({ isActive }) =>
              isActive ? "active-link" : "nav-link"
            }
          >
            Juegos
          </NavLink>
          <ul className="dropdown-platforms">
            <li>
              <NavLink to="/platforms/pc/games">PC</NavLink>
            </li>
            <li>
              <NavLink to="/platforms/ps5/games">PS5</NavLink>
            </li>
            <li>
              <NavLink to="/platforms/ps4/games">PS4</NavLink>
            </li>
            <li>
              <NavLink to="/platforms/xbox/games">Xbox</NavLink>
            </li>
            <li>
              <NavLink to="/platforms/nintendo/games">Nintendo Switch</NavLink>
            </li>
            <li>
              <NavLink to="/platforms/mobile/games">Mobile Games</NavLink>
            </li>
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
        <li>
          <button className="navbar-btn" onClick={toggleExplore}>
            🔍
          </button>
        </li>
      </ul>
      <ul className="navbar-login">
        {!user ? (
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
              src={user.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="navbar-avatar"
            />
            <NavLink to="/perfil" id="perfil">
              <span className="navbar-username">{user.username}</span>
            </NavLink>
            <ul className="dropdown-user">
              <li>
                <NavLink to="/perfil/editar" className="dropdown-options">
                  Editar perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="/solicitudes" className="dropdown-options">
                  Solicitudes de juego
                </NavLink>
              </li>
              <li>
                <NavLink to="/configuracion" className="dropdown-options">
                  Configuración
                </NavLink>
              </li>
              <li>
                <button className="dropdown-options" onClick={handleLogout}>
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
