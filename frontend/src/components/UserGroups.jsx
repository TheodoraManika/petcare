import React from 'react';
import './UserGroups.css';
import assets from '../assets';

const UserGroups = () => {
  const groups = [
    {
      id: 'owners',
      title: 'Ιδιοκτήτες Κατοικιδίων',
      icon: assets.ownersIcon,
      color: '#23ced9',
      features: [
        'Βιβλιάριο υγείας κατοικιδίου',
        'Δήλωση απώλειας/εύρεσης κατοικιδίου',
        'Αναζήτηση κτηνιάτρων',
        'Προγραμματισμός ραντεβού'
      ]
    },
    {
      id: 'vets',
      title: 'Κτηνίατροι',
      icon: assets.vetsGroupIcon,
      color: '#fca47c',
      features: [
        'Καταγραφή κατοικιδίων',
        'Ιατρικές πράξεις',
        'Διαχείριση ραντεβού',
        'Προβολή αξιολογήσεων'
      ]
    },
    {
      id: 'citizens',
      title: 'Πολίτες',
      icon: assets.citizensIcon,
      color: '#f9d779',
      features: [
        'Αναζήτηση χαμένων κατοικιδίων',
        'Δήλωση εύρεσης κατοικιδίου'
      ]
    }
  ];

  return (
    <section className="user-groups">
      {groups.map((group) => (
        <div key={group.id} className="group-card" style={{ borderColor: group.color }}>
          <div className="group-icon" style={{ backgroundColor: group.color, borderColor: group.color }}>
            <img src={group.icon} alt={group.title} className="icon-image" />
          </div>
          
          <h3 className="group-title">{group.title}</h3>
          
          <ul className="features-list">
            {group.features.map((feature, idx) => (
              <li key={idx} style={{ borderColor: group.color }}>
                {feature}
              </li>
            ))}
          </ul>
          
          <button className="more-btn" style={{ backgroundColor: group.color }}>
            Περισσότερα
          </button>
        </div>
      ))}
    </section>
  );
};

export default UserGroups;
