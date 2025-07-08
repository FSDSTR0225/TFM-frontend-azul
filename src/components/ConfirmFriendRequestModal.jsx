import "../style/ModalWindow.css";
import {createPortal} from "react-dom";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
export const ConfirmFriendRequestModal = ({player , isOpen, onClose, onSuccess}) => {
const { token } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
console.log(player);
  const handleAdd = async () => {
      const response = await fetch(`${API_URL}/friends/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userReceiverId: player._id,
          message: message,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al enviar la solicitud de amistad:", errorData);
        return;
      }
      const data = await response.json();
      console.log("Solicitud de amistad enviada:", data);
      onSuccess();
    
  }
if(!isOpen) return null;
  return createPortal(
    <div className="modal-overlay">
        <div className="modal-content">
        <button className="modal-close friend-modal" onClick={onClose}>X</button>
        <h2 className="modal-title">Añadir amigo</h2>
        <div className="player-avatar-container-modal">
        <img className="player-avatar-modal" src={player.avatar} alt={player.username} />
        <h3 className="player-username-modal">{player.username}</h3>
        </div>


          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="friend-msg" placeholder="Escribe un mensaje para enviar junto con tu solicitud de amistad" rows="3">
          </textarea>
    
        <button className="add-button" onClick={handleAdd}> Enviar solicitud</button>
    </div>
    </div>,
    document.getElementById("modal-root")
  )
}
