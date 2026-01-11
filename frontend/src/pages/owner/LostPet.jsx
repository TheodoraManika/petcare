import React, { useState } from 'react';
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

  // Mock pet data - in real app, this would come from API/database
  const userPets = [
    { value: 'pet1', label: 'Μαξ - GR123456789012345', microchip: 'GR123456789012345', name: 'Μαξ', type: 'Σκύλος', breed: 'Golden Retriever', image: '🐕' },
    { value: 'pet2', label: 'Λούνα - GR987654321098765', microchip: 'GR987654321098765', name: 'Λούνα', type: 'Γάτα', breed: 'Persian', image: '🐱' },
    { value: 'pet3', label: 'Τσάρλι - GR456789123456789', microchip: 'GR456789123456789', name: 'Τσάρλι', type: 'Σκύλος', breed: 'Labrador Retriever', image: '🐶' },
  ];

  // Location options (now will be used by LocationPicker)
  const locationOptions = [
    { value: 'syntagma', label: 'Κέντρο Αθήνας, Πλατεία Συντάγματος' },
    { value: 'monastiraki', label: 'Μοναστηράκι' },
    { value: 'kolonaki', label: 'Κολωνάκι' },
    { value: 'glyfada', label: 'Γλυφάδα' },
    { value: 'piraeus', label: 'Πειραιάς' },
    { value: 'other', label: 'Άλλη περιοχή' },
  ];

  const [formData, setFormData] = useState({
    selectedPet: '',
    microchipNumber: '',
    petName: '',
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
      setFormData(prev => ({
        ...prev,
        selectedPet: value,
        microchipNumber: selectedPetData.microchip,
        petName: selectedPetData.name
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

  const handleConfirmSubmit = () => {
    console.log('Form submitted:', formData);
    setShowSubmitModal(false);
    navigate(ROUTES.owner.dashboard);
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
    // TODO: Save form data to backend with status 'draft'
    // API call example: await saveLostPetDraft(formData);

    console.log('Draft saved:', formData);

    // Reset all form fields
    setFormData({
      selectedPet: '',
      microchipNumber: '',
      petName: '',
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

    // Show success notification
    setNotification('draft');

    // Auto-hide notification after 8 seconds
    setTimeout(() => {
      setNotification(null);
    }, 8000);
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
            {formData.selectedPet && (
              <PetDetailsCard
                petData={{
                  petName: userPets.find(p => p.value === formData.selectedPet)?.name,
                  species: userPets.find(p => p.value === formData.selectedPet)?.type,
                  breed: userPets.find(p => p.value === formData.selectedPet)?.breed,
                  microchip: formData.microchipNumber
                }}
                onClear={() => {
                  setFormData(prev => ({
                    ...prev,
                    selectedPet: '',
                    microchipNumber: '',
                    petName: ''
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
        message={
          notification === 'draft'
            ? "Η δήλωση απώλειας αποθηκεύτηκε ως πρόχειρη με επιτυχία! Μπορείτε να την επεξεργαστείτε από το Ιστορικό Δηλώσεων"
            : "Η δήλωση απώλειας κατοικιδίου ακυρώθηκε με επιτυχία!"
        }
        type={notification === 'draft' ? 'success' : 'error'}
      />
    </PageLayout>
  );
};

export default OwnerLostPet;
