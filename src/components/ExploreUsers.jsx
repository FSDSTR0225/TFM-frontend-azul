import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import "../style/ExploreUsers.css";

const API_URL = import.meta.env.VITE_API_URL;

function ExploreUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/search/users?query=${query}`);
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando búsqueda...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  {
    users.map((users) => {
      console.log("USERS COMPLETOS:", users);
    });
  }

  return (
    <>
      <section className="explore-users-page-container">
        <div className="explore-users-page">
          <h2>
            Usuarios encontrados por:{" "}
            <span className="query-explore-users">"{query}"</span>
          </h2>
        </div>
        <div className="users-explore-grid">
          {users.map((user) => (
            <div key={user._id} className="player-card">
              <div className="player-avatar-container">
                <img
                  loading="lazy"
                  src={
                    user.avatar && user.avatar.trim() !== ""
                      ? user.avatar
                      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                  }
                  alt={user.username}
                  className="player-avatar"
                />
              </div>

              <h3 className="username-mock-list">{user.username}</h3>

              <div className="player-games">
                {user.favoriteGames?.map((game, index) => (
                  <span key={index} className="game-tag">
                    {game.name}
                  </span>
                ))}
              </div>

              <div className="player-actions">
                <button className="player-button-connect">Conectar</button>
                <button
                  className="player-button"
                  onClick={() => navigate(`/users/${user._id || user.id}`)}
                >
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default ExploreUsers;
