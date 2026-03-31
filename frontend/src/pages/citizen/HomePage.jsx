import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Search, Calendar, PawPrint, ChevronDown, MapPin, ChevronLeft, ChevronRight, Dog, Cat, Star, Info, LogIn, UserPlus, Stethoscope, Bird, UserRound } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import Notification from '../../components/common/modals/Notification';
import VetProfileModal from '../../components/citizen/VetProfile';
import Avatar from '../../components/common/Avatar';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchName, setSearchName] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [notification, setNotification] = useState(null);

  // Vet Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileVet, setSelectedProfileVet] = useState(null);

  // User Type Card Expanded State
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAllFeatures = () => {
    setIsExpanded(!isExpanded);
  };

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lostPets, setLostPets] = useState([]);
  const [loadingLostPets, setLoadingLostPets] = useState(true);
  const [topVets, setTopVets] = useState([]);
  const [loadingVets, setLoadingVets] = useState(true);

  // Fetch vets from database
  useEffect(() => {
    const fetchVets = async () => {
      try {
        setLoadingVets(true);
        const response = await fetch('http://localhost:5000/users?role=vet');
        if (!response.ok) throw new Error('Failed to fetch vets');

        const vets = await response.json();
        // Transform vets data and get reviews
        const transformedVets = await Promise.all(vets.map(async (vet) => {
          try {
            // Fetch reviews for this vet
            const reviewsResponse = await fetch(`http://localhost:5000/reviews?vetId=${vet.id}`);
            const reviews = await reviewsResponse.json();
            const avgRating = reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : 0;

            return {
              id: vet.id,
              name: `${vet.name || 'Κτηνίατρος'} ${vet.lastName || ''}`.trim(),
              specialty: vet.specialty || vet.specialization || 'Γενικός Κτηνίατρος',
              initials: vet.name && vet.lastName ? `${vet.name[0]}${vet.lastName[0]}` : (vet.name ? vet.name.split(' ').map(n => n[0]).join('') : '??'),
              area: vet.clinicCity || 'Άγνωστη τοποθεσία',
              rating: parseFloat(avgRating),
              reviews: reviews.length,
              avatar: vet.avatar || null
            };
          } catch (err) {
            console.error(`Error fetching reviews for vet ${vet.id}:`, err);
            return {
              id: vet.id,
              name: `${vet.name || 'Κτηνίατρος'} ${vet.lastName || ''}`.trim(),
              specialty: vet.specialty || vet.specialization || 'Γενικός Κτηνίατρος',
              initials: vet.name && vet.lastName ? `${vet.name[0]}${vet.lastName[0]}` : (vet.name ? vet.name.split(' ').map(n => n[0]).join('') : '??'),
              area: vet.clinicCity || 'Άγνωστη τοποθεσία',
              rating: 0,
              reviews: 0,
              avatar: vet.avatar || null
            };
          }
        }));

        // Sort by rating and take top 9
        const sorted = transformedVets.sort((a, b) => b.rating - a.rating).slice(0, 9);
        setTopVets(sorted);
        setLoadingVets(false);
      } catch (error) {
        console.error('Error fetching vets:', error);
        setLoadingVets(false);
      }
    };

    fetchVets();
  }, []);

  // Fetch lost pets from database for carousel
  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        setLoadingLostPets(true);
        const response = await fetch('http://localhost:5000/pets');
        if (!response.ok) throw new Error('Failed to fetch pet alerts');

        const data = await response.json();
        // Filter only lost pets (petStatus === 1)
        const lostPetsData = data.filter(pet => pet.petStatus === 1);

        // Transform data to match carousel format
        const transformedPets = lostPetsData.map(pet => ({
          id: pet.id,
          name: pet.petName || pet.name || 'Άγνωστο',
          type: pet.type || 'Άγνωστο',
          breed: pet.breed || 'Άγνωστο',
          area: pet.lostLocation || pet.area || 'Άγνωστη τοποθεσία',
          dateLost: pet.lostDate || new Date().toLocaleDateString('el-GR'),
          imageUrl: pet.imageUrl || pet.image || '',
        }));
        setLostPets(transformedPets);
        setLoadingLostPets(false);
      } catch (error) {
        console.error('Error fetching pet alerts:', error);
        setLoadingLostPets(false);
      }
    };

    fetchLostPets();
  }, []);

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

  // Helper to get pet icon
  const getPetIcon = (type, size = 56) => {
    const species = type?.toLowerCase();
    if (species?.includes('dog') || species?.includes('σκύλος')) return <Dog size={size} color="#23CED9" />;
    if (species?.includes('cat') || species?.includes('γάτα')) return <Cat size={size} color="#23CED9" />;
    if (species?.includes('bird') || species?.includes('πτηνό')) return <Bird size={size} color="#23CED9" />;
    return <PawPrint size={size} color="#23CED9" />;
  };

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

  // Auto-advance vet carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVetSlide((prev) => (prev + 1) % vetSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [vetSlides.length]);

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

  // Handle vet click - Fetch full details and Open Modal
  const handleVetClick = async (vet) => {
    try {
      // Fetch full vet details from database
      const vetResponse = await fetch(`http://localhost:5000/users/${vet.id}`);
      if (!vetResponse.ok) throw new Error('Failed to fetch vet details');

      const fullVetData = await vetResponse.json();

      // Fetch reviews for this vet
      const reviewsResponse = await fetch(`http://localhost:5000/reviews?vetId=${vet.id}`);
      const reviews = await reviewsResponse.json();

      // Fetch owner details for each review
      const reviewsWithOwners = await Promise.all(reviews.map(async (review) => {
        try {
          const ownerResponse = await fetch(`http://localhost:5000/users/${review.ownerId}`);
          const owner = await ownerResponse.json();
          return {
            ...review,
            ownerName: `${owner.name || ''} ${owner.lastName || ''}`.trim() || 'Anonymous'
          };
        } catch (err) {
          console.error(`Error fetching owner ${review.ownerId}:`, err);
          return {
            ...review,
            ownerName: 'Anonymous'
          };
        }
      }));

      // Sort reviews by date (newest first)
      reviewsWithOwners.sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));

      // Combine vet data with reviews
      const vetWithReviews = {
        ...fullVetData,
        reviews: reviewsWithOwners,
        reviewCount: reviews.length
      };

      setSelectedProfileVet(vetWithReviews);
      setShowProfileModal(true);
    } catch (error) {
      console.error('Error fetching vet details:', error);
      // Fallback: open modal with basic data
      setSelectedProfileVet(vet);
      setShowProfileModal(true);
    }
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
            {/* Hero Text */}
            <div className="lost-pets-hero__text">
              <h1 className="hero-title">Πλατφόρμα Διαχείρισης Κατοικιδίων</h1>
              <p className="hero-description">
                Ολοκληρωμένη πλατφόρμα για τη διαχείριση της υγείας των κατοικιδίων σας, την αναζήτηση επαγγελματιών κτηνιάτρων και την καταγραφή ιατρικών πράξεων.
              </p>
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
                <div className="card-header" onClick={toggleAllFeatures}>
                  <div className={`card-icon ${userType.color}-icon`}>
                    {userType.icon}
                  </div>
                  <div className="card-title-group">
                    <h3 className="card-title">{userType.title}</h3>
                    <div className={`card-toggle-icon ${isExpanded ? 'active' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
                <div className={`card-features-dropdown ${isExpanded ? 'expanded' : ''}`}>
                  <ul className="card-features">
                    {userType.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className={`feature-dot ${userType.color}-dot`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
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

        {/* Found Pet Actions - moved below hero */}
        <section className="found-actions-section">
          <div className="found-actions-container">
            <div className="found-actions-header">
              <div className="found-actions-text">
                <div className="title-with-info">
                  <h2 className="hero-search-title">Βρήκατε κάποιο ζωάκι;</h2>
                  <button
                    className="info-icon-btn"
                    onClick={() => navigate('/citizen/information')}
                    aria-label="Πληροφορίες"
                  >
                    <Info size={18} />
                  </button>
                </div>
                <p className="hero-search-subtitle">Βοηθήστε να επιστρέψει στην οικογένειά του</p>
              </div>
              <button className="found-action-btn primary-btn" onClick={handleReportQuick}>
                Δήλωση Εύρεσης Kατοικιδίου
              </button>
            </div>

            <div className="found-actions-content">
              <div className="lost-pets-carousel-section">
                <div className="carousel-title">Πρόσφατα Χαμένα Κατοικίδια</div>
                <div className="lost-pets-hero__carousel">

                  <div className="carousel-wrapper">
                    <button
                      className="carousel-nav carousel-nav--prev"
                      onClick={prevSlide}
                      aria-label="Προηγούμενο"
                    >
                      <ChevronLeft size={24} />
                    </button>

                    <div className="carousel-track">
                      {lostPets.map((pet, index) => {
                        const petImage = pet.imageUrl || pet.image;

                        return (
                          <div
                            key={pet.id}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                          >
                            <div className="carousel-card" onClick={() => handlePetClick(pet)}>
                              <div className="carousel-card__main">
                                <div className="carousel-card__image">
                                  {petImage ? (
                                    <img
                                      src={petImage}
                                      alt={`Φωτογραφία του ${pet.name}`}
                                      className="carousel-card__photo"
                                    />
                                  ) : (
                                    getPetIcon(pet.type)
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
                                </div>
                              </div>
                              <button
                                className="carousel-card__action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFoundPetClick(pet);
                                }}
                              >
                                Το βρήκα
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
              </div>
            </div>
          </div>
        </section>
        {/* Top Rated Vets Section */}
        <section className="vet-section">
          <div className="vet-section-main-title">
            <h2>Αναζήτηση Κτηνιάτρων</h2>
            <button
              className="info-icon-btn"
              onClick={() => navigate('/vet/information')}
              aria-label="Πληροφορίες"
            >
              <Info size={18} />
            </button>
          </div>
          <div className="hero-search-box">
            <div className="search-container">
              <div className="search-column">
                <label className="search-label">Ονοματεπώνυμο</label>
                <div className="search-field no-icon">
                  <input
                    type="text"
                    placeholder="π.χ. Παπαδόπουλος"
                    className="search-input search-text-input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-column">
                <label className="search-label">Περιοχή</label>
                <div className="search-field">
                  <LocationPicker
                    value={selectedArea}
                    onChange={setSelectedArea}
                    onSelect={handleLocationSelect}
                    placeholder="Επιλέξτε περιοχή"
                    variant="citizen"
                  />
                </div>
              </div>
              <div className="search-column">
                <label className="search-label">Ημέρα</label>
                <div className="search-field no-icon">
                  <CustomSelect
                    value={selectedAvailability}
                    onChange={setSelectedAvailability}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: 'all', label: 'Όλες οι ημέρες' },
                      { value: 'monday', label: 'Δευτέρα' },
                      { value: 'tuesday', label: 'Τρίτη' },
                      { value: 'wednesday', label: 'Τετάρτη' },
                      { value: 'thursday', label: 'Πέμπτη' },
                      { value: 'friday', label: 'Παρασκευή' },
                      { value: 'saturday', label: 'Σάββατο' },
                      { value: 'sunday', label: 'Κυριακή' }
                    ]}
                  />
                </div>
              </div>
              <div className="search-column">
                <label className="search-label">Ειδικότητα</label>
                <div className="search-field no-icon">
                  <CustomSelect
                    value={selectedSpecialty}
                    onChange={setSelectedSpecialty}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: 'general', label: 'Γενική Κτηνιατρική' },
                      { value: 'surgery', label: 'Χειρουργική' },
                      { value: 'dermatology', label: 'Δερματολογία' },
                      { value: 'cardiology', label: 'Καρδιολογία' },
                      { value: 'dentistry', label: 'Οδοντιατρική' },
                      { value: 'ophthalmology', label: 'Οφθαλμολογία' }
                    ]}
                  />
                </div>
              </div>
            </div>
            <button
              className="search-button"
              onClick={() => navigate(ROUTES.citizen.searchMap, {
                state: {
                  filters: {
                    searchName: searchName,
                    selectedArea: selectedArea,
                    locationData: locationData,
                    selectedAvailability: selectedAvailability,
                    selectedSpecialty: selectedSpecialty
                  }
                }
              })}
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
                  <div
                    key={sIdx}
                    className={`vet-carousel-slide ${sIdx === currentVetSlide ? 'active' : ''}`}
                    style={{ transform: `translateX(${(sIdx - currentVetSlide) * 100}%)` }}
                  >
                    <div className="vet-carousel-slide-inner">
                      {slide.map((vet, vetIdx) => (
                        <div key={`${sIdx}-${vetIdx}`} className="vet-carousel-card" onClick={() => handleVetClick(vet)}>
                          <div className="vet-card__avatar-wrapper">
                            <Avatar
                              src={vet.avatar}
                              name={vet.name}
                              size="lg"
                            />
                          </div>
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
              {vetSlides.map((_, idx) => (
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

      {/* Vet Profile Modal */}
      <VetProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        vet={selectedProfileVet}
      />
    </PageLayout>
  );
};

export default HomePage;