import React from 'react';
import './Features.css';
import assets from '../assets';

const Features = () => {
  const features = [
    {
      id: 1,
      title: 'Ψηφιακό Βιβλιάριο',
      description: 'Διατήρηση πλήρους ιστορικού υγείας του κατοικιδίου σας',
      icon: assets.bookletIcon
    },
    {
      id: 2,
      title: 'Εύρεση Κτηνιάτρων',
      description: 'Αναζήτηση επαγγελματιών με βάση την περιοχή και την ειδικότητα',
      icon: assets.findVetIcon
    },
    {
      id: 3,
      title: 'Διαχείριση Ραντεβού',
      description: 'Online κλείσιμο και παρακολούθηση ραντεβού',
      icon: assets.appointmentIcon
    }
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Βασικές Λειτουργίες</h2>
      
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-item">
            <div className="feature-icon">
              <img src={feature.icon} alt={feature.title} className="feature-img" />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
