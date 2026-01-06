import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Calendar, PawPrint, Stethoscope, Users, ChevronDown } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/global/ui/CustomSelect';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

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
    <PageLayout title="Αρχική" showBreadcrumbs={false}>
      <div className="home-page">
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
                <rect x="0" y="0" width="20" height="20" fill="white"/>
                <path d="M17.5 17.5L13.8833 13.8834" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="search-field">
              <CustomSelect
                value={selectedArea}
                onChange={setSelectedArea}
                placeholder="Περιοχή..."
                options={[
                  { value: 'athens', label: 'Αθήνα' },
                  { value: 'thessaloniki', label: 'Θεσσαλονίκη' },
                  { value: 'patras', label: 'Πάτρα' },
                  { value: 'larissa', label: 'Λάρισα' },
                ]}
              />
            </div>
            <div className="search-field">
              <CustomSelect
                value={selectedAvailability}
                onChange={setSelectedAvailability}
                placeholder="Διαθεσιμότητα..."
                options={[
                  { value: 'today', label: 'Σήμερα' },
                  { value: 'tomorrow', label: 'Αύριο' },
                  { value: 'week', label: 'Αυτή την εβδομάδα' },
                  { value: 'month', label: 'Αυτό το μήνα' },
                ]}
              />
            </div>
            <div className="search-field">
              <CustomSelect
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                placeholder="Ειδικότητα..."
                options={[
                  { value: 'general', label: 'Γενικός Ιατρός' },
                  { value: 'surgery', label: 'Χειρουργός' },
                  { value: 'dentistry', label: 'Οδοντολόγος' },
                  { value: 'dermatology', label: 'Δερματολόγος' },
                ]}
              />
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

      </div>
    </PageLayout>
  );
};

export default HomePage;
