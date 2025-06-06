import React from "react";
import { Link } from "react-router-dom";
import "../style/Sidebar.css";

import AuthContext from "../context/AuthContext";
const Sidebar = () => {
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        🎮
        <span className="logo-text"></span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/edit/profile"  className="sidebar-link">Datos del Perfil</Link>
        <Link to="/friends" className="sidebar-link">Gestion Amigos</Link>
        <Link to="/events" className="sidebar-link">Eventos</Link>
        <Link to="/games" className="sidebar-link">Juegos</Link>
        <Link to="/settings" className="sidebar-link">Configuraciones</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
