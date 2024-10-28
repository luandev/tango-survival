import React from 'react';
import './Modal.css';

const Modal = ({ 
  message, 
  showOk = true, 
  showCancel = false, 
  showCheckbox = false, 
  isChecked = false, 
  onOk, 
  onCancel, 
  onPersistentStorage 
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <p className="modal-message">{message}</p>
      {showCheckbox && (
        <label className="modal-checkbox">
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={onPersistentStorage} 
          />
          Don't show this anymore
        </label>
      )}
      <div className="modal-buttons">
        {showOk && <button onClick={onOk}>OK</button>}
        {showCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  </div>
);

export default Modal;
