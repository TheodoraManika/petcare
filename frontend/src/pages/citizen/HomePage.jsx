import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Search, Calendar, PawPrint, ChevronDown, MapPin, ChevronLeft, ChevronRight, Dog, Cat, Star, Info, LogIn, UserPlus, Stethoscope } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import Notification from '../../components/common/modals/Notification';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedArea, setSelectedArea] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [notification, setNotification] = useState(null);

  // Check for notification from navigation state
  useEffect(() => {
    if (location.state?.notification) {
      setNotification(location.state.notification);

      // Clear the notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      // Clear navigation state
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock lost pets data for carousel
  const lostPets = [
    {
      id: 1,
      name: 'Μπάμπης',
      type: 'Σκύλος',
      breed: 'Golden Retriever',
      area: 'Κέντρο Αθήνας',
      dateLost: '05/01/2026',
    },
    {
      id: 2,
      name: 'Φιφή',
      type: 'Γάτα',
      breed: 'Περσική',
      area: 'Θεσσαλονίκη',
      dateLost: '03/01/2026',
    },
    {
      id: 3,
      name: 'Ρεξ',
      type: 'Σκύλος',
      breed: 'Λαμπραντόρ',
      area: 'Πάτρα',
      dateLost: '01/01/2026',
    },
    {
      id: 4,
      name: 'Λούλου',
      type: 'Γάτα',
      breed: 'Σιαμέζα',
      area: 'Ηράκλειο',
      dateLost: '28/12/2025',
    },
    {
      id: 5,
      name: 'Μάικι',
      type: 'Σκύλος',
      breed: 'Μπίγκλ',
      area: 'Λάρισα',
      dateLost: '25/12/2025',
    },
  ];

  // Mock top-rated vets data (expanded)
  const topVets = [
    { id: 1, name: 'Δρ. Παπαδόπουλος', specialty: 'Γενικός Κτηνίατρος', initials: 'ΔΠ', area: 'Αθήνα, Ψυχικό', rating: 5.0, reviews: 127 },
    { id: 2, name: 'Δρ. Κωνσταντίνου', specialty: 'Ειδικός Γατών', initials: 'ΜΚ', area: 'Θεσσαλονίκη, Πανόραμα', rating: 4.9, reviews: 98 },
    { id: 3, name: 'Δρ. Σωτηρίου', specialty: 'Χειρουργός', initials: 'ΑΣ', area: 'Πάτρα, Κέντρο', rating: 4.8, reviews: 156 },
    {
      id: 4,
      name: 'Δρ. Νικολάου',
      specialty: 'Οδοντίατρος Ζώων',
      initials: 'ΝΚ',
      area: 'Αθήνα, Κολωνάκι',
      rating: 4.7,
      reviews: 64,
    },
    {
      id: 5,
      name: 'Δρ. Μαρίνα',
      specialty: 'Δερματολόγος',
      initials: 'ΜΡ',
      area: 'Θεσσαλονίκη',
      rating: 4.6,
      reviews: 88,
    },
    {
      id: 6,
      name: 'Δρ. Ηλίας',
      specialty: 'Ειδικός Μικρών Ζώων',
      initials: 'ΗΛ',
      area: 'Πάτρα',
      rating: 4.5,
      reviews: 42,
    },
    {
      id: 7,
      name: 'Δρ. Στέλλα',
      specialty: 'Γενικός Κτηνίατρος',
      initials: 'ΣΤ',
      area: 'Ηράκλειο',
      rating: 4.4,
      reviews: 51,
    },
    {
      id: 8,
      name: 'Δρ. Γιώργος',
      specialty: 'Χειρουργός',
      initials: 'ΓΡ',
      area: 'Λάρισα',
      rating: 4.3,
      reviews: 37,
    },
    {
      id: 9,
      name: 'Δρ. Ελένη',
      specialty: 'Ειδικός Γατών',
      initials: 'ΕΛ',
      area: 'Ρέθυμνο',
      rating: 4.2,
      reviews: 22,
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % lostPets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [lostPets.length]);

  // Vets carousel state and helpers (3 cards per slide)
  const [currentVetSlide, setCurrentVetSlide] = useState(0);
  const vetsPerSlide = 3;
  const vetSlides = [];
  for (let i = 0; i < topVets.length; i += vetsPerSlide) {
    vetSlides.push(topVets.slice(i, i + vetsPerSlide));
  }

  const nextVetSlide = useCallback(() => {
    setCurrentVetSlide((prev) => (prev + 1) % Math.max(1, vetSlides.length));
  }, [vetSlides.length]);

  const prevVetSlide = useCallback(() => {
    setCurrentVetSlide((prev) => (prev - 1 + Math.max(1, vetSlides.length)) % Math.max(1, vetSlides.length));
  }, [vetSlides.length]);

  const goToVetSlide = (index) => {
    setCurrentVetSlide(index);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % lostPets.length);
  }, [lostPets.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + lostPets.length) % lostPets.length);
  }, [lostPets.length]);
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // vets displayed as cards; no carousel handlers required

  // Handle vet click
  const handleVetClick = (vet) => {
    navigate(`/citizen/vet/${vet.id}`);
  };

  // Handle hero "Δήλωση Εύρεσης" button
  const handleHeroFoundClick = () => {
    navigate(ROUTES.citizen.lostPets, { state: { openFoundForm: true } });
  };

  const handleReportQuick = () => {
    // navigate to found pet form (quick report)
    navigate(ROUTES.citizen.lostPets, { state: { openFoundForm: true } });
  };

  const handleReportWithMicrochip = () => {
    // navigate to found pet form (with microchip option)
    navigate(ROUTES.citizen.lostPets, { state: { openFoundForm: true } });
  };

  // Navigate to lost pets page with pet details
  const handlePetClick = (pet) => {
    navigate(ROUTES.citizen.lostPets);
  };

  // Handle "Found It" click from carousel
  const handleFoundPetClick = (pet) => {
    navigate(ROUTES.citizen.lostPets, {
      state: {
        openFoundForm: true,
        petDetails: {
          petName: pet.name,
          species: pet.type,
          breed: pet.breed,
          foundLocation: pet.area,
          dateReported: pet.dateLost,
          description: `Βρέθηκε στην περιοχή ${pet.area}`, // Optional description
        }
      }
    });
  };

  const handleLocationSelect = (location) => {
    setLocationData(location);
  };

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
  ];

  return (
    <PageLayout title="Αρχική" showBreadcrumbs={false}>
      <div className="home-page">
        {/* Lost Pets Hero Section */}
        <section className="lost-pets-hero">
          <div className="lost-pets-hero__container">
            {/* Left Side - Carousel */}
            <div className="lost-pets-hero__carousel">
              <div className="carousel-header">
                <span>Πρόσφατα Χαμένα Κατοικίδια</span>
              </div>

              <div className="carousel-wrapper">
                <button
                  className="carousel-nav carousel-nav--prev"
                  onClick={prevSlide}
                  aria-label="Προηγούμενο"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="carousel-track">
                  {lostPets.map((pet, index) => (
                    <div
                      key={pet.id}
                      className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                      style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                    >
                      <div className="carousel-card" onClick={() => handlePetClick(pet)}>
                        <div className="carousel-card__image">
                          {pet.type === 'Σκύλος' ? (
                            <Dog size={56} color="#23CED9" />
                          ) : (
                            <Cat size={56} color="#23CED9" />
                          )}
                        </div>
                        <div className="carousel-card__info">
                          <h3 className="carousel-card__name">{pet.name}</h3>
                          <p className="carousel-card__breed">{pet.type} • {pet.breed}</p>
                          <div className="carousel-card__location">
                            <MapPin size={14} />
                            <span>{pet.area}</span>
                          </div>
                          <span className="carousel-card__date">Χάθηκε: {pet.dateLost}</span>
                          <span
                            className="carousel-card__cta"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFoundPetClick(pet);
                            }}
                          >
                            Το βρήκα
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-nav carousel-nav--next"
                  onClick={nextSlide}
                  aria-label="Επόμενο"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {lostPets.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Μετάβαση στο slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Hero Text */}
            <div className="lost-pets-hero__text">
              <h1 className="hero-title">Πλατφόρμα Διαχείρισης Κατοικιδίων</h1>
              <p className="hero-description">
                Ολοκληρωμένη πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων σας, την αναζήτηση επαγγελματιών κτηνιάτρων και την καταγραφή ιατρικών πράξεων.
              </p>
            </div>
          </div>
        </section>

        {/* Found Pet Actions - moved below hero */}
        <section className="found-actions-section">
          <div className="found-actions-container">
            <div className="found-actions-text">
              <h2 className="hero-search-title">Βρήκατε κάποιο ζωάκι;</h2>
              <p className="hero-search-subtitle">Βοηθήστε να επιστρέψει στην οικογένειά του</p>
            </div>
            <div className="found-actions-buttons">
              <button className="found-action-btn primary-btn" onClick={handleReportQuick}>
                Δήλωση Εύρεσης Kατοικιδίου
              </button>
            </div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="user-types-section">
          <div className="user-types-container">
            {userTypes.map((userType) => (
              <div key={userType.id} className={`user-type-card ${userType.color}-card`}>
                <button
                  className="card-info-btn"
                  onClick={() => navigate(userType.id === 'pet-owners' ? '/owner/information' : '/vet/information')}
                  aria-label="Πληροφορίες"
                >
                  <Info size={18} />
                </button>
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
                <div className="card-auth-buttons">
                  <button
                    className={`card-auth-btn card-auth-btn--signin ${userType.color}-signin`}
                    onClick={() => navigate(ROUTES.login)}
                  >
                    <LogIn size={16} />
                    Σύνδεση
                  </button>
                  <button
                    className={`card-auth-btn card-auth-btn--signup ${userType.color}-signup`}
                    onClick={() => navigate(userType.id === 'pet-owners' ? ROUTES.owner.register : ROUTES.vet.register)}
                  >
                    <UserPlus size={16} />
                    Εγγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Top Rated Vets Section */}
        <section className="vet-section">
          <div className="hero-search-box">
            <div className="search-field">
              <input
                type="text"
                placeholder="Αναζήτηση κτηνιάτρων..."
                className="search-input search-text-input"
              />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="0" y="0" width="20" height="20" fill="white" />
                <path d="M17.5 17.5L13.8833 13.8834" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#99A1AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="search-field">
              <LocationPicker
                value={selectedArea}
                onChange={setSelectedArea}
                onSelect={handleLocationSelect}
                placeholder="Περιοχή..."
                variant="citizen"
              />
            </div>
            <div className="search-field">
              <Calendar className="field-icon" size={20} />
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
              <Stethoscope className="field-icon" size={20} />
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
            <button
              className="search-button"
              onClick={() => navigate(ROUTES.citizen.searchMap)}
            >
              Αναζήτηση Κτηνιάτρων
            </button>
          </div>
          <div className="vets-section__title">
            <h2>Κορυφαίοι Κτηνίατροι</h2>
          </div>
          <div className="vet-section__carousel">
            <div className="vet-carousel-wrapper">
              <button
                className="vet-carousel-nav vet-carousel-nav--prev"
                onClick={prevVetSlide}
                aria-label="Προηγούμενος"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="vet-carousel-track">
                {vetSlides.map((slide, sIdx) => (
                  <div key={sIdx} className={`vet-carousel-slide ${sIdx === currentVetSlide ? 'active' : ''}`}>
                    <div className="vet-carousel-slide-inner">
                      {slide.map((vet) => (
                        <div key={vet.id} className="vet-carousel-card">
                          <div className="vet-card__avatar-circle orange-icon">{vet.initials}</div>
                          <h3 className="card-title">{vet.name}</h3>
                          <p className="vet-card__specialty-text">{vet.specialty}</p>
                          <div className="vet-card__location-info">
                            <MapPin size={14} />
                            <span>{vet.area}</span>
                          </div>
                          <div className="vet-card__rating-display">
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(vet.rating) ? "#FCA47C" : "#E5D6CE"} color={i < Math.floor(vet.rating) ? "#FCA47C" : "#E5D6CE"} />
                              ))}
                            </div>
                            <span className="rating-value">{vet.rating}</span>
                            <span className="reviews-count">({vet.reviews} αξιολογήσεις)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="vet-carousel-nav vet-carousel-nav--next"
                onClick={nextVetSlide}
                aria-label="Επόμενος"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="vet-carousel-indicators">
              {topVets.map((_, idx) => (
                <button
                  key={idx}
                  className={`vet-carousel-indicator ${idx === currentVetSlide ? 'active' : ''}`}
                  onClick={() => goToVetSlide(idx)}
                />
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Notification */}
      {notification && (
        <Notification
          isVisible={true}
          message={notification.message}
          type={notification.type}
        />
      )}
    </PageLayout>
  );
};

export default HomePage;