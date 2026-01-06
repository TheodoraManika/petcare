import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Send } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import LocationPicker from '../../components/common/LocationPicker';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import { ROUTES } from '../../utils/constants';
import './LostPet.css';

const LostPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    microchipNumber: '',
    petName: '',
    lostDate: '',
    contactPhone: '',
    location: '',
    locationLat: '',
    locationLon: '',
    description: '',
    photo: '',
    ownerName: '',
    ownerSurname: '',
    ownerAfm: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      formData.petName.trim() !== '' &&
      formData.lostDate.trim() !== '' &&
      formData.contactPhone.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.ownerSurname.trim() !== '' &&
      formData.ownerAfm.trim() !== ''
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    console.log('Form submitted:', formData);
    setShowConfirmModal(false);
    setShowSuccess(true);
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
      petName: '',
      lostDate: '',
      contactPhone: '',
      location: '',
      locationLat: '',
      locationLon: '',
      description: '',
      photo: '',
      ownerName: '',
      ownerSurname: '',
      ownerAfm: ''
    });
    setPhotoPreview(null);
    setShowCancelModal(false);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.microchipNumber },
    { label: 'Όνομα Κατοικιδίου', value: formData.petName },
    { label: 'Τηλέφωνο Επικοινωνίας', value: formData.contactPhone },
    { label: 'Ημερομηνία Εξαφάνισης', value: formData.lostDate },
    { label: 'Τοποθεσία', value: formData.location },
    { label: 'Περιγραφή', value: formData.description || '-' },
    { label: 'Όνομα Ιδιοκτήτη', value: formData.ownerName },
    { label: 'Επώνυμο Ιδιοκτήτη', value: formData.ownerSurname },
    { label: 'ΑΦΜ Ιδιοκτήτη', value: formData.ownerAfm },
  ];

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={Send}
        title="Η Δήλωση Απώλειας Υποβλήθηκε!"
        description="Η δήλωση απώλειας καταχωρήθηκε επιτυχώς στο σύστημα. Μπορείτε να δείτε τη δήλωση στο ιστορικό δηλώσεών σας ενώ ο ιδιοκτήτης μπορεί να τη δει στις δικές του δηλώσεις."
        buttonText="Επιστροφή στο Μενού"
        onButtonClick={handleSuccessReturn}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Δήλωση Απώλειας"
      />
    );
  }

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={Send}
        title="Η Δήλωση Απώλειας Υποβλήθηκε!"
        description="Η δήλωση απώλειας καταχωρήθηκε επιτυχώς στο σύστημα. Μπορείτε να δείτε τη δήλωση στο ιστορικό δηλώσεών σας ενώ ο ιδιοκτήτης μπορεί να τη δει στις δικές του δηλώσεις."
        buttonText="Επιστροφή στο Μενού"
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
          <p className="lost-pet__subtitle-main">Συμπληρώστε τα στοιχεία του χαμένου κατοικιδίου</p>
        </div>

        <div className="lost-pet__header">
          <h1 className="lost-pet__title">Δήλωση Απώλειας Κατοικιδίου</h1>
          <p className="lost-pet__subtitle-main">Συμπληρώστε τα στοιχεία του χαμένου κατοικιδίου</p>
        </div>

        <div className="lost-pet__content">

          <form className="lost-pet__form">
            {/* Κωδικός Μικροτσίπ */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Κωδικός Μικροτσίπ <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="microchipNumber"
                className="lost-pet__input"
                placeholder="GR123456789012345"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
            </div>

            {/* Όνομα Κατοικιδίου */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Όνομα Κατοικιδίου <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="petName"
                className="lost-pet__input"
                value={formData.petName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Ημερομηνία Εξαφάνισης & Τηλέφωνο */}
            <div className="lost-pet__row">
              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Ημερομηνία Εξαφάνισης <span className="lost-pet__required">*</span>
                </label>
                <DatePicker
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Τηλέφωνο Επικοινωνίας <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="lost-pet__input"
                  placeholder="69XXXXXXXX"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
              </div>
            </div>

            <div className="lost-pet__field">
              <label className="lost-pet__label">
                ΑΦΜ <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="ownerAfm"
                className="lost-pet__input"
                placeholder="ΑΦΜ Ιδιοκτήτη"
                value={formData.ownerAfm}
                onChange={handleInputChange}
                maxLength={9}
                required
              />
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
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
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
      <ConfirmDetailModal
        isOpen={showConfirmModal}
        title="Επιβεβαίωση Δήλωσης Απώλειας"
        subtitle="Παρακαλώ ελέγξτε τα στοιχεία της δήλωσης απώλειας κατοικιδίου:"
        fields={confirmFields}
        cancelText="Επιστροφή"
        confirmText="Επιβεβαίωση"
        onCancel={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
      />
    </PageLayout>
  );
};

export default LostPet;
