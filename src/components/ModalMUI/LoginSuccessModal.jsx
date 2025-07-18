import React, { useEffect } from "react";
import "./LoginSuccessModal.css";

function LoginSuccessModal({ show, onClose, isSuccess, modalText }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="login-success-modal-overlay">
      <div className={`login-success-modal ${isSuccess ? "success" : "fail"}`}>
        <div className="modal-icon">{isSuccess ? "✅" : "❌"}</div>
        <div className="modal-title">
          {isSuccess ? "¡Sesión iniciada!" : "Error al iniciar sesión"}
        </div>
        <div className="modal-desc">
          {isSuccess ? modalText.success : modalText.fail}
        </div>
      </div>
    </div>
  );
}

export default LoginSuccessModal;
