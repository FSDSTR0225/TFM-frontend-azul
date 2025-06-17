import { React, useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../style/SuggestedUsersWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function SuggestedUsersWidget() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsersSuggestions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/widgets/suggestions/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        console.error("Error al acceder a las sugerencias de jugadores", error);
        setError(error.message);
      }
    };
    fetchUsersSuggestions();
  }, [token]);

  const handleOnClick = (id) => {
    setSuggestedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== id)
    );
  };

  if (loading) {
    return <div>Cargando sugerencias...</div>;
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="suggestions-widget-content">
      {error && <p>Error al cargar sugerencias</p>}
      {/* {suggestedUsers.length === 0 && !loading && !error && (
        <p>No hay sugerencias disponibles por ahora</p>
      )} */}

      <ul className="card-suggestion-container">
        {Array.isArray(suggestedUsers) &&
          suggestedUsers.map((suggest) => (
            <li className=" suggestion-content" key={suggest._id}>
              <img
                className="img-suggestion-user"
                src={suggest.avatar}
                alt={suggest.username}
              />
              <span className="username-suggestion">{suggest.username}</span>
              <span
                className="btn-suggestion"
                onClick={() => handleOnClick(suggest._id)}
              >
                X
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SuggestedUsersWidget;
