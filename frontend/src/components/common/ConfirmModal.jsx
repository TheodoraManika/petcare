import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen,
  title = 'Είστε σίγουροι;',
  description = 'Αυτή η ενέργεια δεν αναιρείται.',
  cancelText = 'Ακύρωση',
  confirmText = 'Επιβεβαίωση',
  onCancel,
  onConfirm,
  isDanger = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-description">{description}</p>
        <div className="confirm-modal-actions">
          <button 
            className="confirm-modal-btn confirm-modal-btn--cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn ${isDanger ? 'confirm-modal-btn--danger' : 'confirm-modal-btn--confirm'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
