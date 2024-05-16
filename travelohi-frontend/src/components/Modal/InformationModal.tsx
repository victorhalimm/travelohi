import React from "react";
import "./components.module.scss";
import Success from '../../assets/check.png';
import Error from '../../assets/cross.png';

interface InformationModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
  success: boolean;
}

const InformationModal: React.FC<InformationModalProps> = ({ show, onClose, message, success }) => {
  if (!show) return null;

  const imageSrc = success ? Success : Error;
  const modalClass = success ? "modal-content success" : "modal-content error";

  return (
    <div className="modal-overlay">
      <div className={modalClass}>
        <div className="flex justify-end">
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <img src={imageSrc} alt={success ? "Success" : "Error"} className="modal-image" />
        <p className="modal-message">{message}</p>
      </div>
    </div>
  );
};

export default InformationModal;
