// src/components/BotAssistant.jsx

import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import BotModal from "./BotModal";
import "../style/BotAssistant.css";
const BotAssistant = () => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <Motion.div
        className="bot-assistant"
        onClick={() => toggleModal()}
        animate={{
          y: [0, -10, 0], // Se mueve hacia arriba y abajo
          scale: [1, 1.1, 1], // Se agranda y vuelve a su tamaño original
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img src="/images/123.png" alt="Asistente IA" />
      </Motion.div>

      {open && <BotModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default BotAssistant;
