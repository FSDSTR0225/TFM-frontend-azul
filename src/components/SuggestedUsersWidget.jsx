import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/SuggestedUsersWidget.css";
import { FaUserPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedUsersWidget() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersSuggestions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Error al cargar sugerencias");
          setLoading(false);
          return;
        }
        setSuggestedUsers(data.suggestions);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUsersSuggestions();
  }, [token]);

  const handleOnClick = (id) => {
    setSuggestedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== id)
    );
  };

  return (
    <div className="modular-card suggested-users-card">
      <div className="modular-card-header">
        <FaUserPlus className="modular-card-icon" />
        <h3>Sugerencias de usuarios</h3>
      </div>
      <div className="modular-card-content">
        {loading && <div>Cargando sugerencias...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <ul className="card-suggestion-container">
            {Array.isArray(suggestedUsers) && suggestedUsers.length === 0 && (
              <p>No hay sugerencias disponibles por ahora</p>
            )}
            {Array.isArray(suggestedUsers) &&
              suggestedUsers.map((suggest) => (
                <li className="suggestion-content" key={suggest._id}>
                  <img
                    className="img-suggestion-user"
                    src={suggest.avatar}
                    alt={suggest.username}
                  />
                  <span
                    className="username-suggestion"
                    title={suggest.username}
                  >
                    {suggest.username}
                  </span>
                  <div className="users-suggest-btn">
                    <button className="btn-connect">Conectar</button>
                    <button
                      className="btn-profile"
                      onClick={() => navigate(`/users/${suggest._id}`)}
                    >
                      Ver perfil
                    </button>
                  </div>
                  <span
                    className="btn-suggestion"
                    title="Eliminar sugerencia"
                    onClick={() => handleOnClick(suggest._id)}
                  >
                    X
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SuggestedUsersWidget;
