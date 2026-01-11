import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import DatePicker from '../../components/common/forms/DatePicker';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import SuccessPage from '../../components/common/modals/SuccessPage';
import Notification from '../../components/common/modals/Notification';
import MicrochipSearch from '../../components/common/forms/MicrochipSearch';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES } from '../../utils/constants';
import './LostPet.css';

const LostPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    microchipNumber: '',
    petName: '',
    petColor: '',
    lostDate: '',
    contactPhone: '',
    location: '',
    locationLat: '',
    locationLon: '',
    description: '',
    photo: '',
    ownerName: '',
    ownerSurname: '',
    ownerAfm: '',
    ownerEmail: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  const [foundPet, setFoundPet] = useState(null);
  const [afmError, setAfmError] = useState('');



  // Helper function to filter only Greek and English letters and spaces
  const filterLettersOnly = (value) => {
    return value.replace(/[^A-Za-z\u0370-\u03FF\u1F00-\u1FFF\u00B4\s]/g, '');
  };

  const handleSearchComplete = (result) => {
    const { found, pet, microchip } = result;

    if (found && pet) {
      // Pet found - prefill with data
      setFormData(prev => ({
        ...prev,
        microchipNumber: pet.microchip,
        petName: pet.name,
        petColor: pet.color,
        description: pet.description,
      }));
      setFoundPet(pet);
    } else {
      // Pet not found - just set microchip
      setFormData(prev => ({
        ...prev,
        microchipNumber: microchip,
        petName: '',
        petColor: '',
        description: ''
      }));
      setFoundPet({ microchip });
      if (microchip.length !== 15) {
        setMicrochipError('Ο αριθμός μικροτσίπ πρέπει να είναι 15 ψηφία');
      } else {
        setMicrochipError('');
      }
    }
  };

  // Helper function to filter only numbers
  const allowedAFMChars = (value) => value.replace(/[^0-9]/g, '');

  // Helper function to filter phone characters
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, '');

  // Helper function to filter email characters - no Greek letters
  const allowedEmailChars = (value) => value.replace(/[\u0370-\u03FF\u1F00-\u1FFF]/g, '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for microchip number
    if (name === 'microchipNumber') {
      // Allow only numbers
      const numericValue = value.replace(/[^0-9]/g, '');

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));

      // Validate length
      if (numericValue.length > 0 && numericValue.length < 15) {
        setMicrochipError('Ο αριθμός μικροτσίπ πρέπει να είναι 15 ψηφία');
      } else {
        setMicrochipError('');
      }
    }
    // Special handling for pet name - only Greek and English letters
    if (name === 'ownerName') {
      const lettersValue = filterLettersOnly(value);

      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for owner surname - only Greek and English letters
    else if (name === 'ownerSurname') {
      const lettersValue = filterLettersOnly(value);

      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for AFM - only numbers
    else if (name === 'ownerAfm') {
      const numericValue = allowedAFMChars(value);

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));

      // Validate length
      if (numericValue.length > 0 && numericValue.length < 9) {
        setAfmError('Το ΑΦΜ πρέπει να είναι 9 ψηφία');
      } else {
        setAfmError('');
      }
    }
    // Special handling for phone - only numbers, spaces and +
    else if (name === 'contactPhone') {
      const phoneValue = allowedPhoneChars(value);

      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }));
    }
    // Special handling for email - no Greek characters
    else if (name === 'ownerEmail') {
      const emailValue = allowedEmailChars(value);

      setFormData(prev => ({
        ...prev,
        [name]: emailValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
      formData.microchipNumber.trim() !== '' &&
      formData.microchipNumber.length === 15 &&
      formData.lostDate.trim() !== '' &&
      formData.contactPhone.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.ownerSurname.trim() !== '' &&
      formData.ownerAfm.trim() !== '' &&
      formData.ownerAfm.length === 9 &&
      formData.ownerEmail.trim() !== ''
    );
  };

  const handleSubmit = () => {
    // Validate microchip before submission
    if (formData.microchipNumber.length !== 15) {
      setMicrochipError('Ο αριθμός μικροτσίπ πρέπει να είναι 15 ψηφία');
      return;
    }

    // Validate AFM before submission
    if (formData.ownerAfm.length !== 9) {
      setAfmError('Το ΑΦΜ πρέπει να είναι 9 ψηφία');
      return;
    }

    if (isFormValid()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    console.log('Form submitted:', formData);
    setShowConfirmModal(false);
    setShowSuccess(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  const handleSuccessReturn = () => {
    navigate(ROUTES.vet.dashboard);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Reset all form fields
    setFormData({
      microchipNumber: '',
      lostDate: '',
      contactPhone: '',
      location: '',
      locationLat: '',
      locationLon: '',
      description: '',
      photo: '',
      ownerName: '',
      ownerSurname: '',
      ownerAfm: '',
      ownerEmail: ''
    });
    setPhotoPreview(null);
    setMicrochipError('');
    setAfmError('');
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

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.microchipNumber },
    { label: 'Ημερομηνία Εξαφάνισης', value: formData.lostDate },
    { label: 'Τοποθεσία', value: formData.location },
    { label: 'Περιγραφή', value: formData.description || '-' },
    { label: 'Όνομα Ιδιοκτήτη', value: formData.ownerName },
    { label: 'Επώνυμο Ιδιοκτήτη', value: formData.ownerSurname },
    { label: 'ΑΦΜ Ιδιοκτήτη', value: formData.ownerAfm },
    { label: 'Τηλέφωνο Επικοινωνίας', value: formData.contactPhone },
    { label: 'Email Ιδιοκτήτη', value: formData.ownerEmail },
  ];

  const breadcrumbItems = [];

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={Send}
        title="Η Δήλωση Απώλειας Υποβλήθηκε!"
        description="Η δήλωση απώλειας καταχωρήθηκε επιτυχώς στο σύστημα. Μπορείτε να δείτε τη δήλωση στο ιστορικό δηλώσεών σας ενώ ο ιδιοκτήτης μπορεί να τη δει στις δικές του δηλώσεις."
        buttonText="Επιστροφή στην Αρχική Κτηνιάτρου"
        onButtonClick={handleSuccessReturn}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Δήλωση Απώλειας"
      />
    );
  }

  return (
    <PageLayout title="Δήλωση Απώλειας" breadcrumbs={breadcrumbItems}>
      <div className="lost-pet">
        <div className="lost-pet__header">
          <h1 className="lost-pet__title">Δήλωση Απώλειας Κατοικιδίου</h1>
          <p className="lost-pet__subtitle">Συμπληρώστε τα στοιχεία του χαμένου κατοικιδίου</p>
        </div>

        <div className="lost-pet__content">

          <form className="lost-pet__form">

            {foundPet ? (
              <PetDetailsCard
                petData={foundPet}
                onClear={() => {
                  setFoundPet(null);
                  setFormData(prev => ({
                    ...prev,
                    microchipNumber: '',
                    petName: '',
                    petColor: '',
                    description: ''
                  }));
                }}
                variant="vet"
              />
            ) : (
              <MicrochipSearch
                onSearchComplete={handleSearchComplete}
                variant="vet"
              />
            )}
            {/* Ημερομηνία Εξαφάνισης */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Ημερομηνία Εξαφάνισης <span className="lost-pet__required">*</span>
              </label>
              <DatePicker
                name="lostDate"
                value={formData.lostDate}
                onChange={handleInputChange}
                maxDate={new Date()}
              />
            </div>

            {/* Τοποθεσία Εξαφάνισης */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Τοποθεσία Εξαφάνισης <span className="lost-pet__required">*</span>
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                onSelect={handleLocationSelect}
                required
                variant="vet"
              />
            </div>

            {/* Περιγραφή */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Περιγραφή
              </label>
              <textarea
                name="description"
                className="lost-pet__textarea"
                placeholder="Περιγράψτε το κατοικίδιο (χρώμα, μέγεθος, διακριτικά γνωρίσματα...)"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>


            {/* Φωτογραφία */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Φωτογραφία
              </label>

              {!photoPreview ? (
                <div className="lost-pet__file-upload">
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    className="lost-pet__file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="photo-upload" className="lost-pet__file-label">
                    <span className="lost-pet__file-text">Επιλέξτε Φωτογραφία</span>
                  </label>
                  <span className="lost-pet__field-note">Προσθέστε φωτογραφία του κατοικιδίου</span>
                </div>
              ) : (
                <div className="lost-pet__photo-preview">
                  <img src={photoPreview} alt="Preview" className="lost-pet__preview-image" />
                  <button
                    type="button"
                    className="lost-pet__remove-photo"
                    onClick={handleRemovePhoto}
                    title="Αφαίρεση φωτογραφίας"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Στοιχεία Ιδιοκτήτη */}
            <div className="lost-pet__section-title">
              Στοιχεία Ιδιοκτήτη (για τον οποίο γίνεται η δήλωση)
            </div>

            <div className="lost-pet__row">
              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Όνομα <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  className="lost-pet__input"
                  placeholder="Όνομα Ιδιοκτήτη"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                />
                <span className="lost-pet__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Επώνυμο <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerSurname"
                  className="lost-pet__input"
                  placeholder="Επώνυμο Ιδιοκτήτη"
                  value={formData.ownerSurname}
                  onChange={handleInputChange}
                  required
                />
                <span className="lost-pet__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>

            <div className="lost-pet__field">
              <label className="lost-pet__label">
                ΑΦΜ <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="ownerAfm"
                className={`lost-pet__input ${afmError ? 'lost-pet__input--error' : ''}`}
                placeholder="123456789 (9 ψηφία)"
                value={formData.ownerAfm}
                onChange={handleInputChange}
                maxLength={9}
                required
              />
              <span className="lost-pet__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              {afmError && (
                <span className="lost-pet__error-message">
                  <AlertCircle size={14} />
                  {afmError}
                </span>
              )}
            </div>

            <div className="lost-pet__row">
              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Τηλέφωνο Επικοινωνίας <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="lost-pet__input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="lost-pet__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>

              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Email <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  className="lost-pet__input"
                  placeholder="example@email.com"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  required
                />
                <span className="lost-pet__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="lost-pet__actions">
              <button
                type="button"
                className="lost-pet__btn lost-pet__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="lost-pet__btn lost-pet__btn--primary"
                onClick={handleSubmit}
                disabled={!isFormValid()}
              >
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div >

      {/* Cancel Confirmation Modal */}
      < ConfirmModal
        isOpen={showCancelModal}
        title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την δήλωση απώλειας κατοικιδίου;"
        description="Αυτή η ενέργεια δεν αναιρείται."
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, ακύρωση"
        onCancel={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        isDanger={true}
      />

      {/* Submit Confirmation Modal */}
      < ConfirmDetailModal
        isOpen={showConfirmModal}
        title="Επιβεβαίωση Δήλωσης Απώλειας"
        subtitle="Παρακαλώ ελέγξτε τα στοιχεία της δήλωσης απώλειας κατοικιδίου:"
        fields={confirmFields}
        cancelText="Επιστροφή"
        confirmText="Επιβεβαίωση"
        onCancel={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
      />

      {/* Notification */}
      < Notification
        isVisible={notification !== null}
        message="Η δήλωση απώλειας κατοικιδίου ακυρώθηκε με επιτυχία!"
        type="error"
      />
    </PageLayout >
  );
};

export default LostPet;
