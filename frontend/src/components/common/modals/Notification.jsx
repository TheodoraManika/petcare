import React from 'react';
import './Notification.css';

const Notification = ({ 
  isVisible, 
  message, 
  type = 'success' // 'success' or 'error'
}) => {
  if (!isVisible) return null;

  return (
    <div className={`notification notification--${type}`}>
      {message}
    </div>
  );
};

export default Notification;
