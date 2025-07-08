import React from "react";
import { Link } from "react-router-dom";
import "../style/Sidebar.css";

import AuthContext from "../context/AuthContext";
const Sidebar = () => {
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        
        <span className="logo-text"></span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/edit/profile"  className="sidebar-link">Editar Perfil</Link>
        <Link to="/friends" className="sidebar-link">Gestion Amigos</Link>
        <Link to="/management" className="sidebar-link">Solicitudes Eventos</Link>
        <Link to="/settings" className="sidebar-link">Preferencias Gamer</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
