import React, { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { PacmanLoader } from "react-spinners";
import "../style/FriendsOnlineWidget.css";
import { socket } from "../socket";
import { FaUserFriends } from "react-icons/fa"; // icono de amigos

const API_URL = import.meta.env.VITE_API_URL;

function FriendsOnlineWidget() {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useContext(AuthContext);

  const fetchOnlineFriends = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/friends/online`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOnlineFriends(data.onlineFriends);
    } catch (error) {
      console.error("Error al cargar los amigos en línea:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOnlineFriends();
  }, [fetchOnlineFriends]);

  useEffect(() => {
    if (!token) return;
    const handleUserConnect = () => fetchOnlineFriends();
    const handleUserDisconnect = () => fetchOnlineFriends();

    socket.on("userConnected", handleUserConnect);
    socket.on("userDisconnected", handleUserDisconnect);

    return () => {
      socket.off("userConnected", handleUserConnect);
      socket.off("userDisconnected", handleUserDisconnect);
    };
  }, [token, fetchOnlineFriends]);

  if (!token) return null;

  return (
    <div className="modular-card-friends-online-card">
      <div className="modular-card-header">
        <FaUserFriends className="modular-card-icon" />
        <h3>Amigos en línea</h3>
      </div>
      <div className="modular-card-content">
        {loading ? (
          <div className="loading-container">
            <PacmanLoader color="#FFD700" size={32} />
          </div>
        ) : onlineFriends.length === 0 ? (
          <p>No hay amigos conectados ahora mismo.</p>
        ) : (
          <div className="friends-list">
            {onlineFriends.map((friend) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsOnlineWidget;
