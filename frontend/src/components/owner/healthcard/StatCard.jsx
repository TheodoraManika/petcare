import React from 'react';
import { Syringe, Stethoscope, Activity } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ type, label, value }) => {
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'vaccination':
        return <Syringe size={20} />;
      case 'surgery':
        return <Stethoscope size={20} />;
      case 'examination':
        return <Activity size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getIconClass = (iconType) => {
    switch (iconType) {
      case 'vaccination':
        return 'owner-stat-card__icon--vaccination';
      case 'surgery':
        return 'owner-stat-card__icon--surgery';
      case 'examination':
        return 'owner-stat-card__icon--examination';
      default:
        return '';
    }
  };

  return (
    <div className="owner-stat-card">
      <div className={`owner-stat-card__icon ${getIconClass(type)}`}>
        {getIcon(type)}
      </div>
      <div className="owner-stat-card__content">
        <span className="owner-stat-card__label">{label}</span>
        <span className="owner-stat-card__value">{value}</span>
      </div>
    </div>
  );
};

export default StatCard;
