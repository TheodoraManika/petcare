import React from 'react';
import './OwnerDashboardCard.css';

/**
 * DashboardCard component - displays a clickable card with icon, title and description
 */
export const DashboardCard = ({ title, description, icon, iconVariant = 'primary', onClick }) => {
  return (
    <button className="owner-dashboard-card" onClick={onClick}>
      <div className={`owner-dashboard-card__icon owner-dashboard-card__icon--${iconVariant}`}>
        {icon}
      </div>
      <h3 className="owner-dashboard-card__title">{title}</h3>
      <p className="owner-dashboard-card__description">{description}</p>
    </button>
  );
};

export default DashboardCard;
