import React, { useState } from 'react';
import './Hero.css';
import assets from '../assets';

const Hero = () => {
  const [searchParams, setSearchParams] = useState({
    vet: '',
    area: '',
    availability: '',
    specialty: ''
  });

  const handleSearch = () => {
    console.log('Searching with params:', searchParams);
  };

  return (
    <section className="hero">
      <img src={assets.container} alt="Hero background" className="hero-background" />
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <h1 className="hero-title">Πλατφόρμα Διαχείρισης Κατοικιδίων</h1>
        <p className="hero-description">
          Ολοκληρωμένη πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων σας, 
          την αναζήτηση επαγγελματιών κτηνιάτρων και την καταγραφή ιατρικών πράξεων.
        </p>
      </div>

      <div className="action-buttons">
        <button className="action-btn register-owner">
          <img src={assets.ownerIcon} alt="Owner" className="action-icon" />
          Εγγραφή Ιδιοκτήτη
        </button>
        <button className="action-btn register-vet">
          <img src={assets.vetIcon} alt="Vet" className="action-icon" />
          Εγγραφή Κτηνιάτρου
        </button>
        <button className="action-btn lost-pets">
          <img src={assets.lostIcon} alt="Lost Pets" className="action-icon" />
          Χαμένα Κατοικίδια
        </button>
      </div>

      <div className="search-box">
        <div className="search-inputs">
          <div className="input-group">
            <img src={assets.searchVetIcon} alt="Search" className="input-icon" />
            <input
              type="text"
              placeholder="Αναζήτηση κτηνιάτρων..."
              value={searchParams.vet}
              onChange={(e) => setSearchParams({...searchParams, vet: e.target.value})}
              className="search-input"
            />
          </div>

          <div className="input-group">
            <img src={assets.locationIcon} alt="Location" className="input-icon" />
            <input
              type="text"
              placeholder="Περιοχή..."
              value={searchParams.area}
              onChange={(e) => setSearchParams({...searchParams, area: e.target.value})}
              className="search-input"
            />
            <img src={assets.dropdownIcon} alt="Dropdown" className="dropdown-arrow" />
          </div>

          <div className="input-group">
            <img src={assets.availabilityIcon} alt="Availability" className="input-icon" />
            <input
              type="text"
              placeholder="Διαθεσιμότητα..."
              value={searchParams.availability}
              onChange={(e) => setSearchParams({...searchParams, availability: e.target.value})}
              className="search-input"
            />
            <img src={assets.dropdownIcon} alt="Dropdown" className="dropdown-arrow" />
          </div>

          <div className="input-group">
            <img src={assets.specialtyIcon} alt="Specialty" className="input-icon" />
            <input
              type="text"
              placeholder="Ειδικότητα..."
              value={searchParams.specialty}
              onChange={(e) => setSearchParams({...searchParams, specialty: e.target.value})}
              className="search-input"
            />
            <img src={assets.dropdownIcon} alt="Dropdown" className="dropdown-arrow" />
          </div>

          <button className="search-button" onClick={handleSearch}>
            Αναζήτηση
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
