import React from 'react';
import './OwnerDashboardCard.css';

/**
 * DashboardCard component - displays a clickable card with icon, title and description
 */
export const DashboardCard = ({ title, description, icon, iconVariant = 'primary', onClick }) => {
  return (
    <button className="dashboard-card" onClick={onClick}>
      <div className={`dashboard-card__icon dashboard-card__icon--${iconVariant}`}>
        {icon}
      </div>
      <h3 className="dashboard-card__title">{title}</h3>
      <p className="dashboard-card__description">{description}</p>
    </button>
  );
};

export default DashboardCard;
