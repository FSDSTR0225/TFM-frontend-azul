import { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext";
import "../style/Chat.css";

const API_URL = import.meta.env.VITE_API_URL;

export const Mensajes = () => {
  const { token, user } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_URL);
    socketRef.current.emit("userConnect", user.id);

    socketRef.current.on("private message", (msg) => {
      if (
        msg.sender === selectedFriend?.id ||
        msg.recipient === selectedFriend?.id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedFriend, user.id]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/friends/online`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        const list = Array.isArray(data.onlineFriends)
          ? data.onlineFriends
          : [];
        setOnlineFriends(list);
      } catch (err) {
        console.error("Error al cargar amigos:", err);
        setOnlineFriends([]);
      }
    };
    fetchFriends();
  }, [token]);

  const selectFriend = async (friend) => {
    setSelectedFriend(friend);
    try {
      const res = await fetch(`${API_URL}/chats/${friend.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      setMessages(data);
    } catch (err) {
      console.error("Error al cargar historial de chat:", err);
      setMessages([]);
    }
  };

  // 4. Enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedFriend) return;

    const timestamp = new Date().toISOString();
    const msgPayload = {
      content: message,
      senderId: user.id,
      receiverId: selectedFriend.id,
      timestamp,
    };

    socketRef.current.emit("private message", msgPayload);

    setMessages((prev) => [...prev, { ...msgPayload, senderId: user.id }]);
  };

  const friendsList = onlineFriends.map((f) => ({
    id: f.id ?? f._id,
    username: f.username,
    avatarUrl: f.avatarUrl,
    onlineStatus: f.onlineStatus,
  }));

  return (
    <div className="chat-page">
      <aside className="friends-sidebar">
        <h2>Amigos Online</h2>
        <ul className="friends-list">
          {friendsList.map((friend) => (
            <li
              key={friend.id}
              className={[
                "friend-item",
                selectedFriend?.id === friend.id && "active",
                friend.onlineStatus && "online",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => selectFriend(friend)}
            >
              <img
                src={friend.avatarUrl}
                alt={friend.username}
                className="avatar"
              />
              <span>{friend.username}</span>
              {friend.onlineStatus && <span className="status-dot" />}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-window">
        {selectedFriend ? (
          <>
            <header className="chat-header">
              <img
                src={selectedFriend.avatarUrl}
                alt={selectedFriend.username}
              />
              <h3>{selectedFriend.username}</h3>
            </header>

            <section className="messages-section">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.sender === user.id ? "own" : "friend"
                  }`}
                >
                  <span className="message-text">{msg.content}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </section>

            <form className="message-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
              />
              <button type="submit">Enviar</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Selecciona un amigo para empezar a chatear</p>
          </div>
        )}
      </main>
    </div>
  );
};
