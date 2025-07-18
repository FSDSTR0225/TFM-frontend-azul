import React from "react";
import mocksUser from "./mocks/mocksUser";
import "../style/UserList.css";
import { useNavigate } from "react-router-dom";

function UserList() {
  const navigate = useNavigate();

  return (
    <section className="user-section">
      <h2 className="section-title-user-list">
        <img src="/images/gamer.png" alt="gamers" />
        Sugerencias de jugadores
      </h2>
      <div className="user-list">
        {mocksUser.map((user) => (
          <div className="user-card" key={user.id}>
            <div className="user-avatar-container">
              <img
                src={user.avatar}
                alt={user.username}
                className="user-avatar"
              />
            </div>
            <div className="user-info">
              <h3 className="username-mock-list">{user.username}</h3>
              <div className="user-genres">
                {user.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="user-explore">
                <button onClick={() => navigate("/login")}>Conectar</button>
                <button onClick={() => navigate("/register")}>
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserList;
