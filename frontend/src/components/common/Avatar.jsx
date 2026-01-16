import React from 'react';
import './Avatar.css';

/**
 * Avatar component - displays user avatar or initials
 */
const Avatar = ({ src, name, size = 'md' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  const sizeClass = `avatar--${size}`;

  if (src) {
    return (
      <div className={`avatar ${sizeClass}`}>
        <img src={src} alt={name || 'Avatar'} className="avatar__image" />
      </div>
    );
  }

  return (
    <div className={`avatar avatar--initials ${sizeClass}`}>
      <span className="avatar__initials">{getInitials(name)}</span>
    </div>
  );
};

export default Avatar;