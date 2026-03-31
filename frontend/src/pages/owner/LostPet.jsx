import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import Notification from '../../components/common/modals/Notification';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES } from '../../utils/constants';
import './OwnerLostPet.css';

const OwnerLostPet = () => {
  const navigate = useNavigate();
  const [userPets, setUserPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [selectedPetDetails, setSelectedPetDetails] = useState(null);

  // Fetch owner's pets from database
  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch('http://localhost:5000/pets');
        const allPets = await response.json();

        // Filter pets by current user's ID - handle both string and number IDs
        const ownerPets = allPets.filter(pet =>
          String(pet.ownerId) === String(currentUser.id)
        );

        // Transform to dropdown format
        const formattedPets = ownerPets.map(pet => ({
          value: pet.id,
          label: `${pet.name}${pet.microchipId ? ' - ' + pet.microchipId : ''}`,
          microchipId: pet.microchipId || pet.microchip || '',
          name: pet.name,
          type: pet.type || 'Σκύλος',
          breed: pet.breed || '',
          color: pet.color || pet.petColor || '',
          weight: pet.weight || '',
          gender: pet.gender || '',
          birthDate: pet.birthDate || '',
          image: pet.imageUrl || pet.image || ''
        }));

        setUserPets(formattedPets);
      } catch (error) {
        console.error('Error fetching user pets:', error);
        setUserPets([]);
      } finally {
        setPetsLoading(false);
      }
    };

    fetchUserPets();
  }, []);

  const [formData, setFormData] = useState({
    selectedPet: '',
    microchipNumber: '',
    petName: '',
    petType: '',
    breed: '',
    lostDate: '',
    contactPhone: '',
    location: '',
    locationLat: '',
    locationLon: '',
    description: '',
    photo: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [draftId, setDraftId] = useState(null);

  // Helper function to filter phone characters
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, ''); // Επιτρέπει μόνο αριθμούς, κενά και το σύμβολο +

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone
    if (name === 'contactPhone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
      // Clear phone error when user starts typing
      if (phoneError) setPhoneError('');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePetSelect = (value) => {
    // Auto-populate pet info when a pet is selected
    const selectedPetData = userPets.find(pet => pet.value === value);
    if (selectedPetData) {
      setSelectedPetDetails(selectedPetData);
      setFormData(prev => ({
        ...prev,
        selectedPet: value,
        microchipNumber: selectedPetData.microchipId,
        petName: selectedPetData.name,
        petType: selectedPetData.type,
        breed: selectedPetData.breed
      }));
    }
  };

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      location: place?.label || prev.location,
      locationLat: place?.lat || '',
      locationLon: place?.lon || ''
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: ''
    }));
    setPhotoPreview(null);
  };

  const isFormValid = () => {
    return (
      formData.selectedPet.trim() !== '' &&
      formData.lostDate.trim() !== '' &&
      formData.contactPhone.trim() !== '' &&
      formData.location.trim() !== ''
    );
  };

  const handleSubmitClick = () => {
    if (isFormValid()) {
      setShowSubmitModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      // Update pet with lost information
      const selectedPetData = userPets.find(p => p.value === formData.selectedPet);
      const submitData = {
        lostDate: formData.lostDate,
        lostLocation: formData.location,
        area: formData.location,
        locationLat: formData.locationLat,
        locationLon: formData.locationLon,
        petStatus: 1,
        status: 'active',
        description: formData.description
      };

      const response = await fetch(`http://localhost:5000/pets/${formData.selectedPet}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        setShowSubmitModal(false);
        setNotification({
          type: 'success',
          message: 'Η δήλωση απώλειας κατοικιδίου καταχωρήθηκε με επιτυχία!'
        });
        // clear form after submission
        setFormData({
          selectedPet: '',
          microchipNumber: '',
          petName: '',
          petType: '',
          breed: '',
          lostDate: '',
          contactPhone: '',
          location: '',
          locationLat: '',
          locationLon: '',
          description: '',
          photo: ''
        });
        setPhotoPreview(null);
        setPhoneError('');
      } else {
        setNotification({
          type: 'error',
          message: 'Σφάλμα κατά την καταχώρηση της δήλωσης'
        });
      }
    } catch (err) {
      console.error('Error submitting lost pet declaration:', err);
      setNotification({
        type: 'error',
        message: 'Σφάλμα κατά την καταχώρηση της δήλωσης'
      });
    }
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
      selectedPet: '',
      microchipNumber: '',
      petName: '',
      petType: '',
      breed: '',
      lostDate: '',
      contactPhone: '',
      location: '',
      locationLat: '',
      locationLon: '',
      description: '',
      photo: ''
    });
    setPhotoPreview(null);
    setPhoneError('');
    setShowCancelModal(false);

    // Show notification
    setNotification({
      type: 'error',
      message: 'Η δήλωση απώλειας κατοικιδίου ακυρώθηκε με επιτυχία!'
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDraft = async () => {
    try {
      const selectedPetData = userPets.find(p => p.value === formData.selectedPet);
      const updateData = {
        lostDate: formData.lostDate,
        lostLocation: formData.location,
        area: formData.location,
        locationLat: formData.locationLat,
        locationLon: formData.locationLon,
        petStatus: 1,
        status: 'draft'
      };

      const response = await fetch(`http://localhost:5000/pets/${formData.selectedPet}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Η δήλωση απώλειας αποθηκεύτηκε ως πρόχειρη με επιτυχία! Μπορείτε να την επεξεργαστείτε από το Ιστορικό Δηλώσεων'
        });

        setTimeout(() => {
          setFormData({
            selectedPet: '',
            microchipNumber: '',
            petName: '',
            petType: '',
            breed: '',
            lostDate: '',
            contactPhone: '',
            location: '',
            locationLat: '',
            locationLon: '',
            description: '',
            photo: ''
          });
          setPhotoPreview(null);
          setPhoneError('');
          navigate(ROUTES.owner.lostHistory);
        }, 2000);
      } else {
        setNotification({
          type: 'error',
          message: 'Σφάλμα κατά την αποθήκευση του προχείρου'
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setNotification({
        type: 'error',
        message: 'Σφάλμα κατά την αποθήκευση του προχείρου'
      });
    }
  };

  // Prepare fields for ConfirmDetailModal
  const getSubmitFields = () => {
    const selectedPetData = userPets.find(p => p.value === formData.selectedPet);
    return [
      { label: 'Κατοικίδιο', value: selectedPetData?.label || '-' },
      { label: 'Αριθμός Μικροτσίπ', value: formData.microchipNumber },
      { label: 'Ημερομηνία Εξαφάνισης', value: formData.lostDate },
      { label: 'Τηλέφωνο Επικοινωνίας', value: formData.contactPhone },
      { label: 'Τοποθεσία', value: formData.location },
      { label: 'Περιγραφή', value: formData.description || '-' },
      { label: 'Φωτογραφία', value: formData.photo ? 'Προστέθηκε' : 'Δεν προστέθηκε' }
    ];
  };

  const breadcrumbItems = [
  ];

  return (
    <PageLayout variant="owner" title="Δήλωση Απώλειας" breadcrumbs={breadcrumbItems}>
      <div className="lost-pet">
        <div className="owner-lost-pet__header">
          <div className="owner-lost-pet__breadcrumb">
          </div>
          <h1 className="owner-lost-pet__title">Δήλωση Απώλειας Κατοικιδίου</h1>
        </div>

        <div className="owner-lost-pet__content">

          <form className="owner-lost-pet__form">
            {/* Επιλογή Κατοικιδίου */}
            <div className="owner-lost-pet__field">
              <label className="owner-lost-pet__label">
                Επιλέξτε Κατοικίδιο <span className="owner-lost-pet__required">*</span>
              </label>
              <CustomSelect
                name="selectedPet"
                value={formData.selectedPet}
                onChange={handlePetSelect}
                options={userPets}
                placeholder="Επιλέξτε το κατοικίδιο που χάθηκε"
                variant="owner"
              />
            </div>

            {/* Pet Info Card - Shows when a pet is selected */}
            {formData.selectedPet && selectedPetDetails && (
              <PetDetailsCard
                petData={selectedPetDetails}
                onClear={() => {
                  setSelectedPetDetails(null);
                  setFormData(prev => ({
                    ...prev,
                    selectedPet: '',
                    microchipNumber: '',
                    petName: '',
                    petType: '',
                    breed: ''
                  }));
                }}
                variant="owner"
              />
            )}

            {/* Ημερομηνία Εξαφάνισης & Τηλέφωνο */}
            <div className="owner-lost-pet__row">
              <div className="owner-lost-pet__field">
                <label className="owner-lost-pet__label">
                  Ημερομηνία Εξαφάνισης <span className="owner-lost-pet__required">*</span>
                </label>
                <DatePicker
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleInputChange}
                  variant="owner"
                  maxDate={new Date()}
                />
              </div>

              <div className="owner-lost-pet__field">
                <label className="owner-lost-pet__label">
                  Τηλέφωνο Επικοινωνίας <span className="owner-lost-pet__required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  className={`owner-lost-pet__input ${phoneError ? 'owner-lost-pet__input--error' : ''}`}
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="owner-lost-pet__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
                {phoneError && (
                  <div className="owner-lost-pet__error-message">
                    <AlertCircle size={16} />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Τοποθεσία Εξαφάνισης */}
            <div className="owner-lost-pet__field">
              <label className="owner-lost-pet__label">
                Τοποθεσία Εξαφάνισης <span className="owner-lost-pet__required">*</span>
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                onSelect={handleLocationSelect}
                required
                variant="owner"
              />
            </div>

            {/* Περιγραφή */}
            <div className="owner-lost-pet__field">
              <label className="owner-lost-pet__label">
                Περιγραφή
              </label>
              <textarea
                name="description"
                className="owner-lost-pet__textarea"
                placeholder="Περιγράψτε το κατοικίδιο σας (χρώμα, μέγεθος, διακριτικά γνωρίσματα...)"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {/* Φωτογραφία */}
            <div className="owner-lost-pet__field">
              <label className="owner-lost-pet__label">
                Φωτογραφία
              </label>
              {!photoPreview ? (
                <div className="owner-lost-pet__file-upload">
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    className="owner-lost-pet__file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="photo-upload" className="owner-lost-pet__file-label">
                    <span className="owner-lost-pet__file-text">Επιλέξτε Φωτογραφία</span>
                  </label>
                  <span className="owner-lost-pet__field-note">Προσθέστε φωτογραφία του κατοικιδίου</span>
                </div>
              ) : (
                <div className="owner-lost-pet__photo-preview">
                  <img src={photoPreview} alt="Preview" className="owner-lost-pet__preview-image" />
                  <button
                    type="button"
                    className="owner-lost-pet__remove-photo"
                    onClick={handleRemovePhoto}
                    title="Αφαίρεση φωτογραφίας"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="owner-lost-pet__actions">
              <button
                type="button"
                className="owner-lost-pet__btn owner-lost-pet__btn--cancel"
                onClick={handleCancelClick}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="owner-lost-pet__btn owner-lost-pet__btn--secondary"
                onClick={handleDraft}
              >
                Πρόχειρο
              </button>

              <button
                type="button"
                className="owner-lost-pet__btn owner-lost-pet__btn--primary"
                onClick={handleSubmitClick}
                disabled={!isFormValid()}
              >
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="Είστε σίγουροι ότι θέλετε να ακυρώσετε τη δήλωση απώλειας κατοικιδίου;"
        description="Αυτή η ενέργεια δεν αναιρείται. Η δήλωσή σας θα χαθεί"
        cancelText="Όχι"
        confirmText="Ναι, Ακύρωση"
        onCancel={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        isDanger={true}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmDetailModal
        isOpen={showSubmitModal}
        title="Επιβεβαίωση Δήλωσης Απώλειας"
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
        message={notification?.message || ''}
        type={notification?.type || 'success'}
      />
    </PageLayout>
  );
};

export default OwnerLostPet;
