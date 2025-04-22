import React from "react";
import "../style/BotSection.css";

function BotSection() {
  return (
    <section className="bot-card">
      <div className="bot-header">
        <span className="bot-icon">BOT ICON</span>
        <h3>Asistente IA Gamer</h3>
      </div>

      <div className="bot-chat">
        <p className="chat-question">¿Cómo consigo el platino en Skyrim?</p>
        <p className="chat-answer">
          Para conseguir el platino en Skyrim tienes que...
        </p>
      </div>
      <button className="bot-btn">¡Preguntame!</button>
    </section>
  );
}

export default BotSection;
