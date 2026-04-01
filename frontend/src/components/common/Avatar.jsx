import React from 'react';
import './Avatar.css';

/**
 * Avatar component - displays user avatar or initials
 */
const Avatar = ({ src, name, lastName, size = 'md', shape = 'circle' }) => {
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    
    // If we have both firstName and lastName as separate props
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    
    // If we only have name, try to split it
    if (firstName && !lastName) {
      const parts = firstName.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return firstName.substring(0, 2).toUpperCase();
    }
    
    return '?';
  };

  const sizeClass = `avatar--${size}`;
  const shapeClass = `avatar--${shape}`;

  if (src) {
    return (
      <div className={`avatar ${sizeClass} ${shapeClass}`}>
        <img src={src} alt={name || 'Avatar'} className="avatar__image" />
      </div>
    );
  }

  return (
    <div className={`avatar avatar--initials ${sizeClass} ${shapeClass}`}>
      <span className="avatar__initials">{getInitials(name, lastName)}</span>
    </div>
  );
};

export default Avatar;