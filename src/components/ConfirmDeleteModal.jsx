import React from "react";
import "../style/ConfirmDeleteModal.css";

function ConfirmDeleteModal({ onCancel, onConfirm, eventTitle }) {
  return (
    <div
      className="modal-overlay-events"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay-events")) {
          onCancel();
        }
      }}
    >
      <div className="confirm-modal">
        <h3>¿Eliminar evento?</h3>
        <p>¿Estas seguro que quieres eliminar el evento "{eventTitle}" ?</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Sí, eliminar
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
