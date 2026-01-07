import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, List, Dog } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import MapWithMarkers from '../../components/citizen/MapWithMarkers';
import SearchSidebar from '../../components/citizen/SearchSidebar';
import Pagination from '../../components/common/Pagination';
import { ROUTES } from '../../utils/constants';
import './LostPets.css';

const LostPets = () => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    animal: '',
    area: '',
    color: '',
    breed: '',
  });

  const [locationData, setLocationData] = useState(null);
  const [showMap, setShowMap] = useState(false); // Default to list view
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);
  const [lostPets, setLostPets] = useState([]);
  const [loading, setLoading] = useState(true);
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
    });
    setLocationData(null);
  };

  const handleMarkerClick = (pet) => {
    setSelectedPet(selectedPet?.id === pet.id ? null : pet);
  };

  const handleViewDetails = (pet) => {
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
  const totalPages = Math.ceil(lostPets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = lostPets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Options for CustomSelect components
  const animalOptions = [
    { value: '', label: 'Επιλέξτε είδος...' },
    { value: 'dog', label: 'Σκύλος' },
    { value: 'cat', label: 'Γάτα' },
    { value: 'other', label: 'Άλλο' }
  ];

  const colorOptions = [
    { value: '', label: 'Επιλέξτε χρώμα...' },
    { value: 'golden', label: 'Χρυσαφί' },
    { value: 'black', label: 'Μαύρο' },
    { value: 'white', label: 'Λευκό' },
    { value: 'brown', label: 'Καφέ' }
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
      <div className="lost-pets-page">
        {/* Sidebar with filters */}
        <SearchSidebar
          title="Φίλτρα Αναζήτησης"
          onSearch={() => {}}
          onClear={handleClear}
          resultsCount={lostPets.length}
        >
          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">Τοποθεσία</label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              placeholder="Αναζήτηση περιοχής..."
            />
          </div>

          {/* Animal Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Είδος Ζώου</label>
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
            <label className="filter-label">Χρώμα</label>
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
        <main className="lost-pets-container">
          <div className="lost-pets-header">
            <h2 className="lost-pets-title">Αποτελέσματα ({lostPets.length})</h2>
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

          {loading ? (
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
              markers={lostPets}
              selectedId={selectedPet?.id}
              onMarkerClick={handleMarkerClick}
              height="600px"
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
                  <button className="popup-profile-btn" onClick={() => handleViewDetails(pet)}>
                    Προβολή Λεπτομερειών
                  </button>
                </div>
              )}
            />
          ) : (
            <>
              <div className="pets-grid">
                {currentPets.map((pet) => (
                  <div key={pet.id} className="pet-card">
                    <div className="pet-card-image">
                      <Dog size={48} color="#FCA47C" />
                    </div>
                    <div className="pet-card-content">
                      <h3 className="pet-card-name">{pet.name}</h3>
                      <p className="pet-card-breed">{pet.type} - {pet.breed}</p>
                      <div className="pet-card-info">
                        <MapPin size={14} />
                        <span>{pet.area}</span>
                      </div>
                      <p className="pet-card-date">Χάθηκε: {pet.dateLost}</p>
                    </div>
                    <button 
                      className="pet-card-button"
                      onClick={() => handleViewDetails(pet)}
                    >
                      Προβολή Λεπτομερειών
                    </button>
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
        </main>
      </div>
    </PageLayout>
  );
};

export default LostPets;