import { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext";
import "../style/Chat.css";

export const Mensajes = () => {
  const { user } = useContext(AuthContext);
  const SENDER_NAME = user.username;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // Usamos useRef para mantener una sola instancia

  useEffect(() => {
    // Conectar socket solo una vez
    socketRef.current = io("http://localhost:3000");

    // Escuchar mensajes
    socketRef.current.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Limpieza: desconectar cuando el componente se desmonta
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit("chat message", {
        text: message,
        sender: SENDER_NAME,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span className="message-time">{msg.time}</span>
            <span className="message-sender">{msg.sender}:</span>
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="send-chat-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
