import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, MapPin, Calendar, PawPrint, X } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import LocationPicker from '../../components/common/forms/LocationPicker';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import Notification from '../../components/common/modals/Notification';

import MicrochipSearch from '../../components/common/forms/MicrochipSearch';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES } from '../../utils/constants';
import './FoundPetForm.css';

const FoundPetForm = ({ inline = false, onClose = null, prefill = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Determine variant based on logged-in user type, not route
  const getVariant = () => {
    if (!currentUser) return 'citizen';
    if (currentUser.userType === 'owner') return 'owner';
    if (currentUser.userType === 'vet') return 'vet';
    return 'citizen';
  };

  const variant = getVariant();
  const isOwner = currentUser?.userType === 'owner';

  // Get pet details from prefill prop or navigation state if coming from LostPetDetails
  const navigationState = location.state || {};
  const navigationPetData = (prefill && prefill.petDetails) || navigationState.petDetails || {};

  // Get microchip ID if passed directly (for unregistered pets)
  const navigationMicrochipId = (prefill && prefill.microchipId) || navigationState.microchipId || '';

  const [selectedOwnPet, setSelectedOwnPet] = useState('');
  const [userPets, setUserPets] = useState([]);
  const [prefilledPetData, setPrefilledPetData] = useState(
    navigationMicrochipId
      ? { microchip: navigationMicrochipId }
      : navigationPetData
  );
  const [microchipInput, setMicrochipInput] = useState(navigationMicrochipId || prefilledPetData.microchip || '');

  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    foundLocation: '',
    foundDate: '',
    description: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({
    petName: '',
    species: '',
    foundLocation: '',
    foundDate: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    microchip: '',
    description: ''
  });

  // Fetch owner's pets if user is an owner
  useEffect(() => {
    if (isOwner && currentUser?.id) {
      const fetchUserPets = async () => {
        try {
          const response = await fetch('http://localhost:5000/pets');
          if (!response.ok) throw new Error('Failed to fetch pets');
          const allPets = await response.json();

          // Filter pets by current user's ID
          const ownerPets = allPets.filter(pet =>
            String(pet.ownerId) === String(currentUser.id)
          );

          // Transform to dropdown format
          const formattedPets = ownerPets.map(pet => ({
            value: pet.id,
            label: `${pet.name}${pet.microchipId ? ' - ' + pet.microchipId : ''}`,
            microchipId: pet.microchipId || '',
            name: pet.name,
            type: pet.type || 'Σκύλος',
            breed: pet.breed || '',
            gender: pet.gender,
            color: pet.color,
            weight: pet.weight,
            birthDate: pet.birthDate
          }));

          setUserPets(formattedPets);
        } catch (error) {
          console.error('Error fetching user pets:', error);
          setUserPets([]);
        }
      };

      fetchUserPets();
    }
  }, [isOwner, currentUser?.id]);

  // Helper functions for validation
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, ''); // Επιτρέπει μόνο αριθμούς, κενά και το σύμβολο +
  const allowedNameChars = (value) => value.replace(/[^A-Za-z\u0370-\u03FF\u1F00-\u1FFF\u00B4\s]/g, ''); // Επιτρέπει μόνο γράμματα και κενά
  const allowedMicrochipChars = (value) => value.replace(/[^0-9]/g, ''); // Επιτρέπει μόνο αριθμούς

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.length >= 10;
  };

  const validateMicrochip = (microchip) => {
    return microchip.length === 15;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    // Apply character filters based on field
    if (name === 'phone') {
      filteredValue = allowedPhoneChars(value);
    } else if (name === 'firstName' || name === 'lastName') {
      filteredValue = allowedNameChars(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Also clear description error when user types in description
    if (name === 'description' && errors.description) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      foundLocation: place?.label || formData.foundLocation
    }));
    // Clear error when location is selected
    if (errors.foundLocation) {
      setErrors(prev => ({ ...prev, foundLocation: '' }));
    }
  };

  const handleSubmitClick = () => {
    // Validate all fields
    const newErrors = {
      petName: '',
      species: '',
      foundLocation: '',
      foundDate: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      microchip: '',
      description: ''
    };

    let hasError = false;

    // Required field validations
    if (!formData.foundLocation.trim()) {
      newErrors.foundLocation = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    }

    if (!formData.foundDate.trim()) {
      newErrors.foundDate = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Μη έγκυρη διεύθυνση email';
      hasError = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Το πεδίο είναι υποχρεωτικό';
      hasError = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία';
      hasError = true;
    }

    // If no prefilled data, description is required
    if (!hasPrefilledData && !formData.description.trim()) {
      newErrors.description = 'Το πεδίο είναι υποχρεωτικό όταν δεν έχει γίνει αναζήτηση μικροτσίπ';
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError && isFormValid()) {
      setShowSubmitModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    await handleSubmit({ preventDefault: () => { } });
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Reset all form fields
    setFormData({
      petName: '',
      species: '',
      breed: '',
      foundLocation: '',
      foundDate: '',
      description: '',
      photo: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setImagePreview(null);
    setErrors({
      petName: '',
      species: '',
      foundLocation: '',
      foundDate: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      microchip: '',
      description: ''
    });
    setSelectedOwnPet('');
    setPrefilledPetData({});
    setMicrochipInput('');
    setShowCancelModal(false);

    // Show notification
    setNotification('cancelled');

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDraft = () => {
    console.log('Draft saved:', formData);

    // Reset all form fields
    setFormData({
      petName: '',
      species: '',
      breed: '',
      foundLocation: '',
      foundDate: '',
      description: '',
      photo: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setImagePreview(null);
    setErrors({
      petName: '',
      species: '',
      foundLocation: '',
      foundDate: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      microchip: '',
      description: ''
    });
    setSelectedOwnPet('');
    setPrefilledPetData({});
    setMicrochipInput('');

    // Show success notification
    setNotification('draft');

    // Auto-hide notification after 8 seconds
    setTimeout(() => {
      setNotification(null);
    }, 8000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία (*)');
      return;
    }

    try {
      // Try to find the pet in database by microchip or selected pet
      let petData = null;
      let ownerData = null;

      if (selectedOwnPet) {
        // Owner selected their own pet
        const petResponse = await fetch(`http://localhost:5000/pets/${selectedOwnPet}`);
        if (petResponse.ok) {
          petData = await petResponse.json();
        }
      } else if (prefilledPetData.microchip) {
        // Search by microchip
        const petsResponse = await fetch(`http://localhost:5000/pets?microchipId=${prefilledPetData.microchip}`);
        if (petsResponse.ok) {
          const pets = await petsResponse.json();
          if (pets.length > 0) {
            petData = pets[0];
          }
        }
      }

      // If pet found, fetch owner info
      if (petData && petData.ownerId) {
        const ownerResponse = await fetch(`http://localhost:5000/users/${petData.ownerId}`);
        if (ownerResponse.ok) {
          ownerData = await ownerResponse.json();
        }
      }

      // Get current user info for finder details
      const finderUser = currentUser || {};

      // Create the found pet entry
      const foundPetEntry = {
        id: `found_${petData?.id || Date.now()}_${Date.now()}`,
        name: petData?.name || prefilledPetData.petName || formData.petName || 'Άγνωστο',
        type: petData?.type || prefilledPetData.species || formData.species || '',
        breed: petData?.breed || prefilledPetData.breed || formData.breed || '',
        gender: petData?.gender || '',
        birthDate: petData?.birthDate || '',
        color: petData?.color || '',
        weight: petData?.weight || '',
        microchipId: petData?.microchipId || prefilledPetData.microchip || '',
        ownerId: petData?.ownerId || null,
        registeredByVetId: petData?.registeredByVetId || null,
        reportedByVetId: null,
        lostDate: petData?.lostDate || null,
        lostLocation: petData?.lostLocation || null,
        area: formData.foundLocation,
        locationLat: formData.latitude || null,
        locationLon: formData.longitude || null,
        petStatus: 2,
        status: 'active',
        imageUrl: petData?.imageUrl || null,
        createdAt: petData?.createdAt || new Date().toISOString(),
        description: formData.description || '',
        foundDate: new Date().toISOString(),
        markedFoundAt: new Date().toISOString(),
        foundByUserId: finderUser.id || null,
        foundByUserName: finderUser.name || formData.firstName,
        foundByUserSurname: finderUser.lastName || formData.lastName,
        foundByUserPhone: finderUser.phone || formData.phone,
        foundByUserEmail: finderUser.email || formData.email,
        foundAt: formData.foundDate
      };

      // Submit to Found_pet endpoint
      const response = await fetch('http://localhost:5000/Found_pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(foundPetEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to submit found pet declaration');
      }

      // If pet has an owner, create a notification
      if (petData && petData.ownerId) {
        const notification = {
          userId: petData.ownerId,
          type: 'pet_found',
          title: 'Το κατοικίδιό σας βρέθηκε!',
          message: `Κάποιος βρήκε το ${petData.name} σας! Ελέγξτε το ιστορικό δηλώσεων για περισσότερες πληροφορίες.`,
          relatedId: foundPetEntry.id,
          read: false,
          createdAt: new Date().toISOString()
        };

        await fetch('http://localhost:5000/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });
      }

      // Success - show notification
      setNotification('success');

      // Wait a bit for user to see the notification, then navigate
      setTimeout(() => {
        setNotification(null);
        if (inline && onClose) {
          onClose();
        } else {
          navigate(ROUTES.home);
        }
      }, 3000);

    } catch (error) {
      console.error('Error submitting found pet declaration:', error);
      alert('Σφάλμα κατά την υποβολή της δήλωσης. Παρακαλώ προσπαθήστε ξανά.');
    }
  };

  const speciesOptions = [
    { value: 'dog', label: 'Σκύλος' },
    { value: 'cat', label: 'Γάτα' },
    { value: 'bird', label: 'Πτηνό' },
    { value: 'reptile', label: 'Ερπετό' },
    { value: 'other', label: 'Άλλο' }
  ];

  const isFormValid = () => {
    return (
      formData.foundLocation.trim() !== '' &&
      formData.foundDate.trim() !== '' &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      (!hasPrefilledData && formData.description.trim() !== '' || hasPrefilledData)
    );
  };

  const handleClearPrefilledData = () => {
    setSelectedOwnPet('');
    setPrefilledPetData({});
    setMicrochipInput('');
  };

  const handleSearchComplete = (result) => {
    const { found, pet, microchip } = result;

    if (found && pet) {
      // Pet found - prefill with full data
      setPrefilledPetData({
        petName: pet.name,
        species: pet.type,
        breed: pet.breed,
        foundLocation: pet.area,
        description: pet.description,
        dateReported: pet.dateLost,
        dateReported: pet.dateLost,
        microchip: pet.microchipId || microchip,
        gender: pet.gender,
        color: pet.color,
        weight: pet.weight,
        birthDate: pet.birthDate
      });
    } else {
      // Pet not found - just store microchip
      setPrefilledPetData({
        microchip: microchip
      });
    }
  };



  const hasPrefilledData = Object.keys(prefilledPetData).length > 0;

  // Prepare fields for ConfirmDetailModal
  const getSubmitFields = () => {
    const fields = [];

    if (hasPrefilledData && prefilledPetData.petName) {
      fields.push({ label: 'Όνομα Κατοικιδίου', value: prefilledPetData.petName });
      fields.push({ label: 'Είδος', value: prefilledPetData.species || '-' });
      fields.push({ label: 'Ράτσα', value: prefilledPetData.breed || '-' });
      if (prefilledPetData.microchip) {
        fields.push({ label: 'Αριθμός Μικροτσίπ', value: prefilledPetData.microchip });
      }
    } else if (hasPrefilledData && prefilledPetData.microchip) {
      fields.push({ label: 'Αριθμός Μικροτσίπ', value: prefilledPetData.microchip });
      fields.push({ label: 'Όνομα Κατοικιδίου', value: formData.petName || 'Άγνωστο' });
      fields.push({ label: 'Είδος', value: formData.species || '-' });
      fields.push({ label: 'Ράτσα', value: formData.breed || '-' });
      fields.push({ label: 'Περιγραφή', value: formData.description || '-' });
    } else {
      fields.push({ label: 'Όνομα Κατοικιδίου', value: formData.petName || 'Άγνωστο' });
      fields.push({ label: 'Είδος', value: formData.species || '-' });
      fields.push({ label: 'Ράτσα', value: formData.breed || '-' });
      fields.push({ label: 'Περιγραφή', value: formData.description || '-' });
    }

    fields.push({ label: 'Τοποθεσία Εύρεσης', value: formData.foundLocation });
    fields.push({ label: 'Ημερομηνία Εύρεσης', value: formData.foundDate });
    fields.push({ label: 'Όνομα', value: formData.firstName });
    fields.push({ label: 'Επώνυμο', value: formData.lastName });
    fields.push({ label: 'Email', value: formData.email });
    fields.push({ label: 'Τηλέφωνο', value: formData.phone });
    fields.push({ label: 'Φωτογραφία', value: formData.photo ? 'Προστέθηκε' : 'Δεν προστέθηκε' });

    return fields;
  };

  const breadcrumbItems = [
    { label: 'Χαμένα Κατοικίδια', path: '/citizen/lost-pets' },
  ];

  const formContent = (
    <div className={`found-pet-form found-pet-form--${variant}`}>
      {inline && (
        <button
          type="button"
          className="inline-form-close"
          onClick={() => {
            if (onClose) onClose(); else navigate('/');
          }}
          aria-label="Κλείσιμο φόρμας"
        >
          <X size={16} />
        </button>
      )}
      <h1 className="form-title">Δήλωση Εύρεσης </h1>
      <p className="form-subtitle">
        Βρήκατε ένα χαμένο κατοικίδιο; Συμπληρώστε τη φόρμα για να βοηθήσετε την επιστροφή του στους ιδιοκτήτες
      </p>
      <div className="form-header">
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Microchip Search - Always visible when no prefilled data */}
        {!hasPrefilledData && (
          <div className="microchip-search-section">
            <MicrochipSearch
              initialValue={microchipInput}
              onSearchComplete={handleSearchComplete}
              variant={variant}
            />
          </div>
        )}

        {/* Prefilled Pet Info Card */}
        {hasPrefilledData && (
          <PetDetailsCard
            petData={prefilledPetData}
            onClear={handleClearPrefilledData}
            variant={variant}
          />
        )}


        {/* Only show pet detail fields if no prefilled data */}
        {!hasPrefilledData && (
          <>
            {/* Pet Name (optional) */}
            <div className="form-group">
              <label className="form-label">
                Όνομα Κατοικιδίου <span className="form-label-optional">(αν είναι γνωστό)</span>
              </label>
              <input
                type="text"
                name="petName"
                placeholder="π.χ. Μπάμπης"
                value={formData.petName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            {/* Species and Breed Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Είδος <span className="form-required">*</span>
                </label>
                <CustomSelect
                  value={formData.species}
                  onChange={(value) => setFormData({ ...formData, species: value })}
                  placeholder="Επιλέξτε είδος"
                  options={speciesOptions}
                  variant={variant}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ράτσα</label>
                <input
                  type="text"
                  name="breed"
                  placeholder="π.χ. Golden Retriever"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Περιγραφή <span className="form-required">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Περιγράψτε το κατοικίδιο που βρήκατε (χρώμα, μέγεθος, ιδιαίτερα χαρακτηριστικά...)"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
                rows="5"
                maxLength={500}
                required
              />
              <span className="form-field-note">Μέγιστος αριθμός χαρακτήρων: 500</span>
              {errors.description && (
                <div className="form-error-message">
                  <AlertCircle size={16} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Location Row - Always visible */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={16} className="form-label-icon" />
            Τοποθεσία Εύρεσης <span className="form-required">*</span>
          </label>
          <LocationPicker
            value={formData.foundLocation}
            onChange={(val) => handleInputChange({ target: { name: 'foundLocation', value: val } })}
            onSelect={handleLocationSelect}
            placeholder="π.χ. Πλατεία Συντάγματος, Αθήνα"
            variant={variant}
            className={errors.foundLocation ? 'form-input--error' : ''}
          />
          {errors.foundLocation && (
            <div className="form-error-message">
              <AlertCircle size={16} />
              <span>{errors.foundLocation}</span>
            </div>
          )}
        </div>

        {/* Date Row - Always visible */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={16} className="form-label-icon" />
            Ημερομηνία Εύρεσης <span className="form-required">*</span>
          </label>
          <DatePicker
            name="foundDate"
            value={formData.foundDate}
            onChange={handleInputChange}
            variant={variant}
            className={errors.foundDate ? 'form-input--error' : ''}
            maxDate={new Date()}
          />
          {errors.foundDate && (
            <div className="form-error-message">
              <AlertCircle size={16} />
              <span>{errors.foundDate}</span>
            </div>
          )}
        </div>

        {/* Photo Upload (optional) */}
        <div className="form-group">
          <label className="form-label">
            Φωτογραφία <span className="form-label-optional">(προαιρετικό)</span>
          </label>

          {!imagePreview ? (
            <div className="form-file-upload">
              <input
                type="file"
                id="photo-upload"
                name="photo"
                className="form-file-input"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="photo-upload" className="form-file-label">
                <span className="form-file-text">Επιλέξτε Φωτογραφία</span>
              </label>
              <span className="form-field-note">Προσθέστε φωτογραφία του κατοικιδίου</span>
            </div>
          ) : (
            <div className="form-photo-preview">
              <img src={imagePreview} alt="Preview" className="form-preview-image" />
              <button
                type="button"
                className="form-remove-photo"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, photo: null }));
                }}
                title="Αφαίρεση φωτογραφίας"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Personal Details Section */}
        <div className="form-section-divider">
          <h2 className="section-title">Προσωπικά Στοιχεία <span className="form-required">*</span></h2>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Όνομα <span className="form-required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Όνομα"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
              required
            />
            <span className="form-field-note">Επιτρέπονται μόνο γράμματα</span>
            {errors.firstName && (
              <div className="form-error-message">
                <AlertCircle size={16} />
                <span>{errors.firstName}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Επώνυμο <span className="form-required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Επώνυμο"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
              required
            />
            <span className="form-field-note">Επιτρέπονται μόνο γράμματα</span>
            {errors.lastName && (
              <div className="form-error-message">
                <AlertCircle size={16} />
                <span>{errors.lastName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="form-section-divider">
          <h2 className="section-title">Στοιχεία Επικοινωνίας</h2>
        </div>

        <div className="form-group">
          <label className="form-label">
            Email <span className="form-required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            required
          />
          {errors.email && (
            <div className="form-error-message">
              <AlertCircle size={16} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Τηλέφωνο <span className="form-required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
            value={formData.phone}
            onChange={handleInputChange}
            className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
            required
          />
          <span className="form-field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
          {errors.phone && (
            <div className="form-error-message">
              <AlertCircle size={16} />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          {isOwner ? (
            <>
              <button
                type="button"
                className="submit-btn submit-btn--cancel"
                onClick={handleCancelClick}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="submit-btn submit-btn--draft"
                onClick={handleDraft}
              >
                Πρόχειρο
              </button>

              <button
                type="button"
                className="submit-btn submit-btn--primary"
                onClick={handleSubmitClick}
                disabled={!isFormValid()}
              >
                Οριστική Υποβολή
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="submit-btn submit-btn--cancel"
                onClick={handleCancelClick}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className={`submit-btn submit-btn--wide ${variant === 'vet' ? 'submit-btn--orange' : variant === 'citizen' ? 'submit-btn--primary' : 'submit-btn--yellow'}`}
                onClick={handleSubmitClick}
                disabled={!isFormValid()}
              >
                Υποβολή Δήλωσης Εύρεσης
              </button>
            </>
          )}
        </div>
      </form>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Είστε σίγουροι ότι θέλετε να ακυρώσετε τη δήλωση εύρεσης;"
        description="Αυτή η ενέργεια δεν αναιρείται. Η δήλωσή σας θα χαθεί"
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, Ακύρωση"
        onCancel={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        isDanger={true}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmDetailModal
        isOpen={showSubmitModal}
        title="Επιβεβαίωση Δήλωσης Εύρεσης"
        subtitle="Παρακαλώ ελέγξτε τα στοιχεία πριν την οριστική υποβολή:"
        fields={getSubmitFields()}
        cancelText="Επιστροφή"
        confirmText="Οριστική Υποβολή"
        onCancel={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
      />

      {/* Notification */}
      <Notification
        isVisible={notification !== null}
        message={
          notification === 'draft'
            ? "Η δήλωση εύρεσης αποθηκεύτηκε ως πρόχειρη με επιτυχία! Μπορείτε να την επεξεργαστείτε αργότερα"
            : notification === 'success'
              ? "Η δήλωση εύρεσης υποβλήθηκε με επιτυχία!"
              : "Η δήλωση εύρεσης ακυρώθηκε με επιτυχία!"
        }
        type={notification === 'cancelled' ? 'error' : 'success'}
      />
    </div>
  );

  // When `inline` is true, render the form embedded in the page (no modal, no PageLayout)
  if (inline) {
    return formContent;
  }

  return (
    <PageLayout title="Δήλωση Εύρεσης" variant={variant} breadcrumbs={breadcrumbItems}>
      {formContent}
    </PageLayout>
  );
};

export default FoundPetForm;
