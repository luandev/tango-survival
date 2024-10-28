import React from 'react';
import './Modal.css';

const Modal = ({ message, showOk = true, showCancel = false, onOk, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          {showOk && <button onClick={onOk}>OK</button>}
          {showCancel && <button onClick={onCancel}>Cancel</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
