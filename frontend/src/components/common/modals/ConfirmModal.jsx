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
  isDanger = false,
  variant = 'default' // 'default', 'blue'
}) => {
  if (!isOpen) return null;

  // Determine button class based on isDanger or variant
  let confirmButtonClass = 'confirm-modal-btn';
  if (isDanger) {
    confirmButtonClass += ' confirm-modal-btn--danger';
  } else if (variant === 'blue') {
    confirmButtonClass += ' confirm-modal-btn--blue';
  } else {
    confirmButtonClass += ' confirm-modal-btn--confirm';
  }

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
            className={confirmButtonClass}
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
