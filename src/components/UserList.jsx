import React from "react";
import mocksUser from "./mocks/mocksUser";

function UserList() {
  return (
    <section className="user-section">
      <h2 className="section-title">
        {" "}
        <img src="/src/assets/team.png" alt="gamers" />
        Sugerencias de jugadores
      </h2>
      <div className="user-list">
        {mocksUser.map((user) => (
          <div className="user-card" key={user.id}>
            <img
              src={user.avatar}
              alt={user.username}
              className="user-avatar"
            />
            <h3 className="username">{user.username}</h3>
            <div className="user-genres">
              {user.genre.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>

            <button>Conectar</button>
            <button>Ver perfil</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserList;
