import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import Pagination from '../../components/common/Pagination';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import MapWithMarkers from '../../components/citizen/MapWithMarkers';
import SearchSidebar from '../../components/citizen/SearchSidebar';
import SearchResultsList from '../../components/citizen/SearchResultsList';
import './VetSearchMap.css';

const VetSearchMap = () => {
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  
  const [filters, setFilters] = useState({
    area: '',
    specialty: '',
    availability: '',
    time: '',
    rating: '',
  });

  const [locationData, setLocationData] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVet, setSelectedVet] = useState(null);
  const itemsPerPage = 5;

  // Mock vets data with coordinates
  const vets = [
    { 
      id: 1, 
      name: 'Γιώργος Αντωνίου', 
      specialty: 'Γενικός Κτηνίατρος', 
      area: 'Αθήνα, Καλαμαριά', 
      rating: 4.8,
      lat: 37.9838,
      lon: 23.7275,
      position: { top: '42%', left: '52%' }
    },
    { 
      id: 2, 
      name: 'Μαρία Παπαδοπούλου', 
      specialty: 'Χειρουργική', 
      area: 'Αθήνα, Νέα Σμύρνη', 
      rating: 4.9,
      lat: 37.9400,
      lon: 23.7280,
      position: { top: '35%', left: '58%' }
    },
    { 
      id: 3, 
      name: 'Νίκος Οικονόμου', 
      specialty: 'Οδοντιατρική', 
      area: 'Αθήνα, Γλυφάδα', 
      rating: 4.7,
      lat: 37.8650,
      lon: 23.7540,
      position: { top: '60%', left: '48%' }
    },
    { 
      id: 4, 
      name: 'Ελένη Κωνσταντίνου', 
      specialty: 'Ορθοπεδική', 
      area: 'Αθήνα, Χαλάνδρι', 
      rating: 4.6,
      lat: 38.0214,
      lon: 23.7950,
      position: { top: '28%', left: '45%' }
    },
    { 
      id: 5, 
      name: 'Δημήτρης Σπανός', 
      specialty: 'Γενικός Κτηνίατρος', 
      area: 'Αθήνα, Περιστέρι', 
      rating: 4.5,
      lat: 38.0157,
      lon: 23.6912,
      position: { top: '50%', left: '35%' }
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      area: '',
      specialty: '',
      availability: '',
      time: '',
      rating: '',
    });
    setLocationData(null);
  };

  const handleMarkerClick = (vet) => {
    setSelectedVet(selectedVet?.id === vet.id ? null : vet);
  };

  const handleViewProfile = (vet) => {
    navigate(`/vet-profile/${vet.id}`);
  };

  const handleCloseAppointment = (vet) => {
    // Handle close appointment
    console.log('Close appointment for:', vet.name);
  };

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (locationData) {
      return [parseFloat(locationData.lat), parseFloat(locationData.lon)];
    }
    // Default to Athens center
    return [37.9838, 23.7275];
  }, [locationData]);

  const mapZoom = locationData ? 14 : 12;

  // Pagination logic
  const totalPages = Math.ceil(vets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVets = vets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Options for CustomSelect components
  const specialtyOptions = [
    { value: '', label: 'Επιλέξτε ειδικότητα...' },
    { value: 'general', label: 'Γενικός Κτηνίατρος' },
    { value: 'surgery', label: 'Χειρουργική' },
    { value: 'dentistry', label: 'Οδοντιατρική' },
    { value: 'orthopedics', label: 'Ορθοπεδική' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Επιλέξτε ημέρα...' },
    { value: 'today', label: 'Σήμερα' },
    { value: 'tomorrow', label: 'Αύριο' },
    { value: 'week', label: 'Αυτή την εβδομάδα' }
  ];

  const timeOptions = [
    { value: '', label: 'Επιλέξτε ώρα...' },
    { value: 'morning', label: 'Πρωί (08:00-12:00)' },
    { value: 'afternoon', label: 'Απόγευμα (12:00-18:00)' },
    { value: 'evening', label: 'Βράδυ (18:00-21:00)' }
  ];

  const ratingOptions = [
    { value: '', label: 'Επιλέξτε αξιολόγηση...' },
    { value: '4', label: '4+ ⭐' },
    { value: '4.5', label: '4.5+ ⭐' },
    { value: '4.8', label: '4.8+ ⭐' }
  ];

  return (
    <PageLayout title="Αναζήτηση Κτηνιάτρων">
      <div className="vet-search-map-page">
        {/* Sidebar Filters */}
        <SearchSidebar
          title="Φίλτρα Αναζήτησης"
          filters={filters}
          onSearch={() => {}}
          onClear={handleClear}
          resultsCount={vets.length}
        >
          {/* Area Filter with LocationPicker */}
          <div className="filter-group">
            <label className="filter-label">Περιοχή</label>
            <LocationPicker
              value={filters.area}
              onChange={(val) => setFilters(prev => ({ ...prev, area: val }))}
              onSelect={handleLocationSelect}
              placeholder="π.χ. Αθήνα, Καλαμαριά..."
              variant="citizen"
            />
          </div>

          {/* Specialty Filter */}
          <div className="filter-group">
            <label className="filter-label">Ειδικότητα</label>
            <CustomSelect
              name="specialty"
              value={filters.specialty}
              onChange={(val) => handleSelectChange('specialty', val)}
              options={specialtyOptions}
              variant="citizen"
            />
          </div>

          {/* Availability Filter */}
          <div className="filter-group">
            <label className="filter-label">Ημέρα Διαθεσιμότητας</label>
            <CustomSelect
              name="availability"
              value={filters.availability}
              onChange={(val) => handleSelectChange('availability', val)}
              options={availabilityOptions}
              variant="citizen"
            />
          </div>

          {/* Time Filter */}
          <div className="filter-group">
            <label className="filter-label">Ώρα</label>
            <CustomSelect
              name="time"
              value={filters.time}
              onChange={(val) => handleSelectChange('time', val)}
              options={timeOptions}
              variant="citizen"
            />
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <label className="filter-label">Ελάχιστη Αξιολόγηση</label>
            <CustomSelect
              name="rating"
              value={filters.rating}
              onChange={(val) => handleSelectChange('rating', val)}
              options={ratingOptions}
              variant="citizen"
            />
          </div>
        </SearchSidebar>

        {/* Main Map Area */}
        <main className="map-container">
          <div className="map-header">
            <h2 className="map-title">Αποτελέσματα ({vets.length})</h2>
            <div className="view-toggles">
              <button 
                className={`toggle-btn ${showMap ? 'active' : ''}`} 
                onClick={() => setShowMap(true)}
              >
                <MapPin size={18} />
                Χάρτης
              </button>
              <button 
                className={`toggle-btn ${!showMap ? 'active' : ''}`} 
                onClick={() => setShowMap(false)}
              >
                Λίστα
              </button>
            </div>
          </div>

          {showMap ? (
            <MapWithMarkers
              center={mapCenter}
              zoom={mapZoom}
              markers={vets}
              selectedId={selectedVet?.id}
              onMarkerClick={handleMarkerClick}
              height="600px"
              width="100%"
              currentUser={currentUser}
              onViewProfile={handleViewProfile}
              onCloseAppointment={handleCloseAppointment}
            />
          ) : (
            <SearchResultsList
              items={currentVets}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              variant="citizen"
              actionButtonText="Προβολή Προφίλ"
              onActionClick={handleViewProfile}
              showCloseAppointment={true}
              onCloseAppointment={handleCloseAppointment}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>
    </PageLayout>
  );
};

export default VetSearchMap;
