import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, MapPin, CircleAlert } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import MapWithMarkers from '../../components/citizen/MapWithMarkers';
import SearchSidebar from '../../components/citizen/SearchSidebar';
import SearchResultsList from '../../components/citizen/SearchResultsList';
import BookingForm from '../../components/owner/BookingForm';
import VetProfileModal from '../../components/citizen/VetProfile';
import { ROUTES } from '../../utils/constants';
import './VetSearchMap.css';

const VetSearchMap = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Helper functions for day calculations
  const getTodayDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    console.log('getTodayDay() calculated as:', today, 'from getDay():', new Date().getDay());
    return today;
  };

  const getTomorrowDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const tomorrow = days[new Date(Date.now() + 86400000).getDay()];
    return tomorrow;
  };

  const currentUser = getCurrentUser();

  const [filters, setFilters] = useState({
    searchName: '',
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
  const [allVets, setAllVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingVet, setBookingVet] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileVet, setSelectedProfileVet] = useState(null);

  // Load filters from navigation state
  useEffect(() => {
    if (location.state?.filters) {
      const { searchName, selectedArea, locationData: locData, selectedAvailability, selectedSpecialty } = location.state.filters;

      setFilters(prev => ({
        ...prev,
        searchName: searchName || '',
        area: selectedArea || '',
        specialty: selectedSpecialty || '',
        availability: selectedAvailability || '',
      }));

      if (locData) {
        setLocationData(locData);
      }

      // Clear the navigation state after loading
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch vets from backend
  useEffect(() => {
    const fetchVets = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching vets from backend with filters:', filters);

        // Construct query parameters
        const params = new URLSearchParams();

        // City/Area
        if (filters.area) {
          // Backend searches for partial match in clinicCity or city
          params.append('city', filters.area);
        }

        // Specialty
        if (filters.specialty) {
          const specialtyMap = {
            'general': 'Γενική Κτηνιατρική',
            'surgery': 'Χειρουργική',
            'dermatology': 'Δερματολογία',
            'cardiology': 'Καρδιολογία',
            'dentistry': 'Οδοντιατρική',
            'ophthalmology': 'Οφθαλμολογία'
          };
          const backendSpecialty = specialtyMap[filters.specialty];
          if (backendSpecialty) {
            params.append('specialty', backendSpecialty);
          }
        }

        // Day (Availability)
        if (filters.availability && filters.availability !== 'all' && filters.availability !== 'week') {
          let dayParam = filters.availability;
          if (dayParam === 'today') {
            dayParam = getTodayDay();
          } else if (dayParam === 'tomorrow') {
            dayParam = getTomorrowDay();
          }
          if (dayParam) {
            params.append('day', dayParam);
          }
        }

        const response = await fetch(`http://localhost:5000/vets/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const vetUsers = await response.json();
        console.log('Fetched vets:', vetUsers);

        // Transform data for frontend
        const transformedVets = vetUsers.map((vet, index) => {
          // availability and availableDays are now returned by backend
          return {
            ...vet,
            name: vet.name || 'Άγνωστος',
            specialty: vet.specialization || 'Γενικός Κτηνιατρική',
            area: `${vet.clinicCity || 'Αθήνα'}, ${vet.clinicAddress || 'Άγνωστη διεύθυνση'}`,
            rating: vet.rating || 4.5 + (Math.random() * 0.4), // Use backend rating if available, else mock
            lat: vet.lat ? Number(vet.lat) : 37.9838 + (Math.random() * 0.3 - 0.15),
            lon: vet.lon ? Number(vet.lon) : 23.7275 + (Math.random() * 0.3 - 0.15),
            position: { top: `${30 + (index * 10)}%`, left: `${40 + (index * 8)}%` },
            availableDays: vet.availableDays || [],
            availabilitySlots: vet.availability || []
          };
        });

        console.log('Transformed vets:', transformedVets);
        setAllVets(transformedVets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vets:', error);
        setError(error.message);
        setAllVets([]);
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchVets();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]); // Re-fetch when filters change

  // Check for navigation state to open profile
  useEffect(() => {
    if (location.state?.openProfile && location.state?.vet) {
      setSelectedProfileVet(location.state.vet);
      setShowProfileModal(true);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
      searchName: '',
      area: '',
      specialty: '',
      availability: '',
      time: '',
      rating: '',
    });
    setLocationData(null);
    setCurrentPage(1);
  };

  // Filter vets based on selected filters
  const filteredVets = useMemo(() => {
    return allVets.filter(vet => {
      // Filter by name (search in both name and lastName)
      if (filters.searchName) {
        const searchTerm = filters.searchName.toLowerCase();
        const fullName = `${vet.name || ''} ${vet.lastName || ''}`.toLowerCase();
        if (!fullName.includes(searchTerm)) {
          return false;
        }
      }

      // Filter by specialty - ALREADY HANDLED BY BACKEND, but keeping for safety if backend misses
      // Actually backend handles stricter mapping, frontend handles selection.
      // If backend filtered it, this shouldn't hurt.
      if (filters.specialty) {
        const specialtyMap = {
          'general': 'Γενική Κτηνιατρική',
          'surgery': 'Χειρουργική',
          'dentistry': 'Οδοντιατρική',
          'orthopedics': 'Ορθοπεδική'
        };
        const targetSpecialty = specialtyMap[filters.specialty];
        if (targetSpecialty && vet.specialty !== targetSpecialty) {
          return false;
        }
      }

      // Filter by area/location - ALREADY HANDLED BY BACKEND partial match
      if (filters.area && !vet.area.toLowerCase().includes(filters.area.toLowerCase())) {
        // Backend matches city/clinicCity. Frontend matches constructed 'area' string.
        // This might filter out result if backend match is looser than frontend match.
        // Let's rely on backend for area filtering primarily, but check if local 'area' string contains it?
        // Actually, let's REMOVE strict client side area filtering if backend did it.
        // But wait, 'area' filter in frontend comes from LocationPicker which might be specific.
        // If `allVets` is already filtered by backend, we should trust it mostly.
        // However, `filters.area` is the text input.
        // If backend returns a vet in "Athens", and input was "Athens", good.
        // If backend returns vet, we keep it.
      }

      // Filter by rating - CLIENT SIDE only (backend doesn't do it yet)
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        if (vet.rating < minRating) {
          return false;
        }
      }

      // Filter by availability (day) - ALREADY HANDLED BY BACKEND unless 'week'
      // If 'week' is selected, backend returns all. Client needs to check if *any* availability exists.
      if (filters.availability) {
        const availabilityMap = {
          'today': getTodayDay(),
          'tomorrow': getTomorrowDay(),
          'week': null // null means show all with any availability this week
        };

        const targetDay = availabilityMap[filters.availability];

        // Skip filter if no availableDays data exists
        if (!vet.availableDays) {
          return false;
        }

        if (filters.availability === 'week') {
          // Check if vet has any availability this week
          if (vet.availableDays.length === 0) {
            return false;
          }
        }
        // For specific days, backend handles it.
      }

      // Filter by time - CLIENT SIDE only (backend doesn't do it)
      if (filters.time && vet.availabilitySlots && vet.availabilitySlots.length > 0) {
        const timeRanges = {
          'morning': { start: 8 * 60, end: 12 * 60 },      // 08:00-12:00 in minutes
          'afternoon': { start: 12 * 60, end: 18 * 60 },   // 12:00-18:00 in minutes
          'evening': { start: 18 * 60, end: 21 * 60 }      // 18:00-21:00 in minutes
        };

        const targetRange = timeRanges[filters.time];
        if (targetRange) {
          // If a specific day is selected, only check slots for that day
          let slotsToCheck = vet.availabilitySlots;

          if (filters.availability && filters.availability !== 'week') {
            const availabilityMap = {
              'today': getTodayDay(),
              'tomorrow': getTomorrowDay()
            };
            // dayParam handling for other cases like 'monday'
            let targetDay = availabilityMap[filters.availability];
            if (!targetDay && filters.availability !== 'all') targetDay = filters.availability; // 'monday', etc.

            if (targetDay) {
              slotsToCheck = vet.availabilitySlots.filter(slot => slot.day === targetDay || slot.dayOfWeek === targetDay);
            }
          } else if (filters.availability === 'week') {
            // For week filter, include all slots
            slotsToCheck = vet.availabilitySlots;
          }

          // Check if vet has any slots that overlap with the requested time range
          const hasTimeSlot = slotsToCheck.some(slot => {
            // Convert slot times to minutes for precise comparison
            const [slotStartHour, slotStartMin] = slot.startTime.split(':').map(Number);
            const [slotEndHour, slotEndMin] = slot.endTime.split(':').map(Number);
            const slotStartMinutes = slotStartHour * 60 + slotStartMin;
            const slotEndMinutes = slotEndHour * 60 + slotEndMin;

            // Check if there's any overlap between slot and requested time range
            // Overlap exists if: slot starts before range ends AND slot ends after range starts
            return slotStartMinutes < targetRange.end && slotEndMinutes > targetRange.start;
          });

          if (!hasTimeSlot) {
            return false;
          }
        }
      }

      return true;
    });
  }, [allVets, filters]);

  const handleMarkerClick = (vet) => {
    setSelectedVet(selectedVet?.id === vet.id ? null : vet);
  };

  const handleViewProfile = (vet) => {
    setSelectedProfileVet(vet);
    setShowProfileModal(true);
  };

  const handleCloseAppointment = (vet) => {
    // Show booking form inline instead of navigating away
    setBookingVet(vet);
    setShowBookingForm(true);
  };

  const handleBookingClose = () => {
    setShowBookingForm(false);
    setBookingVet(null);
  };

  const handleBookingSuccess = (message) => {
    setShowBookingForm(false);
    setBookingVet(null);
    setBookingSuccess(message);
    // Clear success message after 5 seconds
    setTimeout(() => setBookingSuccess(''), 5000);
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
  const totalPages = Math.ceil(filteredVets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVets = filteredVets.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Options for CustomSelect components
  const specialtyOptions = [
    { value: '', label: 'Επιλέξτε ειδικότητα...' },
    { value: 'general', label: 'Γενική Κτηνιατρική' },
    { value: 'surgery', label: 'Χειρουργική' },
    { value: 'dermatology', label: 'Δερματολογία' },
    { value: 'cardiology', label: 'Καρδιολογία' },
    { value: 'dentistry', label: 'Οδοντιατρική' },
    { value: 'ophthalmology', label: 'Οφθαλμολογία' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Επιλέξτε ημέρα...' },
    { value: 'all', label: 'Όλες οι ημέρες' },
    { value: 'monday', label: 'Δευτέρα' },
    { value: 'tuesday', label: 'Τρίτη' },
    { value: 'wednesday', label: 'Τετάρτη' },
    { value: 'thursday', label: 'Πέμπτη' },
    { value: 'friday', label: 'Παρασκευή' },
    { value: 'saturday', label: 'Σάββατο' },
    { value: 'sunday', label: 'Κυριακή' }
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
    { value: '5', label: '5 ⭐' }
  ];

  return (
    <PageLayout title="Αναζήτηση Κτηνιάτρων">
      {(!currentUser || currentUser.userType !== 'owner') && (
        <div className="appointment-alert">
          Για να κλείσετε ραντεβού, μπορείτε να κάνετε <Link to={ROUTES.login}>Σύνδεση</Link> ή <Link to={ROUTES.owner.register}>Εγγραφή</Link> ως ιδιοκτήτης.
        </div>
      )}
      <div className="vet-search-map-page">
        {/* Sidebar Filters */}
        <SearchSidebar
          title="Φίλτρα Αναζήτησης"
          filters={filters}
          onSearch={() => { }}
          onClear={handleClear}
          resultsCount={filteredVets.length}
        >
          {/* Name Search Filter */}
          <div className="filter-group">
            <label className="filter-label">Ονοματεπώνυμο</label>
            <input
              type="text"
              name="searchName"
              className="filter-input"
              placeholder="π.χ. Παπαδόπουλος"
              value={filters.searchName}
              onChange={handleFilterChange}
            />
          </div>

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
        <main className={`map-container ${showBookingForm ? 'has-booking-form' : ''}`}>
          {showBookingForm ? (
            <>
              {bookingSuccess && (
                <div className="booking-success-message">
                  {bookingSuccess}
                </div>
              )}
              <BookingForm
                vet={bookingVet}
                onClose={handleBookingClose}
                onSuccess={handleBookingSuccess}
                inline={true}
                showVetSearch={false}
              />
            </>
          ) : (
            <>
              <div className="map-header">
                <h2 className="map-title">Αποτελέσματα ({filteredVets.length})</h2>
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

              {bookingSuccess && (
                <div className="booking-success-message">
                  {bookingSuccess}
                </div>
              )}

              {error ? (
                <div className="error-message">
                  <p>Σφάλμα φόρτωσης δεδομένων: {error}</p>
                  <p style={{ fontSize: '14px', color: '#9ca3af' }}>Παρακαλώ ελέγξτε ότι ο server είναι ενεργός</p>
                </div>
              ) : loading ? (
                <div className="loading-message">
                  <p>Φόρτωση κτηνιάτρων...</p>
                </div>
              ) : filteredVets.length === 0 ? (
                <div className="no-results-message">
                  <CircleAlert size={48} color="#FCA47C" />
                  <p>Δεν βρέθηκαν κτηνίατροι με τα επιλεγμένα κριτήρια</p>
                </div>
              ) : showMap ? (
                <MapWithMarkers
                  center={mapCenter}
                  zoom={mapZoom}
                  markers={filteredVets}
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
            </>
          )}
        </main>

        <VetProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          vet={selectedProfileVet}
          onBook={() => handleCloseAppointment(selectedProfileVet)}
        />
      </div>
    </PageLayout>
  );
};

export default VetSearchMap;
