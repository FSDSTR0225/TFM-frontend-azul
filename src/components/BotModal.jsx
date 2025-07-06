import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import "../style/BotModal.css";

const BotModal = ({ onClose }) => {
  return (
    <>
      <AnimatePresence>
        <Motion.div
          className="chatbot-bubble"
          initial={{ opacity: 0, scale: 0.8, y: 20 }} // el estado inicial de la animación sera opacidad 0, escala 0.8 y desplazamiento vertical de 20px
          animate={{ opacity: 1, scale: 1, y: 0 }} // el estado final de la animación sera opacidad 1, escala 1 y desplazamiento vertical de 0px
          exit={{ opacity: 0, scale: 0.8, y: 20 }} // el estado de salida de la animación sera opacidad 0, escala 0.8 y desplazamiento vertical de 20px
          transition={{ duration: 0.7 }} // la duración de la animación sera de 0.3 segundos
        >
          <div className="bubble-content">
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

            <div className="bot-chat">
              <p className="chat-window">¡Hola! ¿En qué puedo ayudarte?</p>
              <input type="text" placeholder="¿En qué puedo ayudarte?" />
            </div>
            <button className="bot-btn">¡Preguntame!</button>
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

{
  /* <div className="chatbot-modal-overlay">
       <div className="chatbot-modal">
         <button className="close-btn" onClick={onClose}>
           ✖
         </button>
         <h2>Asistente IA</h2>
         <div className="chat-window">
           <p>¡Hola! ¿En qué puedo ayudarte?</p>
          
         </div>
         <input type="text" placeholder="Escribe tu duda..." />
       </div>
     </div> */
}
