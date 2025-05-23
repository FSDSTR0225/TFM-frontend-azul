import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import { FaSearchengin } from "react-icons/fa6";
import "../style/NavBar.css";
import blankImg from "/images/profile/blankImg.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const NavBar = ({ setSearch, showSearch, setShowSearch }) => {
  // const { user, logout } = useContext(AuthContext);
  const authContext = useContext(AuthContext);

  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await fetch(`${API_URL}/platforms`);
        if (!response.ok) {
          throw new Error("Error fetching platforms");
        }
        const data = await response.json();
        setPlatforms(data.platforms);
      } catch (error) {
        console.error("Error al cargar plataformas en navbar:", error);
      }
    };

    fetchPlatforms();
  }, []);

  // const navigate = useNavigate();

  // // const handleLogout = () => {
  // //   // logout(),
  // //   authContext.logout;
  // //   navigate("/");
  // // };

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
        <li>
          <button className="navbar-btn" onClick={toggleExplore}>
            <FaSearchengin className="navbar-icon" />
          </button>
        </li>
      </ul>
      <ul className="navbar-login">
        {/* {!user ? ( */}
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
