import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Stethoscope,
  FileText,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import CustomSelect from '../common/forms/CustomSelect';
import ConfirmModal from '../common/modals/ConfirmModal';
import { ROUTES } from '../../utils/constants';
import './BookingForm.css';

const BookingForm = ({
  vet: prefilledVet = null,
  onClose,
  onSuccess,
  inline = false,
  showVetSearch = true
}) => {
  const navigate = useNavigate();

  // Booking form state
  const [selectedVet, setSelectedVet] = useState(prefilledVet);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allVets, setAllVets] = useState([]);
  const [vetAvailability, setVetAvailability] = useState([]);

  // Update selected vet when prop changes
  useEffect(() => {
    if (prefilledVet) {
      setSelectedVet(prefilledVet);
      setSelectedSlot(null);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  }, [prefilledVet]);

  // Calendar state
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form state
  const [serviceType, setServiceType] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [userPets, setUserPets] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const serviceOptions = [
    { value: 'Εμβολιασμός', label: 'Εμβολιασμός' },
    { value: 'Γενική Εξέταση', label: 'Γενική Εξέταση' },
    { value: 'Χειρουργείο', label: 'Χειρουργείο' },
    { value: 'Θεραπεία', label: 'Θεραπεία' },
    { value: 'Οδοντιατρική', label: 'Οδοντιατρική' },
    { value: 'Επείγον Περιστατικό', label: 'Επείγον Περιστατικό' },
    { value: 'Άλλο', label: 'Άλλο' },
  ];

  // Fetch all vets for search
  useEffect(() => {
    if (!showVetSearch && prefilledVet) return;

    const fetchVets = async () => {
      try {
        const response = await fetch('http://localhost:5000/users?userType=vet');
        const data = await response.json();
        setAllVets(data);
      } catch (err) {
        console.error('Error fetching vets:', err);
      }
    };
    fetchVets();
  }, [showVetSearch, prefilledVet]);

  // Fetch user's pets
  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id) {
          const response = await fetch(`http://localhost:5000/pets?ownerId=${currentUser.id}`);
          const data = await response.json();
          setUserPets(data);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
      }
    };
    fetchUserPets();
  }, []);

  // Fetch availability when vet is selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedVet) {
        setVetAvailability([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/availability?vetId=${selectedVet.id}`);
        const data = await response.json();
        setVetAvailability(data);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setVetAvailability([]);
      }
    };
    fetchAvailability();
  }, [selectedVet]);

  // Search vets
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allVets.filter(vet =>
        vet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vet.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vet.clinicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vet.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, allVets]);

  const handleSelectVet = (vet) => {
    setSelectedVet(vet);
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedSlot(null);
  };

  const handleClearVet = () => {
    setSelectedVet(null);
    setSelectedSlot(null);
    setVetAvailability([]);
  };

  // Calendar helpers
  const getWeekDays = () => {
    const days = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayName = (date) => {
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    return days[date.getDay()];
  };

  const getMonthName = (date) => {
    const months = ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου',
      'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'];
    return months[date.getMonth()];
  };

  const formatDateRange = () => {
    if (viewMode === 'day') {
      return `${selectedDate.getDate()} ${getMonthName(selectedDate)} ${selectedDate.getFullYear()}`;
    }
    const weekDays = getWeekDays();
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.getDate()}/${firstDay.getMonth() + 1} - ${lastDay.getDate()}/${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    const daysToSubtract = viewMode === 'day' ? 1 : 7;
    newDate.setDate(selectedDate.getDate() - daysToSubtract);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    const daysToAdd = viewMode === 'day' ? 1 : 7;
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  // Generate time slots for a day
  const getTimeSlotsForDay = (date) => {
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Find all availability slots for this day of the week
    const dayAvailabilitySlots = vetAvailability.filter(a => a.day?.toLowerCase() === dayName);

    if (dayAvailabilitySlots.length === 0) {
      return [];
    }

    const slots = [];
    
    // For each availability slot on this day, generate hourly time slots
    dayAvailabilitySlots.forEach(availability => {
      const [startHour] = (availability.startTime || '09:00').split(':').map(Number);
      const [endHour] = (availability.endTime || '17:00').split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${String(hour).padStart(2, '0')}:00`;
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
        slots.push({
          id: `${date.toISOString().split('T')[0]}-${startTime}`,
          date: date.toISOString().split('T')[0],
          startTime,
          endTime,
          displayTime: `${startTime} - ${endTime}`,
          serviceType: availability.serviceType
        });
      }
    });

    return slots;
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const isSlotSelected = (slot) => {
    return selectedSlot?.id === slot.id;
  };

  const resetForm = () => {
    if (showVetSearch) {
      setSelectedVet(null);
    }
    setSelectedSlot(null);
    setServiceType('');
    setNotes('');
    setSelectedPet('');
    setVetAvailability([]);
    setSearchQuery('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!selectedVet) {
      setError('Παρακαλώ επιλέξτε κτηνίατρο');
      return;
    }
    if (!selectedSlot) {
      setError('Παρακαλώ επιλέξτε ημερομηνία και ώρα');
      return;
    }
    if (!serviceType) {
      setError('Παρακαλώ επιλέξτε τύπο υπηρεσίας');
      return;
    }
    if (!selectedPet) {
      setError('Παρακαλώ επιλέξτε κατοικίδιο');
      return;
    }

    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // Compare both as strings to handle both numeric and string IDs
      const pet = userPets.find(p => String(p.id) === String(selectedPet));

      const appointmentData = {
        vetId: selectedVet.id,
        vetName: `${selectedVet.name} ${selectedVet.lastName || ''}`.trim(),
        ownerId: currentUser.id,
        ownerName: currentUser.name || currentUser.username,
        ownerPhone: currentUser.phone || '',
        petId: pet?.id,
        petName: pet?.name || '',
        petSpecies: pet?.species || '',
        petBreed: pet?.breed || '',
        date: selectedSlot.date,
        time: selectedSlot.displayTime,
        serviceType,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      const createdAppointment = await response.json();

      // Create notification for vet
      const vetNotificationData = {
        userId: selectedVet.id,
        userType: 'vet',
        type: 'new_appointment',
        title: 'Νέο αίτημα ραντεβού',
        data: {
          ownerName: currentUser.name || currentUser.username,
          appointmentDate: selectedSlot.date,
          appointmentTime: selectedSlot.displayTime,
          petName: pet?.name || '',
          appointmentId: createdAppointment.id
        },
        date: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString()
      };

      await fetch('http://localhost:5000/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vetNotificationData)
      }).catch(err => console.error('Error creating vet notification:', err));

      resetForm();

      if (onSuccess) {
        onSuccess('Το ραντεβού σας καταχωρήθηκε με επιτυχία!');
      } else {
        navigate(ROUTES.owner.appointments, {
          state: { message: 'Το ραντεβού σας καταχωρήθηκε με επιτυχία!' }
        });
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Σφάλμα κατά την καταχώρηση του ραντεβού. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    resetForm();
    setShowCancelModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  return (
    <div className={`booking-form ${inline ? 'booking-form--inline' : ''}`}>
      {/* Header */}
      <div className="booking-form__header">
        {inline && onClose && (
          <button
            type="button"
            className="booking-form__close inline-form-close"
            onClick={handleCancel}
            aria-label="Κλείσιμο φόρμας"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="booking-form__error">
          {error}
        </div>
      )}

      <div className="booking-form__content">
        {/* Vet Selection */}
        <div className="booking-form__section">
          <h3 className="booking-form__section-title">
            <Stethoscope size={18} />
            Κτηνίατρος
          </h3>

          {selectedVet ? (
            <div className="booking-form__selected-vet">
              <div className="booking-form__vet-card">
                <img
                  src={selectedVet.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150'}
                  alt={selectedVet.name}
                  className="booking-form__vet-avatar"
                />
                <div className="booking-form__vet-info">
                  <h4 className="booking-form__vet-name">
                    {selectedVet.name} {selectedVet.lastName || ''}
                  </h4>
                  <p className="booking-form__vet-specialty">
                    {selectedVet.specialization || selectedVet.specialty || 'Γενικός Κτηνίατρος'}
                  </p>
                  <div className="booking-form__vet-details">
                    <span className="booking-form__vet-detail">
                      <MapPin size={14} />
                      {selectedVet.clinicCity || selectedVet.area || 'Δεν διατίθεται'}
                    </span>
                    {selectedVet.rating && (
                      <span className="booking-form__vet-detail">
                        <Star size={14} />
                        {typeof selectedVet.rating === 'number' ? selectedVet.rating.toFixed(1) : selectedVet.rating}
                      </span>
                    )}
                  </div>
                </div>
                {showVetSearch && (
                  <button
                    className="booking-form__change-vet-btn"
                    onClick={handleClearVet}
                  >
                    <X size={16} />
                    Αλλαγή
                  </button>
                )}
              </div>
            </div>
          ) : showVetSearch ? (
            <div className="booking-form__search-section">
              <div className="booking-form__search-wrapper">
                <Search size={18} className="booking-form__search-icon" />
                <input
                  type="text"
                  className="booking-form__search-input"
                  placeholder="Αναζήτηση κτηνιάτρου (με το όνομα ή επώνυμό του)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {showSearchResults && (
                <div className="booking-form__search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map(vet => (
                      <div
                        key={vet.id}
                        className="booking-form__search-result"
                        onClick={() => handleSelectVet(vet)}
                      >
                        <img
                          src={vet.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150'}
                          alt={vet.name}
                          className="booking-form__result-avatar"
                        />
                        <div className="booking-form__result-info">
                          <span className="booking-form__result-name">
                            {vet.name} {vet.lastName || ''}
                          </span>
                          <span className="booking-form__result-specialty">
                            {vet.specialization || 'Γενικός Κτηνίατρος'}
                          </span>
                        </div>
                        <span className="booking-form__result-location">
                          <MapPin size={14} />
                          {vet.clinicCity || ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="booking-form__no-results">
                      Δεν βρέθηκαν κτηνίατροι
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="booking-form__no-vet">
              Δεν έχει επιλεγεί κτηνίατρος
            </div>
          )}
        </div>

        {/* Calendar Section */}
        {selectedVet && (
          <div className="booking-form__section">
            <h3 className="booking-form__section-title">
              <Calendar size={18} />
              Επιλογή Ημερομηνίας & Ώρας
            </h3>

            <div className="booking-form__calendar">
              <div className="booking-form__view-controls">
                <div className="booking-form__view-buttons">
                  <button
                    className={`booking-form__view-btn ${viewMode === 'day' ? 'booking-form__view-btn--active' : ''}`}
                    onClick={() => setViewMode('day')}
                  >
                    Ημέρα
                  </button>
                  <button
                    className={`booking-form__view-btn ${viewMode === 'week' ? 'booking-form__view-btn--active' : ''}`}
                    onClick={() => setViewMode('week')}
                  >
                    Εβδομάδα
                  </button>
                </div>

                <div className="booking-form__date-navigation">
                  <button className="booking-form__nav-btn" onClick={handlePreviousWeek}>
                    <ChevronLeft size={20} />
                  </button>
                  <span className="booking-form__date-range">{formatDateRange()}</span>
                  <button className="booking-form__nav-btn" onClick={handleNextWeek}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Week View */}
              {viewMode === 'week' && (
                <div className="booking-form__week-calendar">
                  {getWeekDays().map((day, index) => {
                    const slots = getTimeSlotsForDay(day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const currentDay = new Date(day);
                    currentDay.setHours(0, 0, 0, 0);

                    const isToday = currentDay.getTime() === today.getTime();
                    const isPast = currentDay < today;

                    return (
                      <div key={index} className="booking-form__day-column">
                        <div className={`booking-form__day-header ${isToday ? 'booking-form__day-header--today' : ''} ${isPast ? 'booking-form__day-header--past' : ''}`}>
                          <div className="booking-form__day-name">{getDayName(day)}</div>
                          <div className="booking-form__day-number">{day.getDate()}</div>
                        </div>

                        <div className="booking-form__day-slots">
                          {slots.length === 0 ? (
                            <div className="booking-form__no-slots">
                              Μη διαθέσιμος
                            </div>
                          ) : isPast ? (
                            <div className="booking-form__no-slots">
                              Παρελθούσα ημέρα
                            </div>
                          ) : (
                            slots.map(slot => (
                              <button
                                key={slot.id}
                                className={`booking-form__slot ${isSlotSelected(slot) ? 'booking-form__slot--selected' : ''}`}
                                onClick={() => handleSelectSlot(slot)}
                              >
                                <Clock size={12} />
                                {slot.displayTime}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Day View */}
              {viewMode === 'day' && (
                <div className="booking-form__day-view">
                  <h4 className="booking-form__day-title">
                    Διαθέσιμες ώρες για {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                  </h4>
                  <div className="booking-form__day-slots-grid">
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const currentDay = new Date(selectedDate);
                      currentDay.setHours(0, 0, 0, 0);
                      const isPast = currentDay < today;

                      if (isPast) {
                        return <div className="booking-form__no-slots">Παρελθούσα ημέρα</div>;
                      }

                      const slots = getTimeSlotsForDay(selectedDate);
                      if (slots.length === 0) {
                        return <div className="booking-form__no-slots">Ο κτηνίατρος δεν είναι διαθέσιμος αυτή την ημέρα</div>;
                      }

                      return slots.map(slot => (
                        <button
                          key={slot.id}
                          className={`booking-form__slot booking-form__slot--large ${isSlotSelected(slot) ? 'booking-form__slot--selected' : ''}`}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          <Clock size={16} />
                          {slot.displayTime}
                          {isSlotSelected(slot) && <Check size={16} className="booking-form__slot-check" />}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {selectedSlot && (
                <div className="booking-form__selected-slot-info">
                  <Check size={18} />
                  Επιλεγμένη ώρα: <strong>{selectedSlot.date}</strong> στις <strong>{selectedSlot.displayTime}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service & Notes Section */}
        {selectedVet && (
          <div className="booking-form__section">
            <h3 className="booking-form__section-title">
              <FileText size={18} />
              Λεπτομέρειες Ραντεβού
            </h3>

            <div className="booking-form__form-grid">
              <div className="booking-form__form-group">
                <label className="booking-form__label">
                  Κατοικίδιο <span className="booking-form__required"> *</span>
                </label>
                <CustomSelect
                  value={selectedPet}
                  onChange={setSelectedPet}
                  placeholder="Επιλέξτε κατοικίδιο"
                  options={userPets.map(pet => ({
                    value: String(pet.id),
                    label: `${pet.name} (${pet.species})`
                  }))}
                  variant="owner"
                />
              </div>

              <div className="booking-form__form-group">
                <label className="booking-form__label">
                  Τύπος Υπηρεσίας <span className="booking-form__required"> *</span>
                </label>
                <CustomSelect
                  value={serviceType}
                  onChange={setServiceType}
                  placeholder="Επιλέξτε υπηρεσία"
                  options={serviceOptions}
                  variant="owner"
                />
              </div>
            </div>

            <div className="booking-form__form-group">
              <label className="booking-form__label">Σημειώσεις (προαιρετικό)</label>
              <textarea
                className="booking-form__textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Περιγράψτε το λόγο της επίσκεψης ή άλλες σημειώσεις..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="booking-form__actions">
          {selectedVet && (
            <button
              className="booking-form__btn booking-form__btn--secondary"
              onClick={handleCancel}
            >
              {inline ? 'Ακύρωση' : <><X size={18} /> Ακύρωση</>}
            </button>
          )}
          <button
            className="booking-form__btn booking-form__btn--primary"
            onClick={handleSubmit}
            disabled={loading || !selectedVet || !selectedSlot || !serviceType || !selectedPet}
          >
            {loading ? 'Καταχώρηση...' : 'Κλείσιμο Ραντεβού'}
            <Check size={18} />
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Είστε σίγουροι ότι θέλετε να ακυρώσετε τη συμπλήρωση του αιτήματος για ραντεβού;"
        description="Όλα τα στοιχεία που έχετε συμπληρώσει θα διαγραφούν."
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, ακύρωση"
        onCancel={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        isDanger={true}
      />
    </div>
  );
};

export default BookingForm;
