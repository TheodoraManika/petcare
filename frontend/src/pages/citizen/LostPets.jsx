import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, List, Dog, Cat, X, AlertCircle, Search as SearchIcon, FileText, Scan, Palette, MapPinned } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import MapWithMarkers from '../../components/citizen/MapWithMarkers';
import SearchSidebar from '../../components/citizen/SearchSidebar';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES } from '../../utils/constants';
import './LostPets.css';
import FoundPetForm from './FoundPetForm';

const LostPets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    animal: '',
    area: '',
    color: '',
    breed: '',
    microchip: '',
  });

  const [locationData, setLocationData] = useState(null);
  const [showMap, setShowMap] = useState(false); // Default to list view
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPet, setDetailPet] = useState(null);
  const [showFoundForm, setShowFoundForm] = useState(false);
  const [foundFormPrefill, setFoundFormPrefill] = useState({});
  const itemsPerPage = 9; // 3x3 grid

  // Fetch lost pets from backend
  useEffect(() => {
    const fetchLostPets = async () => {
      try {
        const response = await fetch('http://localhost:5000/lostPets');
        if (!response.ok) {
          throw new Error('Failed to fetch lost pets');
        }
        const data = await response.json();
        
        // Transform data for display (add default coordinates if missing)
        const transformedPets = data.map((pet, index) => ({
          ...pet,
          name: pet.petName || 'Άγνωστο',
          type: pet.species || 'Άγνωστο',
          breed: pet.breed || 'Άγνωστο',
          area: pet.lostLocation || 'Άγνωστη τοποθεσία',
          dateLost: pet.lostDate || new Date().toLocaleDateString('el-GR'),
          color: pet.description?.split(',')[0] || 'Άγνωστο χρώμα',
          // Default coordinates for Athens if not specified
          lat: pet.locationLat || 37.9838,
          lon: pet.locationLon || 23.7275,
        }));
        
        setLostPets(transformedPets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lost pets:', error);
        setLostPets([]);
        setLoading(false);
      }
    };

    fetchLostPets();
  }, []);

  const handleSelectChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setLocationData(location);
  };

  const handleClear = () => {
    setFilters({
      animal: '',
      area: '',
      color: '',
      breed: '',
      microchip: '',
    });
    setLocationData(null);
  };

  // Filter pets based on microchip
  const filteredPets = useMemo(() => {
    const needle = (filters.microchip || '').toString().toLowerCase();
    if (!needle) return lostPets;
    return lostPets.filter(pet => {
      const chip = (pet.microchip || '').toString().toLowerCase();
      return chip.includes(needle);
    });
  }, [filters.microchip, lostPets]);

  const hasSearched = filters.microchip.length > 0;
  const hasNoResults = hasSearched && filteredPets.length === 0;

  const handleMarkerClick = (pet) => {
    setSelectedPet(selectedPet?.id === pet.id ? null : pet);
  };

  const handleViewDetails = (pet) => {
    setDetailPet(pet);
    setShowDetailModal(true);
  };

  const handleFoundPet = (pet) => {
    setFoundFormPrefill({ petDetails: {
      petName: pet.name,
      species: pet.type,
      breed: pet.breed,
      foundLocation: pet.area,
      description: pet.description,
      dateReported: pet.dateLost,
      microchip: pet.microchip
    }});
    setShowFoundForm(true);
  };

  const handleReportQuick = () => {
    setShowReportOptions(false);
    if (filters.microchip) {
      setFoundFormPrefill({ microchipId: filters.microchip });
    } else {
      setFoundFormPrefill({});
    }
    setShowFoundForm(true);
  };

  const handleReportWithMicrochip = () => {
    setShowReportOptions(false);
    if (filters.microchip) {
      const foundPet = lostPets.find(pet => pet.microchip === filters.microchip);
      if (foundPet) {
        handleFoundPet(foundPet);
      } else {
        setFoundFormPrefill({ microchipId: filters.microchip });
        setShowFoundForm(true);
      }
    } else {
      setFoundFormPrefill({});
      setShowFoundForm(true);
    }
  };

  const handleProfileClick = (pet) => {
    navigate(`/citizen/lost-pets/${pet.id}`);
  };

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (locationData) {
      return [parseFloat(locationData.lat), parseFloat(locationData.lon)];
    }
    return [37.9838, 23.7275]; // Default to Athens center
  }, [locationData]);

  const mapZoom = locationData ? 14 : 12;

  // Pagination logic
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = filteredPets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // If navigated here with state to open the found form, honor it
  useEffect(() => {
    if (location.state) {
      if (location.state.openFoundForm) {
        setFoundFormPrefill({
          microchipId: location.state.microchipId || undefined,
          petDetails: location.state.petDetails || undefined,
        });
        setShowFoundForm(true);
      }
    }
    // clear location state after handling (optional)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Options for CustomSelect components with icons
  const animalOptions = [
    { value: '', label: 'Επιλέξτε είδος...' },
    { value: 'dog', label: 'Σκύλος', icon: <Dog size={16} /> },
    { value: 'cat', label: 'Γάτα', icon: <Cat size={16} /> },
    { value: 'other', label: 'Άλλο' }
  ];

  const colorOptions = [
    { value: '', label: 'Επιλέξτε χρώμα...' },
    { value: 'golden', label: 'Χρυσαφί', icon: <Palette size={16} /> },
    { value: 'black', label: 'Μαύρο', icon: <Palette size={16} /> },
    { value: 'white', label: 'Λευκό', icon: <Palette size={16} /> },
    { value: 'brown', label: 'Καφέ', icon: <Palette size={16} /> }
  ];

  const breedOptions = [
    { value: '', label: 'Επιλέξτε ράτσα...' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'labrador', label: 'Λαμπραντόρ' },
    { value: 'persian', label: 'Περσική' }
  ];

  const breadcrumbItems = [
  ];

  return (
    <PageLayout title="Χαμένα Κατοικίδια" breadcrumbs={breadcrumbItems}>
      <section className="found-actions-section">
        <div className="found-actions-container">
          <div className="found-actions-text">
            <h2 className="hero-search-title">Βρήκατε κάποιο ζωάκι;</h2>
            <p className="hero-search-subtitle">Βοηθήστε να επιστρέψει στην οικογένειά του</p>
          </div>
          <div className="found-actions-buttons">
            <button className="found-action-btn primary-btn" onClick={handleReportQuick}>
              Δήλωση Εύρεσης
            </button>
          </div>
        </div>
      </section>
      <div className="lost-pets-page">
        {/* Sidebar with filters */}
        <SearchSidebar
          title="Φίλτρα Αναζήτησης"
          onSearch={() => {}}
          onClear={handleClear}
          resultsCount={filteredPets.length}
        >
          {/* Microchip Search - Primary Filter */}
          <div className="filter-group filter-group--primary">
            <label className="filter-label filter-label--emphasis">
              Αναζήτηση με Microchip
            </label>
            <div className="microchip-search">
              <SearchIcon size={18} className="microchip-search-icon" />
              <input
                type="text"
                className="microchip-input"
                placeholder="GR123456789012345"
                value={filters.microchip}
                onChange={(e) => handleSelectChange('microchip', e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="filters-divider"></div>

          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Τοποθεσία
            </label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              placeholder="Αναζήτηση περιοχής..."
              variant="citizen"
            />
          </div>

          {/* Animal Type Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Είδος Ζώου
            </label>
            <CustomSelect
              name="animal"
              value={filters.animal}
              onChange={(val) => handleSelectChange('animal', val)}
              options={animalOptions}
              variant="citizen"
            />
          </div>

          {/* Color Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Χρώμα
            </label>
            <CustomSelect
              name="color"
              value={filters.color}
              onChange={(val) => handleSelectChange('color', val)}
              options={colorOptions}
              variant="citizen"
            />
          </div>

          {/* Breed Filter */}
          <div className="filter-group">
            <label className="filter-label">Ράτσα</label>
            <CustomSelect
              name="breed"
              value={filters.breed}
              onChange={(val) => handleSelectChange('breed', val)}
              options={breedOptions}
              variant="citizen"
            />
          </div>
        </SearchSidebar>

        {/* Main Content Area */}
        <main className={`lost-pets-container ${showFoundForm ? 'has-inline-form' : ''}`}>

          <div className="lost-pets-header">
            <h2 className="lost-pets-title">Αποτελέσματα ({filteredPets.length})</h2>
            
            <div className="view-toggles">
              <button 
                className={`toggle-btn ${!showMap ? 'active' : ''}`} 
                onClick={() => setShowMap(false)}
              >
                <List size={18} />
                Λίστα
              </button>
              <button 
                className={`toggle-btn ${showMap ? 'active' : ''}`} 
                onClick={() => setShowMap(true)}
              >
                <MapPin size={18} />
                Χάρτης
              </button>
            </div>
            
          </div>

          {showFoundForm ? (
            <div className="found-form-replace">
              <FoundPetForm
                inline={true}
                prefill={foundFormPrefill}
                onClose={() => setShowFoundForm(false)}
              />
            </div>
          ) : loading ? (
            <div className="loading-message">
              <p>Φόρτωση χαμένων κατοικιδίων...</p>
            </div>
          ) : lostPets.length === 0 ? (
            <div className="no-results-message">
              <Dog size={48} color="#FCA47C" />
              <p>Δεν υπάρχουν χαμένα κατοικίδια για προβολή</p>
            </div>
          ) : showMap ? (
            <MapWithMarkers
              center={mapCenter}
              zoom={mapZoom}
              markers={filteredPets}
              selectedId={selectedPet?.id}
              onMarkerClick={handleMarkerClick}
              height="600px"
              width="100%"
              onViewProfile={handleViewDetails}
              popupContent={(pet) => (
                <div className="popup-content">
                  <h4 className="popup-name">{pet.name}</h4>
                  <p className="popup-specialty">{pet.type} - {pet.breed}</p>
                  <p className="popup-location">
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {pet.area}
                  </p>
                  <p className="popup-date">Χάθηκε: {pet.dateLost}</p>
                  <div className="popup-actions">
                    <button className="popup-details-btn" onClick={() => handleViewDetails(pet)}>
                      Προβολή 
                    </button>
                    <button className="popup-found-btn" onClick={() => handleFoundPet(pet)}>
                      Το Βρήκα!
                    </button>
                  </div>
                </div>
              )}
            />
          ) : (
            <>
              {hasNoResults ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <SearchIcon size={64} />
                  </div>
                  <h3 className="empty-state-title">
                    Δεν βρέθηκε δήλωση απώλειας
                  </h3>
                  <p className="empty-state-desc">
                    Δεν υπάρχει καταχωρημένο κατοικίδιο με αυτό το microchip.
                  </p>
                  <button 
                    className="empty-state-btn"
                    onClick={handleReportQuick}
                  >
                    <FileText size={18} />
                    Νέα Δήλωση Εύρεσης
                  </button>
                </div>
              ) : (
              <>
              <div className="pets-grid">
                {currentPets.map((pet) => (
                  <div key={pet.id} className="pet-card">
                    <div 
                      className="pet-card-image clickable"
                      onClick={() => handleProfileClick(pet)}
                      title="Κλικ για πλήρες προφίλ"
                    >
                      <Dog size={48} color="#23CED9" />
                    </div>
                    <div className="pet-card-content">
                      <h3 
                        className="pet-card-name clickable"
                        onClick={() => handleProfileClick(pet)}
                        title="Κλικ για πλήρες προφίλ"
                      >
                        {pet.name}
                      </h3>
                      <p className="pet-card-breed">{pet.type} - {pet.breed}</p>
                      <div className="pet-card-info">
                        <MapPin size={14} />
                        <span>{pet.area}</span>
                      </div>
                      <p className="pet-card-date">Χάθηκε: {pet.dateLost}</p>
                    </div>
                    <div className="pet-card-actions">
                      <button 
                        className="pet-card-button pet-card-button--details"
                        onClick={() => handleViewDetails(pet)}
                      >
                        Προβολή 
                      </button>
                      <button 
                        className="pet-card-button pet-card-button--found"
                        onClick={() => handleFoundPet(pet)}
                      >
                        Το Βρήκα!
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                variant="citizen"
              />
              </>
              )}
            </>
          )}
        </main>

        {/* Right-hand Report Sidebar removed (moved into main) */}

        {/* Pet Detail Modal */}
        {showDetailModal && detailPet && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <X size={24} />
              </button>
              
              <div className="modal-header">
                <div className="modal-pet-image">
                  <Dog size={80} color="#23CED9" />
                </div>
                <div className="modal-pet-identity">
                  <h2 className="modal-pet-name">{detailPet.name}</h2>
                  <p className="modal-pet-breed">{detailPet.type} - {detailPet.breed}</p>
                  <div className="modal-pet-status">
                    <AlertCircle size={16} />
                    <span>Χάθηκε στις {detailPet.dateLost}</span>
                  </div>
                </div>
              </div>

              <div className="modal-details">
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <div className="modal-detail-header">
                      <MapPin size={18} className="modal-detail-icon" />
                      <h4>Περιοχή</h4>
                    </div>
                    <p className="modal-detail-content">{detailPet.area}</p>
                  </div>

                  <div className="modal-detail-item">
                    <div className="modal-detail-header">
                      <SearchIcon size={18} className="modal-detail-icon" />
                      <h4>Microchip</h4>
                    </div>
                    <p className="modal-detail-content">{detailPet.microchip}</p>
                  </div>

                  <div className="modal-detail-item">
                    <div className="modal-detail-header">
                      <Dog size={18} className="modal-detail-icon" />
                      <h4>Χρώμα</h4>
                    </div>
                    <p className="modal-detail-content">{detailPet.color}</p>
                  </div>

                  <div className="modal-detail-item">
                    <div className="modal-detail-header">
                      <AlertCircle size={18} className="modal-detail-icon" />
                      <h4>Επικοινωνία</h4>
                    </div>
                    <p className="modal-detail-content">{detailPet.contactPhone}</p>
                  </div>
                </div>

                <div className="modal-biography">
                  <h3 className="modal-section-title">Περιγραφή</h3>
                  <p className="modal-biography-content">{detailPet.description}</p>
                </div>

                <div className="modal-traits">
                  <h3 className="modal-section-title">Χαρακτηριστικά</h3>
                  <div className="modal-traits-list">
                    {(detailPet.traits || []).map((trait, index) => (
                      <span key={index} className="modal-trait-tag">{trait}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="modal-found-btn"
                onClick={() => {
                  setShowDetailModal(false);
                  handleFoundPet(detailPet);
                }}
              >
                <AlertCircle size={18} />
                Το Βρήκα Αυτό το Κατοικίδιο!
              </button>
            </div>
          </div>
        )}
        
      </div>
    </PageLayout>
  );
};

export default LostPets;