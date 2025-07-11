import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import "../style/MobileNavbar.css";

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="mobile-navbar">
      <div className="hamburger" onClick={toggleSidebar}>
        ☰
      </div>

      <div className={`sidebar-navbar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={closeSidebar}>
          ✕
        </button>

        <ul className="menu-mini-navbar">
          <li onClick={closeSidebar}>
            <NavLink to="/" className={"ham-link"}>
              Inicio
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="/games" className={"ham-link"}>
              Juegos
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="/events" className={"ham-link"}>
              Eventos
            </NavLink>
          </li>
          <li onClick={closeSidebar}>
            <NavLink to="/post" className={"ham-link"}>
              Comunidad
            </NavLink>
          </li>

          {authContext.isLoggedIn ? (
            <>
              <li onClick={closeSidebar}>
                <NavLink to="/messages" className={"ham-link"}>
                  Mensajes
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/players" className={"ham-link"}>
                  Jugadores
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/edit/profile" className={"ham-link"}>
                  Editar perfil
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/friends" className={"ham-link"}>
                  Amigos
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/my-events" className={"ham-link"}>
                  Mis eventos
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/management" className={"ham-link"}>
                  Gestión de solicitudes
                </NavLink>
              </li>
              <li onClick={closeSidebar}>
                <NavLink to="/configuracion" className={"ham-link"}>
                  Configuración
                </NavLink>
              </li>
              <li
                onClick={() => {
                  closeSidebar();
                  authContext.logout();
                }}
              >
                Cerrar sesión
              </li>
            </>
          ) : (
            <li onClick={closeSidebar}>
              <NavLink to="/login">Login / Sign Up</NavLink>
            </li>
          )}
        </ul>
      </div>

      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
}

export default MobileNavbar;
