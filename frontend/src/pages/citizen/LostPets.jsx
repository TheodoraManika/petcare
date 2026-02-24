import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, List, Dog, Cat, X, Phone, Palette, AlertCircle, Search as SearchIcon, FileText, User, Mail, Bird, PawPrint } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import DatePicker from '../../components/common/forms/DatePicker';
import LocationPicker from '../../components/common/forms/LocationPicker';
import MapWithMarkers from '../../components/citizen/MapWithMarkers';
import SearchSidebar from '../../components/citizen/SearchSidebar';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES, formatDate } from '../../utils/constants';
import './LostPets.css';
import FoundPetForm from './FoundPetForm';

const LostPets = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to translate pet type to Greek
  const translatePetType = (type) => {
    if (!type) return '';
    const typeLower = type.toLowerCase();
    if (typeLower.includes('dog') || typeLower.includes('σκύλος')) return 'Σκύλος';
    if (typeLower.includes('cat') || typeLower.includes('γάτα')) return 'Γάτα';
    if (typeLower.includes('bird') || typeLower.includes('πτηνό')) return 'Πτηνό';
    if (typeLower.includes('reptile') || typeLower.includes('ερπετό')) return 'Ερπετό';
    return type;
  };

  const [filters, setFilters] = useState({
    animal: '',
    area: '',
    color: '',
    breed: '',
    microchip: '',
    lostDate: '',
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
        const [petAlertsResponse, usersResponse] = await Promise.all([
          fetch('http://localhost:5000/pets'),
          fetch('http://localhost:5000/users')
        ]);

        if (!petAlertsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const petAlertsData = await petAlertsResponse.json();
        const usersData = await usersResponse.json();

        // Filter only lost pets (petStatus === 1 AND status is 'active', not 'draft')
        const lostPetsData = petAlertsData.filter(pet => pet.petStatus === 1 && pet.status === 'active');

        // Transform data for display (add owner info and default coordinates if missing)
        const transformedPets = lostPetsData.map((pet, index) => {
          const owner = usersData.find(user => user.id === pet.ownerId?.toString());

          return {
            ...pet,
            id: pet.id,
            name: pet.petName || pet.name || 'Άγνωστο',
            type: pet.type || 'Άγνωστο',
            breed: pet.breed || 'Άγνωστο',
            area: pet.lostLocation || 'Άγνωστη τοποθεσία',
            dateLost: pet.lostDate || new Date().toLocaleDateString('el-GR'),
            color: pet.color || 'Άγνωστο χρώμα',
            ownerName: owner ? `${owner.name} ${owner.lastName}` : 'Άγνωστο',
            contactEmail: owner?.email || '',
            contactPhone: owner?.phone || '',
            // Default coordinates for Athens if not specified
            lat: pet.locationLat || 37.9838,
            lon: pet.locationLon || 23.7275,
          };
        });

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

  // Handle deep linking to specific pet from notifications
  useEffect(() => {
    if (location.state?.petId && !loading && lostPets.length > 0) {
      const pet = lostPets.find(p => String(p.id) === String(location.state.petId));
      if (pet) {
        handleViewDetails(pet);
      }
    }
  }, [location.state, loading, lostPets]);

  const handleSelectChange = (name, value) => {
    // Validate microchip input - only numbers, max 15 digits
    if (name === 'microchip') {
      const filteredValue = value.replace(/[^0-9]/g, ''); // Only allow numbers
      if (filteredValue.length <= 15) {
        setFilters(prev => ({
          ...prev,
          [name]: filteredValue
        }));
      }
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setLocationData(location);
    // Also update the area filter with the selected location label
    setFilters(prev => ({
      ...prev,
      area: location.label || ''
    }));
  };

  const handleClear = () => {
    setFilters({
      animal: '',
      area: '',
      color: '',
      breed: '',
      microchip: '',
      lostDate: '',
    });
    setLocationData(null);
  };

  // Helper function to normalize date for comparison (DD/MM/YYYY or YYYY-MM-DD to YYYY-MM-DD)
  const normalizeDateForComparison = (dateStr) => {
    if (!dateStr) return '';
    // If format is DD/MM/YYYY, convert to YYYY-MM-DD
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    // If already in YYYY-MM-DD format, return as is
    return dateStr;
  };

  // Helper function to normalize text for fuzzy matching (remove accents, normalize spacing)
  const normalizeText = (text) => {
    if (!text) return '';
    // Remove diacritics/accents
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .toLowerCase()
      .trim();
    return normalized;
  };

  // Synonym mappings for colors and breeds
  const colorSynonyms = {
    'μαυρο': ['black', 'σκουρο', 'dark'],
    'λευκο': ['white', 'ασπρο'],
    'καφε': ['brown', 'σκουρο'],
    'κοκκινο': ['red', 'ρουφ'],
    'γκρι': ['grey', 'gray', 'σταχτι'],
    'κιτρινο': ['yellow', 'χρυσαφι'],
    'μαυρο λευκο': ['black white', 'μαυρο λευκο'],
    'λευκο γκρι': ['white grey', 'λευκο γκρι'],
  };

  const breedSynonyms = {
    'λαμπραντορ': ['labrador', 'lab'],
    'γερμανικος ποιμενας': ['german shepherd', 'shepherd'],
    'περσικη': ['persian', 'persia'],
    'σιαμεζα': ['siamese', 'siam'],
  };

  // Smart matching function for color and breed
  const smartMatch = (petValue, filterValue, synonymMap) => {
    if (!filterValue || !petValue) return false;

    const petNorm = normalizeText(petValue);
    const filterNorm = normalizeText(filterValue);

    // Exact match after normalization
    if (petNorm === filterNorm) return true;

    // Partial match (one contains the other)
    if (petNorm.includes(filterNorm) || filterNorm.includes(petNorm)) return true;

    // Check for synonyms
    const petSynonyms = Object.entries(synonymMap)
      .filter(([_, syns]) => syns.some(syn => syn === petNorm || petNorm.includes(syn)))
      .map(([key, _]) => key);

    const filterSynonyms = Object.entries(synonymMap)
      .filter(([_, syns]) => syns.some(syn => syn === filterNorm || filterNorm.includes(syn)))
      .map(([key, _]) => key);

    // If either value matches any synonym of the other
    if (petSynonyms.some(syn => filterNorm === syn || filterNorm.includes(syn))) return true;
    if (filterSynonyms.some(syn => petNorm === syn || petNorm.includes(syn))) return true;

    return false;
  };

  // Filter pets based on all active filters
  const filteredPets = useMemo(() => {
    return lostPets.filter(pet => {
      // Microchip filter
      if (filters.microchip) {
        const chip = (pet.microchipId || pet.microchip || '').toString().toLowerCase();
        const needle = filters.microchip.toString().toLowerCase();
        if (!chip.includes(needle)) return false;
      }

      // Animal type filter (match against the dropdown values: dog, cat, bird, reptile, other)
      if (filters.animal && filters.animal !== 'all') {
        const petType = (pet.type || '').toLowerCase();
        // Map Greek names to English values
        const typeMatches =
          (filters.animal === 'dog' && (petType.includes('dog') || petType.includes('σκύλος'))) ||
          (filters.animal === 'cat' && (petType.includes('cat') || petType.includes('γάτα'))) ||
          (filters.animal === 'bird' && (petType.includes('bird') || petType.includes('πτηνό'))) ||
          (filters.animal === 'reptile' && petType.includes('reptile')) ||
          (filters.animal === 'other' && !['dog', 'cat', 'bird', 'reptile'].some(t => petType.includes(t)));

        if (!typeMatches) return false;
      }

      // Color filter - using smart matching
      if (filters.color) {
        if (!smartMatch(pet.color, filters.color, colorSynonyms)) return false;
      }

      // Breed filter - using smart matching
      if (filters.breed) {
        if (!smartMatch(pet.breed, filters.breed, breedSynonyms)) return false;
      }

      // Lost date filter - normalize both dates for comparison
      if (filters.lostDate) {
        const normalizedPetDate = normalizeDateForComparison(pet.dateLost);
        const normalizedFilterDate = normalizeDateForComparison(filters.lostDate);
        if (normalizedPetDate !== normalizedFilterDate) return false;
      }

      // Area/Location filter - using smart matching and normalized text
      if (filters.area) {
        const petArea = normalizeText(pet.area || '');
        const filterArea = normalizeText(filters.area);

        // Check if pet area contains any part of the filter area
        // This handles cases like "Αθήνα, Ελλάδα" matching "Μαρούσι, Αθήνα"
        const filterParts = filterArea.split(',').map(p => p.trim());
        const petParts = petArea.split(',').map(p => p.trim());

        const hasMatch = filterParts.some(filterPart =>
          petParts.some(petPart => petPart.includes(filterPart) || filterPart.includes(petPart))
        );

        if (!hasMatch) return false;
      }

      return true;
    });
  }, [filters, lostPets]);

  const hasSearched = Object.values(filters).some(filter => filter.length > 0);
  const hasNoResults = hasSearched && filteredPets.length === 0;

  const handleMarkerClick = (pet) => {
    setSelectedPet(selectedPet?.id === pet.id ? null : pet);
  };

  const handleViewDetails = (pet) => {
    setDetailPet(pet);
    setShowDetailModal(true);
  };

  const handleFoundPet = (pet) => {
    setFoundFormPrefill({
      petDetails: {
        petName: pet.name,
        species: pet.type,
        breed: pet.breed,
        foundLocation: pet.area,
        description: pet.description,
        dateReported: pet.dateLost,
        microchip: pet.microchipId || pet.microchip,
        gender: pet.gender,
        color: pet.color,
        weight: pet.weight,
        birthDate: pet.birthDate
      }
    });
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
    { value: 'all', label: 'Επιλέξτε είδος' },
    { value: 'dog', label: 'Σκύλος', icon: <Dog size={16} /> },
    { value: 'cat', label: 'Γάτα', icon: <Cat size={16} /> },
    { value: 'bird', label: 'Πτηνό' },
    { value: 'reptile', label: 'Ερπετό' },
    { value: 'other', label: 'Άλλο' }
  ];

  const getPetIcon = (type, size = 48) => {
    const species = type?.toLowerCase();
    if (species?.includes('dog') || species?.includes('σκύλος')) return <Dog size={size} color="#23CED9" />;
    if (species?.includes('cat') || species?.includes('γάτα')) return <Cat size={size} color="#23CED9" />;
    if (species?.includes('bird') || species?.includes('πτηνό')) return <Bird size={size} color="#23CED9" />;
    return <PawPrint size={size} color="#23CED9" />;
  };

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
          onSearch={() => setCurrentPage(1)}
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
                placeholder="123456789012345 (15 ψηφία)"
                value={filters.microchip}
                onChange={(e) => handleSelectChange('microchip', e.target.value)}
                maxLength={15}
              />
            </div>
            <span className="filter-note">Επιτρέπονται μόνο αριθμοί (μέγιστο 15 ψηφία)</span>
          </div>

          {/* Divider */}
          <div className="filters-divider"></div>

          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Τοποθεσία
            </label>
            <LocationPicker
              onSelect={handleLocationSelect}
              placeholder="Αναζήτηση περιοχής..."
              variant="citizen"
            />
          </div>

          {/* Lost Date Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Ημερομηνία Εξαφάνισης
            </label>
            <DatePicker
              name="lostDate"
              value={filters.lostDate}
              onChange={(e) => handleSelectChange('lostDate', e.target.value)}
              variant="citizen"
              maxDate={new Date()}
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
            <input
              type="text"
              name="color"
              className="filter-input"
              placeholder="π.χ. Μαύρο, Καφέ, Λευκό"
              value={filters.color}
              onChange={(e) => handleSelectChange('color', e.target.value)}
            />
          </div>

          {/* Breed Filter */}
          <div className="filter-group">
            <label className="filter-label">Ράτσα</label>
            <input
              type="text"
              name="breed"
              className="filter-input"
              placeholder="π.χ. Golden Retriever"
              value={filters.breed}
              onChange={(e) => handleSelectChange('breed', e.target.value)}
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
                  <p className="popup-date">Χάθηκε: {formatDate(pet.dateLost)}</p>
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
                          onClick={() => handleViewDetails(pet)}
                          title="Προβολή λεπτομερειών"
                        >
                          {getPetIcon(pet.type)}
                        </div>
                        <div className="pet-card-content">
                          <h3
                            className="pet-card-name clickable"
                            onClick={() => handleViewDetails(pet)}
                            title="Προβολή λεπτομερειών"
                          >
                            {pet.name}
                          </h3>
                          <p className="pet-card-breed">{translatePetType(pet.type)} - {pet.breed}</p>
                          <div className="pet-card-info">
                            <MapPin size={14} />
                            <span>{pet.area}</span>
                          </div>
                          <p className="pet-card-date">Χάθηκε: {formatDate(pet.dateLost)}</p>
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
                  {getPetIcon(detailPet.type, 50)}
                </div>
                <div className="modal-pet-identity">
                  <h2 className="modal-pet-name">{detailPet.name}</h2>
                  <p className="modal-pet-breed">{detailPet.type} - {detailPet.breed}</p>
                  <div className="modal-pet-status">
                    <AlertCircle size={16} />
                    <span>Χάθηκε: {formatDate(detailPet.dateLost)}</span>
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
                    <p className="modal-detail-content">{detailPet.microchipId || '-'}</p>
                  </div>

                  <div className="modal-detail-item">
                    <div className="modal-detail-header">
                      <Palette size={18} className="modal-detail-icon" />
                      <h4>Χρώμα</h4>
                    </div>
                    <p className="modal-detail-content">{detailPet.color}</p>
                  </div>
                </div>

                {/* Owner Information - Larger Section */}
                <div className="modal-owner-section">
                  <div className="modal-owner-header">
                    <User size={20} className="modal-owner-icon" />
                    <h3>Ιδιοκτήτης</h3>
                  </div>
                  <div className="modal-owner-content">
                    <p className="modal-owner-name">{detailPet.ownerName}</p>
                    <div className="modal-owner-contact">
                      <div className="modal-owner-contact-item">
                        <Phone size={16} />
                        <span>{detailPet.contactPhone}</span>
                      </div>
                      <div className="modal-owner-contact-item">
                        <Mail size={16} />
                        <span>{detailPet.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-biography">
                  <h3 className="modal-section-title">Περιγραφή</h3>
                  <p className="modal-biography-content">{detailPet.description}</p>
                </div>

              </div>

              <button
                className="modal-found-btn"
                onClick={() => {
                  setShowDetailModal(false);
                  handleFoundPet(detailPet);
                }}
              >
                Το Βρήκα!
              </button>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  );
};

export default LostPets;