import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Calendar, PawPrint, Stethoscope, Users, ChevronDown, MapPin, ChevronLeft, ChevronRight, Dog, Cat, Star, Info, LogIn, UserPlus } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/global/ui/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Vet carousel state
  const [currentVetSlide, setCurrentVetSlide] = useState(0);
  
  // Vet search state
  const [vetSearchArea, setVetSearchArea] = useState('');
  const [vetSearchSpecialty, setVetSearchSpecialty] = useState('');

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

  // Mock top-rated vets data
  const topVets = [
    {
      id: 1,
      name: 'Δρ. Μαρία Παπαδοπούλου',
      specialty: 'Γενική Κτηνιατρική',
      area: 'Κέντρο Αθήνας',
      rating: 4.9,
      reviews: 127,
    },
    {
      id: 2,
      name: 'Δρ. Γιώργος Νικολάου',
      specialty: 'Χειρουργική',
      area: 'Θεσσαλονίκη',
      rating: 4.8,
      reviews: 98,
    },
    {
      id: 3,
      name: 'Δρ. Ελένη Κωστοπούλου',
      specialty: 'Δερματολογία',
      area: 'Πάτρα',
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 4,
      name: 'Δρ. Κώστας Αντωνίου',
      specialty: 'Ορθοπεδική',
      area: 'Ηράκλειο',
      rating: 4.7,
      reviews: 84,
    },
    {
      id: 5,
      name: 'Δρ. Αννα Δημητρίου',
      specialty: 'Καρδιολογία',
      area: 'Λάρισα',
      rating: 4.8,
      reviews: 112,
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % lostPets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [lostPets.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % lostPets.length);
  }, [lostPets.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + lostPets.length) % lostPets.length);
  }, [lostPets.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Vet carousel navigation
  const nextVetSlide = useCallback(() => {
    setCurrentVetSlide((prev) => (prev + 1) % topVets.length);
  }, [topVets.length]);

  const prevVetSlide = useCallback(() => {
    setCurrentVetSlide((prev) => (prev - 1 + topVets.length) % topVets.length);
  }, [topVets.length]);

  const goToVetSlide = (index) => {
    setCurrentVetSlide(index);
  };

  // Handle vet search
  const handleVetSearch = () => {
    navigate(ROUTES.citizen.vetSearch);
  };

  // Handle vet click
  const handleVetClick = (vet) => {
    navigate(`/citizen/vet/${vet.id}`);
  };

  // Handle hero "Δήλωση Εύρεσης" button
  const handleHeroFoundClick = () => {
    navigate(ROUTES.citizen.foundPetForm);
  };

  // Navigate to lost pets page with pet details
  const handlePetClick = (pet) => {
    navigate(ROUTES.citizen.lostPets);
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
                <PawPrint size={20} className="carousel-header-icon" />
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
                          <span className="carousel-card__cta">Πατήστε για περισσότερα</span>
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

            {/* Right Side - Action Panel */}
            <div className="lost-pets-hero__search-panel">
              <div className="hero-search-content">
                <h2 className="hero-search-title">
                  Βρήκατε κάποιο ζωάκι;
                </h2>
                <p className="hero-search-subtitle">
                  Βοηθήστε να επιστρέψει στην οικογένειά του
                </p>
                
                {/* CTA Button */}
                <button 
                  className="hero-cta-button"
                  onClick={handleHeroFoundClick}
                >
                  <PawPrint size={20} />
                  Δήλωση Εύρεσης
                </button>
              </div>
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
                  onClick={() => navigate('/about')}
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
                    onClick={() => navigate('/login')}
                  >
                    <LogIn size={16} />
                    Σύνδεση
                  </button>
                  <button
                    className={`card-auth-btn card-auth-btn--signup ${userType.color}-signup`}
                    onClick={() => navigate('/register')}
                  >
                    <UserPlus size={16} />
                    Εγγραφή
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vet Search & Top Rated Vets Section */}
        <section className="vet-section">
          <div className="vet-section__container">
            {/* Left Side - Search Panel */}
            <div className="vet-section__search-panel">
              <div className="vet-search-content">
                <div className="vet-search-header">
                  <Stethoscope size={24} className="vet-search-icon" />
                  <h2 className="vet-search-title">Βρείτε Κτηνίατρο</h2>
                </div>
                <p className="vet-search-subtitle">
                  Αναζητήστε τον κατάλληλο επαγγελματία για το κατοικίδιό σας
                </p>
                
                <div className="vet-search-form">
                  <div className="vet-search-field">
                    <MapPin size={18} className="vet-field-icon" />
                    <select 
                      className="vet-select"
                      value={vetSearchArea}
                      onChange={(e) => setVetSearchArea(e.target.value)}
                    >
                      <option value="">Επιλέξτε περιοχή</option>
                      <option value="athens">Αθήνα</option>
                      <option value="thessaloniki">Θεσσαλονίκη</option>
                      <option value="patra">Πάτρα</option>
                      <option value="heraklion">Ηράκλειο</option>
                      <option value="larisa">Λάρισα</option>
                    </select>
                  </div>
                  
                  <div className="vet-search-field">
                    <Stethoscope size={18} className="vet-field-icon" />
                    <select 
                      className="vet-select"
                      value={vetSearchSpecialty}
                      onChange={(e) => setVetSearchSpecialty(e.target.value)}
                    >
                      <option value="">Επιλέξτε ειδικότητα</option>
                      <option value="general">Γενική Κτηνιατρική</option>
                      <option value="surgery">Χειρουργική</option>
                      <option value="dermatology">Δερματολογία</option>
                      <option value="orthopedics">Ορθοπεδική</option>
                      <option value="cardiology">Καρδιολογία</option>
                    </select>
                  </div>
                  
                  <button 
                    className="vet-search-button"
                    onClick={handleVetSearch}
                  >
                    <Search size={18} />
                    Αναζήτηση
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Top Rated Vets Carousel */}
            <div className="vet-section__carousel">
              <div className="vet-carousel-header">
                <Star size={20} className="vet-carousel-header-icon" />
                <span>Κορυφαίοι Κτηνίατροι</span>
              </div>
              
              <div className="vet-carousel-wrapper">
                <button 
                  className="vet-carousel-nav vet-carousel-nav--prev" 
                  onClick={prevVetSlide}
                  aria-label="Προηγούμενο"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="vet-carousel-track">
                  {topVets.map((vet, index) => (
                    <div 
                      key={vet.id}
                      className={`vet-carousel-slide ${index === currentVetSlide ? 'active' : ''}`}
                      style={{ transform: `translateX(${(index - currentVetSlide) * 100}%)` }}
                    >
                      <div className="vet-carousel-card" onClick={() => handleVetClick(vet)}>
                        <div className="vet-card__avatar">
                          <Stethoscope size={40} color="#FCA47C" />
                        </div>
                        <div className="vet-card__info">
                          <h3 className="vet-card__name">{vet.name}</h3>
                          <p className="vet-card__specialty">{vet.specialty}</p>
                          <div className="vet-card__location">
                            <MapPin size={14} />
                            <span>{vet.area}</span>
                          </div>
                          <div className="vet-card__rating">
                            <Star size={16} fill="#FCA47C" color="#FCA47C" />
                            <span className="vet-card__rating-value">{vet.rating}</span>
                            <span className="vet-card__reviews">({vet.reviews} αξιολογήσεις)</span>
                          </div>
                          <span className="vet-card__cta">Πατήστε για περισσότερα</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="vet-carousel-nav vet-carousel-nav--next" 
                  onClick={nextVetSlide}
                  aria-label="Επόμενο"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Vet Carousel Indicators */}
              <div className="vet-carousel-indicators">
                {topVets.map((_, index) => (
                  <button
                    key={index}
                    className={`vet-carousel-indicator ${index === currentVetSlide ? 'active' : ''}`}
                    onClick={() => goToVetSlide(index)}
                    aria-label={`Μετάβαση στο slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
};

export default HomePage;