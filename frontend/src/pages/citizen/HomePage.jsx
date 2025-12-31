import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Calendar, PawPrint, Stethoscope, Users } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import NavbarPublic from '../../components/global/layout/NavbarPublic';
import Footer from '../../components/global/layout/Footer';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'digital-record',
      icon: <FileText size={32} />,
      title: 'Ψηφιακό Βιβλιάριο',
      description: 'Διατήρηση πλήρους ιστορικού υγείας του κατοικιδίου σας',
    },
    {
      id: 'find-vets',
      icon: <Search size={32} />,
      title: 'Εύρεση Κτηνιάτρων',
      description: 'Αναζήτηση επαγγελματιών με βάση την περιοχή και την ειδικότητα',
    },
    {
      id: 'manage-appointments',
      icon: <Calendar size={32} />,
      title: 'Διαχείριση Ραντεβού',
      description: 'Online κλείσιμο και παρακολούθηση ραντεβού',
    },
  ];

  const userTypes = [
    {
      id: 'pet-owners',
      title: 'Ιδιοκτήτες Κατοικιδίων',
      color: 'cyan',
      icon: <PawPrint size={24} />,
      features: [
        'Βιβλιάριο υγείας κατοικιδίου',
        'Δήλωση απώλειας/εύρεσης κατοικιδίου',
        'Αναζήτηση κτηνιάτρων',
        'Προγραμματισμός ραντεβού',
      ],
      buttonText: 'Περισσότερα',
      buttonAction: () => navigate('/owner/dashboard'),
    },
    {
      id: 'vets',
      title: 'Κτηνίατροι',
      color: 'orange',
      icon: <Stethoscope size={24} />,
      features: [
        'Καταγραφή κατοικιδίων',
        'Ιατρικές πράξεις',
        'Διαχείριση ραντεβού',
        'Προβολή αξιολογήσεων',
      ],
      buttonText: 'Περισσότερα',
      buttonAction: () => navigate('/vet/dashboard'),
    },
    {
      id: 'citizens',
      title: 'Πολίτες',
      color: 'yellow',
      icon: <Users size={24} />,
      features: [
        'Αναζήτηση χαμένων κατοικιδίων',
        'Δήλωση εύρεσης κατοικιδίου',
      ],
      buttonText: 'Περισσότερα',
      buttonAction: () => navigate('/citizen/dashboard'),
    },
  ];

  return (
    <div className="home-page">
      {/* Navigation - Using public navbar for non-authenticated users */}
      <NavbarPublic />

      {/* Main Content */}
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Πλατφόρμα Διαχείρισης Κατοικιδίων</h1>
            <p className="hero-description">
              Ολοκληρωμένη πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων σας, την αναζήτηση επαγγελματιών κτηνιάτρων και την καταγραφή ιατρικών πράξεων.
            </p>
          </div>

          <div className="hero-search-box">
            <div className="search-field">
              <input
                type="text"
                placeholder="Αναζήτηση κτηνιάτρων..."
                className="search-input search-text-input"
              />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.8833 13.8834" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="search-field">
              <select className="search-input search-dropdown">
                <option value="">Περιοχή...</option>
                <option value="athens">Αθήνα</option>
                <option value="thessaloniki">Θεσσαλονίκη</option>
                <option value="patras">Πάτρα</option>
                <option value="larissa">Λάρισα</option>
              </select>
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 8.33335C16.6667 12.4942 12.0508 16.8275 10.5008 18.1659C10.3564 18.2744 10.1807 18.3331 10 18.3331C9.81934 18.3331 9.64357 18.2744 9.49918 18.1659C7.94918 16.8275 3.33334 12.4942 3.33334 8.33335C3.33334 6.56524 4.03572 4.86955 5.28596 3.61931C6.53621 2.36907 8.2319 1.66669 10 1.66669C11.7681 1.66669 13.4638 2.36907 14.7141 3.61931C15.9643 4.86955 16.6667 6.56524 16.6667 8.33335Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10.8333C11.3807 10.8333 12.5 9.71402 12.5 8.33331C12.5 6.9526 11.3807 5.83331 10 5.83331C8.61929 5.83331 7.5 6.9526 7.5 8.33331C7.5 9.71402 8.61929 10.8333 10 10.8333Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="search-field">
              <select className="search-input search-dropdown">
                <option value="">Διαθεσιμότητα...</option>
                <option value="today">Σήμερα</option>
                <option value="tomorrow">Αύριο</option>
                <option value="week">Αυτή την εβδομάδα</option>
                <option value="month">Αυτό το μήνα</option>
              </select>
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.33331 1.33331V3.99998" stroke="#6A7282" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6667 1.33331V3.99998" stroke="#6A7282" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.6667 2.66669H3.33333C2.59695 2.66669 2 3.26364 2 4.00002V13.3334C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3334V4.00002C14 3.26364 13.403 2.66669 12.6667 2.66669Z" stroke="#6A7282" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 6.66669H14" stroke="#6A7282" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="search-field">
              <select className="search-input search-dropdown">
                <option value="">Ειδικότητα...</option>
                <option value="general">Γενικός Ιατρός</option>
                <option value="surgery">Χειρουργός</option>
                <option value="dentistry">Οδοντολόγος</option>
                <option value="dermatology">Δερματολόγος</option>
              </select>
              <div className="search-buttons">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13.3334 16.6667V3.33335C13.3334 2.89133 13.1578 2.4674 12.8452 2.15484C12.5326 1.84228 12.1087 1.66669 11.6667 1.66669H8.33335C7.89133 1.66669 7.4674 1.84228 7.15484 2.15484C6.84228 2.4674 6.66669 2.89133 6.66669 3.33335V16.6667" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.6667 5H3.33335C2.41288 5 1.66669 5.74619 1.66669 6.66667V15C1.66669 15.9205 2.41288 16.6667 3.33335 16.6667H16.6667C17.5872 16.6667 18.3334 15.9205 18.3334 15V6.66667C18.3334 5.74619 17.5872 5 16.6667 5Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#99A1AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <button className="search-button">Αναζήτηση</button>
          </div>

          <div className="hero-actions">
            <button className="action-button owner-btn">
              <Users size={20} />
              <span>Εγγραφή Ιδιοκτήτη</span>
            </button>
            <button className="action-button vet-btn">
              <Stethoscope size={20} />
              <span>Εγγραφή Κτηνιάτρου</span>
            </button>
            <button 
              className="action-button lost-btn"
              onClick={() => navigate(ROUTES.vet.foundPetForm)}
            >
              <Search size={20} />
              <span>Δήλωση Εύρεσης</span>
            </button>
          </div>
        </section>

        {/* User Types Section */}
        <section className="user-types-section">
          {userTypes.map((userType) => (
            <div key={userType.id} className={`user-type-card ${userType.color}-card`}>
              <div className={`card-icon ${userType.color}-icon`}>
                  {userType.icon}
              </div>
              <h3 className="card-title">{userType.title}</h3>
              <ul className="card-features">
                {userType.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className={`feature-dot ${userType.color}-dot`}></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`card-button ${userType.color}-button`}
                onClick={userType.buttonAction}
              >
                {userType.buttonText}
              </button>
            </div>
          ))}
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-wrapper">
            <h2 className="features-section-title">Βασικές Λειτουργίες</h2>
            <div className="features-container">
              <div className="feature-item">
                <div className="feature-icon">
                  <FileText size={40} />
                </div>
                <h3 className="feature-title">Ψηφιακό Βιβλιάριο</h3>
                <p className="feature-description">
                  Διατήρηση πλήρους ιστορικού υγείας του κατοικιδίου σας
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Search size={40} />
                </div>
                <h3 className="feature-title">Εύρεση Κτηνιάτρων</h3>
                <p className="feature-description">
                  Αναζήτηση επαγγελματιών με βάση την περιοχή και την ειδικότητα
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <Calendar size={40} />
                </div>
                <h3 className="feature-title">Διαχείριση Ραντεβού</h3>
                <p className="feature-description">
                  Online κλείσιμο και παρακολούθηση ραντεβού
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer - Using existing Footer component */}
      <Footer />
    </div>
  );
};

export default HomePage;
