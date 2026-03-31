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
  PawPrint,
  Check,
  Plus,
  X
} from 'lucide-react';
import CustomSelect from '../common/forms/CustomSelect';
import ConfirmModal from '../common/modals/ConfirmModal';
import Avatar from '../common/Avatar';
import { ROUTES, SERVICE_LABELS } from '../../utils/constants';
import './BookingForm.css';

const BookingForm = ({
  vet: prefilledVet = null,
  onClose,
  onSuccess,
  onCancel,
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
      setSearchQuery('');
      setShowSearchResults(false);
    }
  }, [prefilledVet]);

  // Calendar state (shared view but separate selection per booking)
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Multi-booking state
  const [bookings, setBookings] = useState([
    {
      id: Date.now(),
      selectedPet: '',
      serviceType: '',
      notes: '',
      selectedSlot: null,
      isNewPet: false,
      newPetName: '',
      newPetType: ''
    }
  ]);

  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [vetDaysOff, setVetDaysOff] = useState([]);

  // Active booking index for calendar selection
  const [activeBookingIndex, setActiveBookingIndex] = useState(0);

  const serviceOptions = selectedVet?.services && selectedVet.services.length > 0
    ? selectedVet.services.map(s => ({
        value: s.id,
        label: `${s.name} (${s.price}€)`
      }))
    : Object.entries(SERVICE_LABELS).map(([value, label]) => ({
        value,
        label
      }));

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
          const response = await fetch('http://localhost:5000/pets');
          const allPets = await response.json();
          // Filter pets that belong to this owner (use String comparison since IDs are strings)
          const ownerPets = allPets.filter(pet => String(pet.ownerId) === String(currentUser.id));
          setUserPets(ownerPets);
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
      }
    };
    fetchUserPets();
  }, []);

  // Fetch availability and booked appointments when vet is selected
  useEffect(() => {
    const fetchAvailabilityAndBookings = async () => {
      if (!selectedVet) {
        setVetAvailability([]);
        setBookedSlots([]);
        return;
      }
      try {
        // Fetch availability
        const availResponse = await fetch(`http://localhost:5000/availability?vetId=${selectedVet.id}`);
        const availData = await availResponse.json();
        setVetAvailability(availData);

        // Fetch booked appointments (pending or confirmed only)
        const appointmentsResponse = await fetch(`http://localhost:5000/appointments?vetId=${selectedVet.id}`);
        const appointments = await appointmentsResponse.json();

        // Fetch days off
        const daysOffResponse = await fetch(`http://localhost:5000/daysOff?vetId=${selectedVet.id}`);
        if (daysOffResponse.ok) {
          const daysOffData = await daysOffResponse.json();
          setVetDaysOff(daysOffData);
        }

        // Extract booked time slots (only pending and confirmed appointments)
        const booked = appointments
          .filter(apt => apt.status === 'pending' || apt.status === 'confirmed')
          .map(apt => {
            // Extract the hour from the time (e.g., "10:00 - 11:00" -> 10)
            const timeMatch = apt.time?.match(/(\d{1,2}):/);
            const hour = timeMatch ? parseInt(timeMatch[1]) : null;
            return {
              date: apt.date,
              hour: hour
            };
          });

        setBookedSlots(booked);
      } catch (err) {
        console.error('Error fetching availability or appointments:', err);
        setVetAvailability([]);
        setBookedSlots([]);
        setVetDaysOff([]);
      }
    };
    fetchAvailabilityAndBookings();
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
    setBookings([
      {
        id: Date.now(),
        selectedPet: '',
        serviceType: '',
        notes: '',
        selectedSlot: null,
        isNewPet: false,
        newPetName: '',
        newPetType: ''
      }
    ]);
    setActiveBookingIndex(0);
  };

  const handleClearVet = () => {
    setSelectedVet(null);
    setBookings([
      {
        id: Date.now(),
        selectedPet: '',
        serviceType: '',
        notes: '',
        selectedSlot: null,
        isNewPet: false,
        newPetName: '',
        newPetType: ''
      }
    ]);
    setActiveBookingIndex(0);
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
  const getTimeSlotsForDay = (date, booking) => {
    const serviceType = booking?.serviceType;
    // Don't show any slots if no service type is selected
    if (!serviceType) {
      return [];
    }

    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Find all availability slots for this day of the week and filter by selected service type
    let dayAvailabilitySlots = vetAvailability.filter(
      a => a.day?.toLowerCase() === dayName && a.serviceType === serviceType
    );

    if (dayAvailabilitySlots.length === 0) {
      return [];
    }

    const dateString = date.toISOString().split('T')[0];

    // If this date falls within any "Days Off" range, return no slots
    const isDayOff = vetDaysOff.some(range => {
      const start = range.date;
      const end = range.endDate || range.date; // Use start if no end date
      return dateString >= start && dateString <= end;
    });

    if (isDayOff) {
      return [];
    }

    const slots = [];

    // For each availability slot on this day, generate hourly time slots
    dayAvailabilitySlots.forEach(availability => {
      const [startHour] = (availability.startTime || '09:00').split(':').map(Number);
      const [endHour] = (availability.endTime || '17:00').split(':').map(Number);

      for (let hour = startHour; hour < endHour; hour++) {
        // Check if this slot is already booked
        const isBooked = bookedSlots.some(
          slot => slot.date === dateString && slot.hour === hour
        );

        if (!isBooked) {
          const startTime = `${String(hour).padStart(2, '0')}:00`;
          const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
          slots.push({
            id: `${dateString}-${startTime}`,
            date: dateString,
            startTime,
            endTime,
            displayTime: `${startTime} - ${endTime}`,
            serviceType: availability.serviceType
          });
        }
      }
    });

    return slots;
  };

  const handleSelectSlot = (slot) => {
    setBookings(prev => {
      const newBookings = [...prev];
      newBookings[activeBookingIndex] = {
        ...newBookings[activeBookingIndex],
        selectedSlot: slot
      };
      return newBookings;
    });
  };

  const isSlotSelected = (slot, bookingIndex) => {
    return bookings[bookingIndex]?.selectedSlot?.id === slot.id;
  };

  const resetForm = () => {
    if (showVetSearch) {
      setSelectedVet(null);
    }
    setBookings([
      {
        id: Date.now(),
        selectedPet: '',
        serviceType: '',
        notes: '',
        selectedSlot: null,
        isNewPet: false,
        newPetName: '',
        newPetType: ''
      }
    ]);
    setActiveBookingIndex(0);
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

    // Separate bookings into complete, partial, and empty
    const completeBookings = [];
    const isBookingEmpty = (b) => !b.selectedPet && !b.serviceType && !b.selectedSlot;

    for (let i = 0; i < bookings.length; i++) {
      const b = bookings[i];
      // Skip completely empty entries
      if (isBookingEmpty(b)) continue;

      // Validate partially filled entries
      if (!b.selectedPet) {
        setError(`Παρακαλώ επιλέξτε κατοικίδιο για το ραντεβού ${i + 1}`);
        return;
      }
      if (b.selectedPet === 'new') {
        if (!b.newPetName || !b.newPetType) {
          setError(`Παρακαλώ συμπληρώστε τα στοιχεία του νέου κατοικιδίου για το ραντεβού ${i + 1}`);
          return;
        }
      }
      if (!b.serviceType) {
        setError(`Παρακαλώ επιλέξτε τύπο υπηρεσίας για το ραντεβού ${i + 1}`);
        return;
      }
      if (!b.selectedSlot) {
        setError(`Παρακαλώ επιλέξτε ημερομηνία και ώρα για το ραντεβού ${i + 1}`);
        return;
      }
      completeBookings.push(b);
    }

    if (completeBookings.length === 0) {
      setError('Παρακαλώ συμπληρώστε τουλάχιστον ένα ραντεβού');
      return;
    }

    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const appointmentPromises = completeBookings.map(async (b) => {
        let petName = '';
        let petId = null;
        let petSpecies = '';
        let petBreed = '';

        if (b.selectedPet === 'new') {
          petName = b.newPetName;
          petSpecies = b.newPetType || '';
          petBreed = b.newPetBreed || '';
          // In a real app, you might create the pet record here too
        } else {
          const pet = userPets.find(p => String(p.id) === String(b.selectedPet));
          petName = pet?.name || '';
          petId = pet?.id;
          petSpecies = pet?.type || '';
          petBreed = pet?.breed || '';
        }

        const appointmentData = {
          vetId: selectedVet.id,
          vetName: `${selectedVet.name} ${selectedVet.lastName || ''}`.trim(),
          ownerId: currentUser.id,
          ownerName: currentUser.name || currentUser.username,
          ownerLastName: currentUser.lastName || '',
          ownerPhone: currentUser.phone || '',
          petId,
          petName, // Store pet name for new pets
          petSpecies, // Store pet species/type
          petBreed, // Store pet breed
          date: b.selectedSlot.date,
          time: b.selectedSlot.displayTime,
          serviceType: b.serviceType,
          notes: b.notes,
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

        return await response.json();
      });

      const createdAppointments = await Promise.all(appointmentPromises);

      // Create notifications for each appointment
      for (let i = 0; i < createdAppointments.length; i++) {
        const apt = createdAppointments[i];
        const b = completeBookings[i];

        let petName = apt.petName;
        if (!petName && b.selectedPet !== 'new') {
          const pet = userPets.find(p => String(p.id) === String(b.selectedPet));
          petName = pet?.name || '';
        }

        const vetNotificationData = {
          userId: selectedVet.id,
          userType: 'vet',
          type: 'new_appointment',
          title: 'Νέο αίτημα ραντεβού',
          data: {
            ownerName: currentUser.name || currentUser.username,
            appointmentDate: b.selectedSlot.date,
            appointmentTime: b.selectedSlot.displayTime,
            petName: petName,
            appointmentId: apt.id
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
      }

      // Trigger immediate notification badge update
      window.dispatchEvent(new Event('notificationCreated'));

      resetForm();

      if (onSuccess) {
        onSuccess('Τα ραντεβού σας καταχωρήθηκαν με επιτυχία!');
      } else {
        navigate(ROUTES.owner.appointments, {
          state: { message: 'Τα ραντεβού σας καταχωρήθηκαν με επιτυχία!' }
        });
      }
    } catch (err) {
      console.error('Error creating appointments:', err);
      setError('Σφάλμα κατά την καταχώρηση των ραντεβού. Παρακαλώ δοκιμάστε ξανά.');
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
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const getInitials = (name, lastName) => {
    const firstInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
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
                <div className="booking-form__vet-avatar-container">
                  <Avatar 
                    src={selectedVet.avatar} 
                    name={selectedVet.name} 
                    lastName={selectedVet.lastName}
                    size="lg"
                  />
                </div>
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
                        <div className="booking-form__result-avatar-container">
                          <Avatar 
                            src={vet.avatar} 
                            name={vet.name} 
                            lastName={vet.lastName}
                            size="md"
                          />
                        </div>
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

        {/* Multi-Pet Bookings */}
        {selectedVet && bookings.map((booking, index) => (
          <div key={booking.id} className="booking-form__appointment-entry">
            <div className="booking-form__entry-header">
              <h4 className="booking-form__entry-title">
                {bookings.length > 1 ? `Ραντεβού για το ${index + 1}ο Κατοικίδιο` : 'Στοιχεία Ραντεβού'}
              </h4>
              {bookings.length > 1 && (
                <button
                  className="booking-form__remove-entry-btn"
                  onClick={() => {
                    const newBookings = bookings.filter((_, i) => i !== index);
                    setBookings(newBookings);
                    if (activeBookingIndex >= newBookings.length) {
                      setActiveBookingIndex(newBookings.length - 1);
                    }
                  }}
                >
                  <X size={14} /> Αφαίρεση
                </button>
              )}
            </div>

            {/* Pet selection for this booking */}
            <div className="booking-form__section">
              <h3 className="booking-form__section-title">
                <PawPrint size={18} />
                Επιλογή Κατοικιδίου
              </h3>
              <div className="booking-form__form-group">
                <CustomSelect
                  value={booking.selectedPet}
                  onChange={(val) => {
                    setBookings(prev => {
                      const nb = [...prev];
                      nb[index] = { ...nb[index], selectedPet: val, isNewPet: val === 'new' };
                      return nb;
                    });
                  }}
                  placeholder="Επιλέξτε κατοικίδιο"
                  options={[
                    ...userPets.map(pet => ({
                      value: String(pet.id),
                      label: `${pet.name} (${pet.type})`
                    })),
                    { value: 'new', label: '+ Νέο Κατοικίδιο' }
                  ]}
                  variant="owner"
                />
              </div>

              {booking.isNewPet && (
                <div className="booking-form__new-pet-fields">
                  <div className="booking-form__form-group">
                    <label className="booking-form__label">Όνομα Νέου Κατοικιδίου</label>
                    <input
                      type="text"
                      className="booking-form__input"
                      value={booking.newPetName}
                      onChange={(e) => {
                        setBookings(prev => {
                          const nb = [...prev];
                          nb[index] = { ...nb[index], newPetName: e.target.value };
                          return nb;
                        });
                      }}
                      placeholder="π.χ. Rex"
                    />
                  </div>
                  <div className="booking-form__form-group">
                    <label className="booking-form__label">Είδος</label>
                    <CustomSelect
                      value={booking.newPetType}
                      onChange={(val) => {
                        setBookings(prev => {
                          const nb = [...prev];
                          nb[index] = { ...nb[index], newPetType: val };
                          return nb;
                        });
                      }}
                      placeholder="Επιλέξτε είδος"
                      options={[
                        { value: 'Σκύλος', label: 'Σκύλος' },
                        { value: 'Γάτα', label: 'Γάτα' },
                        { value: 'Πτηνό', label: 'Πτηνό' },
                        { value: 'Άλλο', label: 'Άλλο' }
                      ]}
                      variant="owner"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Service selection for this booking */}
            <div className="booking-form__section">
              <h3 className="booking-form__section-title">
                <FileText size={18} />
                Επιλογή Υπηρεσίας
              </h3>
              <div className="booking-form__form-group">
                <CustomSelect
                  value={booking.serviceType}
                  onChange={(val) => {
                    setBookings(prev => {
                      const nb = [...prev];
                      nb[index] = { ...nb[index], serviceType: val, selectedSlot: null };
                      return nb;
                    });
                  }}
                  placeholder="Επιλέξτε υπηρεσία"
                  options={serviceOptions}
                  variant="owner"
                />
              </div>
            </div>

            {/* Calendar selection for this booking */}
            <div className="booking-form__section">
              <h3 className="booking-form__section-title">
                <Calendar size={18} />
                Επιλογή Ημερομηνίας & Ώρας
              </h3>

              {!booking.serviceType && (
                <div className="booking-form__info-message">
                  Παρακαλώ επιλέξτε πρώτα τον τύπο υπηρεσίας για να δείτε τις διαθέσιμες ημερομηνίες και ώρες.
                </div>
              )}

              {booking.serviceType && (
                <div className="booking-form__calendar-wrapper" onClick={() => setActiveBookingIndex(index)}>
                  <div className={`booking-form__calendar ${activeBookingIndex === index ? 'booking-form__calendar--active' : ''}`}>
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

                    {/* Availability Legend removed */}

                    {/* Week View */}
                    {viewMode === 'week' && (
                      <div className="booking-form__week-calendar">
                        {getWeekDays().map((day, dayIdx) => {
                          const slots = getTimeSlotsForDay(day, booking);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const currentDay = new Date(day);
                          currentDay.setHours(0, 0, 0, 0);

                          const isToday = currentDay.getTime() === today.getTime();
                          const isPast = currentDay < today;

                          return (
                            <div key={dayIdx} className={`booking-form__day-column ${isToday ? 'booking-form__day-column--today' : ''}`}>
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
                                      className={`booking-form__slot ${isSlotSelected(slot, index) ? 'booking-form__slot--selected' : ''}`}
                                      onClick={() => {
                                        setActiveBookingIndex(index);
                                        handleSelectSlot(slot);
                                      }}
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

                            const slots = getTimeSlotsForDay(selectedDate, booking);
                            if (slots.length === 0) {
                              return <div className="booking-form__no-slots">Ο κτηνίατρος δεν είναι διαθέσιμος αυτή την ημέρα</div>;
                            }

                            return slots.map(slot => (
                              <button
                                key={slot.id}
                                className={`booking-form__slot booking-form__slot--large ${isSlotSelected(slot, index) ? 'booking-form__slot--selected' : ''}`}
                                onClick={() => {
                                  setActiveBookingIndex(index);
                                  handleSelectSlot(slot);
                                }}
                              >
                                <Clock size={16} />
                                {slot.displayTime}
                                {isSlotSelected(slot, index) && <Check size={16} className="booking-form__slot-check" />}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {booking.selectedSlot && (
                      <div className="booking-form__selected-slot-info">
                        <Check size={18} />
                        Επιλεγμένη ώρα: <strong>{booking.selectedSlot.displayTime}</strong> στις <strong>{new Date(booking.selectedSlot.date).toLocaleDateString('el-GR')}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section for this booking */}
            <div className="booking-form__section">
              <h3 className="booking-form__section-title">
                <FileText size={18} />
                Σημειώσεις
              </h3>
              <div className="booking-form__form-group">
                <textarea
                  className="booking-form__textarea"
                  value={booking.notes}
                  onChange={(e) => {
                    setBookings(prev => {
                      const nb = [...prev];
                      nb[index] = { ...nb[index], notes: e.target.value };
                      return nb;
                    });
                  }}
                  placeholder="Περιγράψτε το λόγο της επίσκεψης ή άλλες σημειώσεις..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}

        {selectedVet && (
          <button
            className="booking-form__add-pet-btn"
            onClick={() => setBookings([...bookings, {
              id: Date.now(),
              selectedPet: '',
              serviceType: '',
              notes: '',
              selectedSlot: null,
              isNewPet: false,
              newPetName: '',
              newPetType: ''
            }])}
          >
            <Plus size={16} /> Προσθήκη άλλου κατοικιδίου
          </button>
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
            disabled={loading || !selectedVet || !bookings.some(b => b.selectedPet && b.serviceType && b.selectedSlot)}
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
