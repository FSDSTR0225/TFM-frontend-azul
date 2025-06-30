import React, { useEffect } from "react";
import "./LoginSuccessModal.css";

function RegisterSuccessModal({
  show,
  onClose,
  isSuccess,
  modalText,
  errorText,
}) {
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
          {isSuccess ? "¡Te has registrado con éxito!" : errorText}
        </div>
        <div className="modal-desc">
          {isSuccess ? modalText.success : modalText.fail}
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccessModal;
