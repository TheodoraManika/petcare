import React from 'react';
import './Navigation.css';
import assets from '../assets';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={assets.petcareIcon} alt="PetCare" className="brand-icon" />
          <span className="brand-text">PetCare</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-button">
            <img src={assets.homeIcon} alt="Home" className="nav-icon" />
            Αρχική
          </button>
          <button className="nav-button">
            <img src={assets.lostPetsIcon} alt="Lost Pets" className="nav-icon" />
            Χαμένα Κατοικίδια
          </button>
          <button className="nav-button">
            <img src={assets.reportFoundIcon} alt="Report Found" className="nav-icon" />
            Δήλωση Εύρεσης
          </button>
          <button className="nav-button">
            <img src={assets.vetsIcon} alt="Vets" className="nav-icon" />
            Κτηνίατροι
          </button>
          <button className="nav-button">
            <img src={assets.infoIcon} alt="Info" className="nav-icon" />
            Πληροφορίες
          </button>
          <div className="nav-divider"></div>
          <button className="nav-button login-btn">
            <img src={assets.loginIcon} alt="Login" className="nav-icon" />
            Σύνδεση
          </button>
          <button className="nav-button register-btn">
            <img src={assets.registerIcon} alt="Register" className="nav-icon" />
            Εγγραφή
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
