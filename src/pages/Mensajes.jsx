import { useEffect, useState, useContext } from "react";
import { socket } from "../socket"; // Usamos el socket global correctamente
import AuthContext from "../context/AuthContext";
import "../style/Mensajes.css";

const API_URL = import.meta.env.VITE_API_URL;

const Mensajes = () => {
  const { token, user } = useContext(AuthContext);

  const [message, setMessage] = useState(""); // lo que escribes
  const [messages, setMessages] = useState([]); // historial del chat activo
  const [allFriends, setAllFriends] = useState([]); // todos los amigos
  const [selectedFriend, setSelectedFriend] = useState(null); // amigo actual seleccionado

  // 1. Escuchar mensajes nuevos (cuando cambia el amigo)
  useEffect(() => {
    if (!selectedFriend || !socket) return;

    const handleIncomingMessage = (message) => {
      console.log("Mensaje recibido en tiempo real:", message);

      const senderId = message.sender?._id || message.sender;
      if (senderId === selectedFriend?._id || senderId === selectedFriend?.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("private message", handleIncomingMessage);

    return () => {
      socket.off("private message", handleIncomingMessage);
    };
  }, [selectedFriend]);

  // 2. Obtener todos los amigos (online y offline)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data.friends) ? data.friends : [];
        setAllFriends(list);
      } catch (err) {
        console.error("Error al cargar amigos:", err);
        setAllFriends([]);
      }
    };

    fetchFriends();
  }, [token]);

  // 3. Seleccionar amigo y cargar historial
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
      senderId: user._id,
      receiverId: selectedFriend.id,
      timestamp,
    };

    console.log("Enviando mensaje:", msgPayload);
    socket.emit("private message", msgPayload);

    setMessages((prev) => [...prev, { ...msgPayload, senderId: user._id }]);
    setMessage("");
  };

  // Ordenar amigos: online primero
  const sortedFriends = [...allFriends].sort((a, b) => {
    return (b.onlineStatus === true) - (a.onlineStatus === true);
  });

  const friendsList = sortedFriends.map((f) => ({
    id: f.id ?? f._id,
    username: f.username,
    avatarUrl: f.avatarUrl,
    onlineStatus: f.onlineStatus,
  }));

  return (
    <div className="chat-page">
      <aside className="friends-sidebar">
        <h2>Amigos</h2>
        <ul className="friends-list-chat">
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
              <span
                className={`status-friends ${
                  friend.onlineStatus ? "online" : "offline"
                }`}
              />
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
              {messages.map((msg, index) => {
                const isMine =
                  msg.senderId === user.id || msg.sender?._id === user.id;

                return (
                  <div
                    key={index}
                    className={`message ${isMine ? "own" : "friend"}`}
                  >
                    <span className="message-text">{msg.content}</span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
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

export default Mensajes;
