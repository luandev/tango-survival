import React from 'react';
import ReactMarkdown from 'react-markdown';
//TESTCSS import './Modal.css';

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
      <ReactMarkdown className="modal-message">{message}</ReactMarkdown>
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
