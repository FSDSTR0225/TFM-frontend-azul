import React, { useEffect, useState, useContext } from "react";
import "./TopNavbar.css";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthenticationContext";
import { FaSearch } from "react-icons/fa";
import blankImg from "/images/profile/blankImg.jpg";

export default function TopNavbar({ showSearch, setShowSearch, setSearch }) {
  const authContext = useContext(AuthContext);

  const [platforms, setPlatforms] = useState([]);

  const Url = "http://localhost:3000/platforms";

  function fetchPlatforms() {
    fetch(Url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setPlatforms(data.platforms);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const toggleExplore = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearch("");
    }
  };

  return (
    <div className="TopNavbar">
      <div className="TopNavbar__container">
        <div className="TopNavbar__logoWrapper">
          <NavLink to="/" className="Topnavbar__logoItem">
            Link2Play
          </NavLink>
        </div>
        <div className="Topnavbar__menuItems">
          <NavLink to="/games" className="Topnavbar__menuItem">
            Juegos
            <div className="Topnavbar__dropDown">
              {platforms.map((platform) => (
                <NavLink
                  className="Topnavbar__dropDown__Item"
                  key={platform._id}
                  to={`/platforms/${platform._id}/games`}
                >
                  {platform.name}
                </NavLink>
              ))}
            </div>
          </NavLink>

          <NavLink to="/events" className="Topnavbar__menuItem">
            Eventos
          </NavLink>
          <NavLink to="/post" className="Topnavbar__menuItem">
            Comunidad
          </NavLink>
          <NavLink
            to="/"
            className="Topnavbar__menuItem"
            onClick={toggleExplore}
          >
            Search
            <FaSearch className="searchIcon" />
          </NavLink>
        </div>
        <div className="Topnavbar__loginItems">
          {!authContext.isLoggedIn ? (
            <NavLink to="/login" className="Topnavbar__loginItem">
              Login / Signup
            </NavLink>
          ) : (
            <>
              <div className="Topnavbar__profileItem">
                {authContext.userInfos.username}
                <img className="profileImg" src={blankImg} />
                <div className="profile__dropDown">
                  <NavLink
                    to="/profile"
                    className="Topnavbar__profileDropDown__item"
                  >
                    Editar perfil
                  </NavLink>
                  <NavLink
                    to="/solicitudes"
                    className="Topnavbar__profileDropDown__item"
                  >
                    Solicitudes de juego
                  </NavLink>
                  <NavLink
                    to="/configuracion"
                    className="Topnavbar__profileDropDown__item"
                  >
                    Configuración
                  </NavLink>
                  <NavLink
                    to="/"
                    className="Topnavbar__profileDropDown__item"
                    onClick={() => authContext.logout()}
                  >
                    Cerrar sesión
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
