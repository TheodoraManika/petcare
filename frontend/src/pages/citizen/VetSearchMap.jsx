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
import Notification from '../../components/common/modals/Notification';
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
    service: '',
    maxPrice: '',
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
  const [notification, setNotification] = useState(null);

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

        // Fetch reviews data
        const reviewsResponse = await fetch('http://localhost:5000/reviews');
        const allReviews = await reviewsResponse.json();
        console.log('Fetched reviews:', allReviews);

        // Fetch owner details for all reviews
        const reviewsWithOwners = await Promise.all(allReviews.map(async (review) => {
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

        // Filter only vet users and add default coordinates and availability
        const vetUsers = users
          .filter(user => user.userType === 'vet')
          .map((vet, index) => {
            // Get availability for this vet (compare as numbers to handle string/number mismatch)
            const vetAvailability = availabilityRecords.filter(a => Number(a.vetId) === Number(vet.id));
            const availableDays = [...new Set(vetAvailability.map(a => a.day))];

            // Get reviews for this vet
            const vetReviews = reviewsWithOwners.filter(review => Number(review.vetId) === Number(vet.id));

            // Calculate average rating from reviews
            let rating = 0;
            if (vetReviews.length > 0) {
              const totalRating = vetReviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
              rating = totalRating / vetReviews.length;
            } else {
              rating = 4.5 + (Math.random() * 0.4); // Random rating between 4.5-4.9 as fallback
            }

            console.log(`Vet ${vet.name} (ID: ${vet.id}): availableDays = `, availableDays, 'reviews:', vetReviews.length, 'rating:', rating);

            // Deterministic coordinates if not in DB
            const getDeterministicCoords = (id, baseLat = 37.9838, baseLon = 23.7275) => {
              let hash = 0;
              const strId = String(id);
              for (let i = 0; i < strId.length; i++) {
                hash = ((hash << 5) - hash) + strId.charCodeAt(i);
                hash |= 0;
              }
              const latOffset = ((Math.abs(hash) % 1000) / 1000 * 0.3) - 0.15;
              const lonOffset = ((Math.abs(hash * 13) % 1000) / 1000 * 0.3) - 0.15;
              return { lat: baseLat + latOffset, lon: baseLon + lonOffset };
            };

            const fallbackCoords = getDeterministicCoords(vet.id);

            return {
              ...vet,
              name: vet.name || 'Άγνωστος',
              specialty: vet.specialization || 'Γενικός Κτηνίατρος',
              area: `${vet.clinicCity || 'Αθήνα'}, ${vet.clinicAddress || 'Άγνωστη διεύθυνση'}`,
              rating: rating,
              reviewCount: vetReviews.length,
              reviews: vetReviews,
              lat: vet.locationLat ? parseFloat(vet.locationLat) : fallbackCoords.lat,
              lon: vet.locationLon ? parseFloat(vet.locationLon) : fallbackCoords.lon,
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

  // Check for navigation state to open profile
  useEffect(() => {
    if (location.state?.openProfile && location.state?.vet) {
      setSelectedProfileVet(location.state.vet);
      setShowProfileModal(true);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle redirect from login (auto-open booking form)
  useEffect(() => {
    if (location.state?.bookingVetId && allVets.length > 0) {
      const vetToBook = allVets.find(v => String(v.id) === String(location.state.bookingVetId));
      if (vetToBook && currentUser?.userType === 'owner') {
        setBookingVet(vetToBook);
        setShowBookingForm(true);
        
        // Clear navigation state to avoid re-opening on manual refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location, allVets, currentUser]);

  // Helper function to normalize text for fuzzy matching (remove accents, normalize spacing)
  const normalizeText = (text) => {
    if (!text) return '';
    try {
      const str = String(text);
      const normalized = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
        .toLowerCase()
        .trim();
      return normalized;
    } catch (e) {
      console.error('Error normalizing text:', e, 'text:', text);
      return String(text).toLowerCase().trim();
    }
  };

  // Smart matching function for vet names
  const nameMatch = (vetName, filterValue) => {
    if (!filterValue || !vetName) return false;

    const vetNorm = normalizeText(String(vetName || ''));
    const filterNorm = normalizeText(String(filterValue || ''));

    // Exact match after normalization
    if (vetNorm === filterNorm) return true;

    // Partial match (one contains the other)
    if (vetNorm.includes(filterNorm) || filterNorm.includes(vetNorm)) return true;

    return false;
  };

  // Smart matching for area filter
  const areaMatch = (vetArea, filterArea) => {
    if (!filterArea || !vetArea) return false;

    const vetNorm = normalizeText(String(vetArea || ''));
    const filterNorm = normalizeText(String(filterArea || ''));

    // Check if vet area contains any part of the filter area
    const filterParts = filterNorm.split(',').map(p => p.trim());
    const vetParts = vetNorm.split(',').map(p => p.trim());

    const hasMatch = filterParts.some(filterPart =>
      vetParts.some(vetPart => vetPart.includes(filterPart) || filterPart.includes(vetPart))
    );

    return hasMatch;
  };

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
      service: '',
      maxPrice: '',
    });
    setLocationData(null);
    setCurrentPage(1);
  };

  // Filter vets based on selected filters
  const filteredVets = useMemo(() => {
    return allVets.filter(vet => {
      // Filter by name (search in both name and lastName) - using smart matching
      if (filters.searchName) {
        try {
          const fullName = `${vet.name || ''} ${vet.lastName || ''}`;
          if (!nameMatch(fullName, filters.searchName)) {
            return false;
          }
        } catch (e) {
          console.error('Error in name filter:', e);
          return false;
        }
      }

      // Filter by specialty
      if (filters.specialty) {
        const specialtyMap = {
          'general': 'Γενική Κτηνιατρική',
          'surgery': 'Χειρουργική',
          'dermatology': 'Δερματολογία',
          'cardiology': 'Καρδιολογία',
          'dentistry': 'Οδοντιατρική',
          'ophthalmology': 'Οφθαλμολογία'
        };
        const targetSpecialty = specialtyMap[filters.specialty];
        if (targetSpecialty && (!vet.specialty || !vet.specialty.includes(targetSpecialty))) {
          return false;
        }
      }

      // Filter by area/location - using smart matching
      if (filters.area) {
        if (!areaMatch(vet.area, filters.area)) {
          return false;
        }
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
        // Skip filter if no availableDays data exists
        if (!vet.availableDays || vet.availableDays.length === 0) {
          return false;
        }

        // Handle 'all' option - show vets with any availability
        if (filters.availability === 'all') {
          return true;
        }

        // Handle 'week' option - show vets with any availability
        if (filters.availability === 'week') {
          return true;
        }

        // Handle 'today' and 'tomorrow' options
        const availabilityMap = {
          'today': getTodayDay(),
          'tomorrow': getTomorrowDay()
        };

        const targetDay = availabilityMap[filters.availability] || filters.availability;

        // Check if vet has availability on specific day - case insensitive comparison
        const hasDay = vet.availableDays.some(day =>
          day.toLowerCase() === targetDay.toLowerCase()
        );

        if (!hasDay) {
          return false;
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
          // Determine which slots to check based on day filter
          let slotsToCheck = vet.availabilitySlots;

          if (filters.availability && filters.availability !== 'week' && filters.availability !== 'all') {
            // Map special day values to actual day names
            const availabilityMap = {
              'today': getTodayDay(),
              'tomorrow': getTomorrowDay()
            };
            const targetDay = availabilityMap[filters.availability] || filters.availability;

            // Filter slots by the selected day (case insensitive)
            slotsToCheck = vet.availabilitySlots.filter(slot =>
              slot.day.toLowerCase() === targetDay.toLowerCase()
            );
          }

          // If no slots match the day filter, vet doesn't match
          if (slotsToCheck.length === 0) {
            return false;
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

      // Filter by service
      if (filters.service) {
        const hasService = vet.services?.some(s => s.id === filters.service);
        if (!hasService) return false;
      }

      // Filter by max price
      if (filters.maxPrice) {
        const maxPrice = parseFloat(filters.maxPrice);
        if (filters.service) {
          // If a specific service is selected, check its price
          const service = vet.services?.find(s => s.id === filters.service);
          if (!service || service.price > maxPrice) return false;
        } else {
          // If no service selected, check if any service is below maxPrice
          const hasAffordableService = vet.services?.some(s => s.price <= maxPrice);
          if (!hasAffordableService) return false;
        }
      }

      return true;
    });
  }, [allVets, filters]);

  // Augment vets with display info (price, etc.) based on filters
  const augmentedVets = useMemo(() => {
    return filteredVets.map(vet => {
      let displayPrice = null;
      let displayService = null;

      if (filters.service) {
        const service = vet.services?.find(s => s.id === filters.service);
        if (service) {
          displayPrice = service.price;
          displayService = service.name;
        }
      } else if (vet.services && vet.services.length > 0) {
        // If no service selected, show starting price
        displayPrice = Math.min(...vet.services.map(s => s.price));
        displayService = 'από';
      }

      return {
        ...vet,
        displayPrice,
        displayService
      };
    });
  }, [filteredVets, filters.service]);

  const handleMarkerClick = (vet) => {
    setSelectedVet(selectedVet?.id === vet.id ? null : vet);
  };

  const handleViewProfile = (vet) => {
    setSelectedProfileVet(vet);
    setShowProfileModal(true);
  };

  const handleCloseAppointment = (vet) => {
    if (currentUser?.userType === 'owner') {
      // Show booking form inline instead of navigating away
      setBookingVet(vet);
      setShowBookingForm(true);
    } else {
      navigate(ROUTES.login, { 
        state: { 
          from: location.pathname,
          bookingVetId: vet.id 
        } 
      });
    }
  };

  const handleBookingClose = () => {
    setShowBookingForm(false);
    setBookingVet(null);
  };

  const handleBookingSuccess = (message) => {
    setShowBookingForm(false);
    setBookingVet(null);
    setNotification({ type: 'success', message: message || 'Τα ραντεβού σας καταχωρήθηκαν με επιτυχία!' });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setBookingVet(null);
    setNotification({ type: 'error', message: 'Η διαδικασία ακυρώθηκε.' });
    setTimeout(() => setNotification(null), 5000);
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

  const serviceOptions = [
    { value: '', label: 'Επιλέξτε υπηρεσία...' },
    { value: 'checkup', label: 'Γενικός Έλεγχος' },
    { value: 'vaccination', label: 'Εμβολιασμός' },
    { value: 'dental', label: 'Καθαρισμός Δοντιών' },
    { value: 'surgery', label: 'Χειρουργική Επέμβαση' },
    { value: 'blood_test', label: 'Αιματολογικές Εξετάσεις' },
    { value: 'ultrasound', label: 'Υπέρηχος' },
    { value: 'cardiology', label: 'Καρδιολογικός Έλεγχος' },
    { value: 'dermatology', label: 'Δερματολογική Εξέταση' },
    { value: 'ophthalmology', label: 'Οφθαλμολογικός Έλεγχος' }
  ];

  const priceOptions = [
    { value: '', label: 'Οποιαδήποτε τιμή' },
    { value: '30', label: 'Έως 30€' },
    { value: '50', label: 'Έως 50€' },
    { value: '80', label: 'Έως 80€' },
    { value: '100', label: 'Έως 100€' },
    { value: '150', label: 'Έως 150€' }
  ];

  return (
    <PageLayout title="Αναζήτηση Κτηνιάτρων">
      <div className="vet-search-map-page">
        {/* Sidebar Filters */}
        <SearchSidebar
          title="Φίλτρα Αναζήτησης"
          filters={filters}
          onSearch={() => setCurrentPage(1)}
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

          {/* Service Filter */}
          <div className="filter-group">
            <label className="filter-label">Υπηρεσία</label>
            <CustomSelect
              name="service"
              value={filters.service}
              onChange={(val) => handleSelectChange('service', val)}
              options={serviceOptions}
              variant="citizen"
            />
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <label className="filter-label">Μέγιστη Τιμή</label>
            <CustomSelect
              name="maxPrice"
              value={filters.maxPrice}
              onChange={(val) => handleSelectChange('maxPrice', val)}
              options={priceOptions}
              variant="citizen"
            />
          </div>
        </SearchSidebar>

        {/* Main Map Area */}
        <main className={`map-container ${showBookingForm ? 'has-booking-form' : ''}`}>
          {showBookingForm ? (
            <>
              <BookingForm
                vet={bookingVet}
                onClose={handleBookingClose}
                onSuccess={handleBookingSuccess}
                onCancel={handleBookingCancel}
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
                  markers={augmentedVets}
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
                  items={augmentedVets.slice(startIndex, endIndex)}
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

        <Notification
          isVisible={!!notification}
          message={notification?.message}
          type={notification?.type}
        />

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
