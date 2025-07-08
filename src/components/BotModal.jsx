import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { motion as Motion, AnimatePresence } from "framer-motion";
import "../style/BotModal.css";

const API_URL = import.meta.env.VITE_API_URL;

const BotModal = ({ onClose }) => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useContext(AuthContext);

  const askBot = async () => {
    if (inputValue.trim() === "") return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
      } else {
        setResponse("Lo siento, no pude entender tu pregunta.");
      }
    } catch (error) {
      console.error("Error al contactar con el asistente IA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <Motion.div
          className="chatbot-container"
          initial={{ opacity: 0, scale: 0.8, y: 20 }} // el estado inicial de la animación sera opacidad 0, escala 0.8 y desplazamiento vertical de 20px
          animate={{ opacity: 1, scale: 1, y: 0 }} // el estado final de la animación sera opacidad 1, escala 1 y desplazamiento vertical de 0px
          exit={{ opacity: 0, scale: 0.8, y: 20 }} // el estado de salida de la animación sera opacidad 0, escala 0.8 y desplazamiento vertical de 20px
          transition={{ duration: 0.7 }} // la duración de la animación sera de 0.3 segundos
        >
          <div className="bot-card-content">
            {/* <section className="bot-glass-section"> */}
            {/* <div className="bot-card"> */}
            <div className="bot-header">
              <div className="bot-icon">
                <img
                  src="/images/789.png"
                  alt="Bot Icon"
                  className="bot-image"
                />
              </div>

              <h3>Asistente IA Gamer</h3>
            </div>

            <button className="close-btn-ia" onClick={onClose}>
              ✖
            </button>
            {!response && (
              <p className="chat-window">¡Hola! ¿En qué puedo ayudarte?</p>
            )}

            <div className="bot-chat-question">
              {response && <p className="chat-response">{response}</p>}
              <input
                type="text"
                placeholder="¿En qué puedo ayudarte?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button className="bot-btn" onClick={askBot} disabled={loading}>
              {loading ? "Buscando info..." : "¡Preguntame!"}
            </button>
          </div>
          {/* </section> */}
          {/* </div> */}
          <div className="bubble-tail" />
        </Motion.div>
      </AnimatePresence>
    </>
  );
};

export default BotModal;
