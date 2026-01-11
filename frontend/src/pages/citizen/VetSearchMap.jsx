import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
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

  // Fetch vets from backend
  useEffect(() => {
    const fetchVets = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching vets from backend...');

        const response = await fetch('http://localhost:5000/users');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log('Fetched users:', users);

        // Fetch availability data
        const availabilityResponse = await fetch('http://localhost:5000/availability');
        const availabilityRecords = await availabilityResponse.json();
        console.log('Fetched availability records:', availabilityRecords);

        // Filter only vet users and add default coordinates and availability
        const vetUsers = users
          .filter(user => user.userType === 'vet')
          .map((vet, index) => {
            // Get availability for this vet (compare as numbers to handle string/number mismatch)
            const vetAvailability = availabilityRecords.filter(a => Number(a.vetId) === Number(vet.id));
            const availableDays = [...new Set(vetAvailability.map(a => a.day))];

            console.log(`Vet ${vet.name} (ID: ${vet.id}): availableDays = `, availableDays);

            return {
              ...vet,
              name: vet.name || 'Άγνωστος',
              specialty: vet.specialization || 'Γενικός Κτηνίατρος',
              area: `${vet.clinicCity || 'Αθήνα'}, ${vet.clinicAddress || 'Άγνωστη διεύθυνση'}`,
              rating: 4.5 + (Math.random() * 0.4), // Random rating between 4.5-4.9
              lat: 37.9838 + (Math.random() * 0.3 - 0.15), // Random latitude around Athens
              lon: 23.7275 + (Math.random() * 0.3 - 0.15), // Random longitude around Athens
              position: { top: `${30 + (index * 10)}%`, left: `${40 + (index * 8)}%` },
              availableDays: availableDays,
              availabilitySlots: vetAvailability
            };
          });

        console.log('Filtered vet users:', vetUsers);
        setAllVets(vetUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vets:', error);
        setError(error.message);
        setAllVets([]);
        setLoading(false);
      }
    };

    fetchVets();
  }, []);

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
    setCurrentPage(1);
  };

  // Filter vets based on selected filters
  const filteredVets = useMemo(() => {
    return allVets.filter(vet => {
      // Filter by specialty
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

      // Filter by area/location
      if (filters.area && !vet.area.toLowerCase().includes(filters.area.toLowerCase())) {
        return false;
      }

      // Filter by rating
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        if (vet.rating < minRating) {
          return false;
        }
      }

      // Filter by availability (day) - only if explicitly selected
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
        } else if (targetDay) {
          // Check if vet has availability on specific day - case insensitive comparison
          const hasDay = vet.availableDays.some(day =>
            day.toLowerCase() === targetDay.toLowerCase()
          );
          if (!hasDay) {
            return false;
          }
        }
      }

      // Filter by time - works independently from day filter
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
            const targetDay = availabilityMap[filters.availability];
            slotsToCheck = vet.availabilitySlots.filter(slot => slot.day === targetDay);
          } else if (filters.availability === 'week') {
            // For week filter, include all slots (which should already be limited to this week in backend)
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
                  <Star size={48} color="#FCA47C" />
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
        />
      </div>
    </PageLayout>
  );
};

export default VetSearchMap;
