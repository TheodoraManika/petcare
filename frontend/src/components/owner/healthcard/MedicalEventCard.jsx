import React from 'react';
import { Syringe, Stethoscope, Activity, Calendar } from 'lucide-react';
import './MedicalEventCard.css';

const MedicalEventCard = ({ event }) => {
  // Use mappedType if available (for correct icon matching), otherwise use type
  const iconType = event.mappedType || event.type;
  
  const getIcon = (type) => {
    switch (type) {
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

  const getIconClass = (type) => {
    switch (type) {
      case 'vaccination':
        return 'owner-medical-event__icon--vaccination';
      case 'surgery':
        return 'owner-medical-event__icon--surgery';
      case 'examination':
        return 'owner-medical-event__icon--examination';
      default:
        return 'owner-medical-event__icon--examination';
    }
  };

  return (
    <div className="owner-medical-event">
      <div className={`owner-medical-event__icon ${getIconClass(iconType)}`}>
        {getIcon(iconType)}
      </div>
      <div className="owner-medical-event__content">
        <div className="owner-medical-event__header">
          <h3 className="owner-medical-event__title">{event.title}</h3>
          <span className="owner-medical-event__status">{event.status}</span>
        </div>
        <p className="owner-medical-event__description">{event.description}</p>
        <div className="owner-medical-event__meta">
          <span className="owner-medical-event__date">
            <Calendar size={14} /> {event.date}
          </span>
          <span>Κτηνίατρος: {event.vet}</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalEventCard;
