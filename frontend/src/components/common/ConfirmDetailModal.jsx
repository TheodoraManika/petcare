import React from 'react';
import './ConfirmDetailModal.css';

const ConfirmDetailModal = ({ 
  isOpen,
  title = 'Επιβεβαίωση Καταγραφής',
  subtitle = 'Παρακαλώ ελέγξτε τα στοιχεία της καταγραφής:',
  fields = [],
  cancelText = 'Επιστροφή',
  confirmText = 'Επιβεβαίωση',
  onCancel,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-detail-modal-overlay">
      <div className="confirm-detail-modal-content">
        <h2 className="confirm-detail-modal-title">{title}</h2>
        <p className="confirm-detail-modal-subtitle">{subtitle}</p>
        
        <div className="confirm-detail-modal-fields">
          {fields.map((field, index) => (
            <div key={index} className="confirm-detail-modal-field">
              <label className="confirm-detail-modal-field-label">{field.label}:</label>
              <div className="confirm-detail-modal-field-value">
                {field.value || '-'}
              </div>
            </div>
          ))}
        </div>

        <div className="confirm-detail-modal-actions">
          <button 
            className="confirm-detail-modal-btn confirm-detail-modal-btn--cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-detail-modal-btn confirm-detail-modal-btn--confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDetailModal;
