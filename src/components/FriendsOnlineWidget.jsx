import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";
import "../style/FriendsOnlineWidget.css";

const API_URL = import.meta.env.VITE_API_URL;

function FriendsOnlineWidget() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    const fetchOnlineFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/friends/online`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setFriends(data.onlineFriends);
      } catch (error) {
        console.error("Error al cargar los amigos en línea:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineFriends();
  }, [token]);

  if (!token) return null;

  if (loading) {
    // Si está cargando, muestra...
    return (
      <div className="loading-container">
        <h1 className="loading-title">Cargando lobby...</h1>
        <PacmanLoader color="#FFD700" size={40} />{" "}
        {/* Los componentes de React spinner reciben css en el propio componente */}
      </div>
    );
  }

  return (
    <div className="friends-online-widget">
      <h3>Amigos en línea</h3>
      {friends.length === 0 ? (
        <p>No hay amigos conectados ahora mismo.</p>
      ) : (
        friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <div className="avatar-online wrapper">
              <img
                src={friend.avatar}
                alt={`${friend.username} avatar`}
                className="friend-online-avatar"
              />
              <span className="online-indicator" />
            </div>
            <span className="friend-online-name">{friend.username}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendsOnlineWidget;
