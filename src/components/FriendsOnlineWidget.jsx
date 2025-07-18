import React, { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import "../style/FriendsOnlineWidget.css";
import { socket } from "../socket";
import { FaUserFriends } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function FriendsOnlineWidget() {
  const [friends, setFriends] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchFriends = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const allFriends = Array.isArray(data.friends) ? data.friends : [];
      setFriends(allFriends);
    } catch (error) {
      console.error("Error al cargar los amigos:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (!token) return;

    const refreshFriends = () => fetchFriends();
    socket.on("userConnected", refreshFriends);
    socket.on("userDisconnected", refreshFriends);

    return () => {
      socket.off("userConnected", refreshFriends);
      socket.off("userDisconnected", refreshFriends);
    };
  }, [token, fetchFriends]);

  if (!token) return null;

  const sortedFriends = [...friends].sort(
    (a, b) => b.onlineStatus - a.onlineStatus
  );

  return (
    <div className="modular-card-friends-online-card">
      <div className="modular-card-header">
        <FaUserFriends className="modular-card-icon" />
        <h3>Amigos</h3>
      </div>
      <div className="modular-card-content-friends-online">
        {sortedFriends.length === 0 ? (
          <p>No tienes amigos aún.</p>
        ) : (
          <div className="friends-list">
            {sortedFriends.map((friend) => (
              <div
                key={friend.id}
                className={`friend-item ${
                  friend.onlineStatus ? "online" : "offline"
                }`}
              >
                <div className="avatar-online wrapper">
                  <img
                    src={friend.avatarUrl}
                    alt={`${friend.username} avatar`}
                    className="friend-online-avatar"
                  />
                  <span
                    className={`status-indicator ${
                      friend.onlineStatus ? "green" : "red"
                    }`}
                  />
                </div>
                <span
                  className={`friend-online-name ${
                    friend.onlineStatus ? "" : "offline-name"
                  }`}
                >
                  {friend.username}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsOnlineWidget;
