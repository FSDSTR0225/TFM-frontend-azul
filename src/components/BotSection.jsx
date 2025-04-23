import React from "react";
import "../style/BotSection.css";

function BotSection() {
  return (
    <section className="bot-card">
      <div className="bot-header">
        <div className="bot-icon">
          <img src="/src/assets/789.png" alt="Bot Icon" className="bot-image" />
        </div>

        <h3>Asistente IA Gamer</h3>
      </div>

      <div className="bot-chat">
        <p className="chat-question">Me: ¿Cómo consigo el platino en Skyrim?</p>
        <p className="chat-answer">
          L2P: Para conseguir el platino en Skyrim tienes que...
        </p>
      </div>
      <button className="bot-btn">¡Preguntame!</button>
    </section>
  );
}

export default BotSection;
