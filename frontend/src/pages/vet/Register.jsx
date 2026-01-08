import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Send } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [microchipError, setMicrochipError] = useState('');
  const [breedError, setBreedError] = useState('');
  const [afmError, setAfmError] = useState('');
  const [formData, setFormData] = useState({
    microchipNumber: '',
    species: '',
    breed: '',
    ownerName: '',
    gender: '',
    birthDate: '',
    color: '',
    weight: '',
    ownerLastName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    ownerAddressLat: '',
    ownerAddressLon: '',
    afm: '',
  });

  // Helper function to filter only Greek and English letters and spaces
  const filterLettersOnly = (value) => {
    return value.replace(/[^A-Za-z\u0370-\u03FF\u1F00-\u1FFF\u00B4\s]/g, '');
  };

  // Helper function to filter only numbers
  const allowedAFMChars = (value) => value.replace(/[^0-9]/g, ''); // Επιτρέπει μόνο αριθμούς

  // Helper function to filter phone characters
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, ''); // Επιτρέπει μόνο αριθμούς, κενά και το σύμβολο +

  // Helper function to filter email characters - no Greek letters
  const allowedEmailChars = (value) => value.replace(/[\u0370-\u03FF\u1F00-\u1FFF]/g, ''); // Αφαιρεί ελληνικούς χαρακτήρες

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
    // Special handling for breed - only Greek and English letters
    else if (name === 'breed') {
      const lettersValue = filterLettersOnly(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for pet name (ownerName) - only Greek and English letters
    else if (name === 'ownerName') {
      const lettersValue = filterLettersOnly(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for color - only Greek and English letters
    else if (name === 'color') {
      const lettersValue = filterLettersOnly(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for owner full name - only Greek and English letters
    else if (name === 'ownerLastName') {
      const lettersValue = filterLettersOnly(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: lettersValue
      }));
    }
    // Special handling for AFM - only numbers
    else if (name === 'afm') {
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
    else if (name === 'ownerPhone') {
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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Reset form data to initial empty state
    setFormData({
      microchipNumber: '',
      species: '',
      breed: '',
      ownerName: '',
      gender: '',
      birthDate: '',
      color: '',
      weight: '',
      ownerLastName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: '',
      ownerAddressLat: '',
      ownerAddressLon: '',
      afm: '',
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate microchip before submission
    if (formData.microchipNumber.length !== 15) {
      setMicrochipError('Ο αριθμός μικροτσίπ πρέπει να είναι 15 ψηφία');
      return;
    }
    
    // Validate AFM before submission
    if (formData.afm.length !== 9) {
      setAfmError('Το ΑΦΜ πρέπει να είναι 9 ψηφία');
      return;
    }
    
    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setShowConfirmModal(false);
    setShowSuccess(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.microchipNumber.trim() !== '' &&
      formData.microchipNumber.length === 15 &&
      formData.species.trim() !== '' &&
      formData.breed.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.gender.trim() !== '' &&
      formData.birthDate.trim() !== '' &&
      formData.ownerLastName.trim() !== '' &&
      formData.ownerPhone.trim() !== '' &&
      formData.ownerEmail.trim() !== '' &&
      formData.ownerAddress.trim() !== '' &&
      formData.afm.trim() !== '' &&
      formData.afm.length === 9
    );
  };

  // Helper function to get label for species
  const getSpeciesLabel = (value) => {
    const options = {
      'dog': 'Σκύλος',
      'cat': 'Γάτα',
      'bird': 'Πτηνό',
      'reptile': 'Ερπετό',
      'other': 'Άλλο'
    };
    return options[value] || value;
  };

  // Helper function to get label for gender
  const getGenderLabel = (value) => {
    const options = {
      'male': 'Αρσενικό',
      'female': 'Θηλυκό'
    };
    return options[value] || value;
  };

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.microchipNumber },
    { label: 'Είδος', value: getSpeciesLabel(formData.species) },
    { label: 'Ράτσα', value: formData.breed },
    { label: 'Όνομα', value: formData.ownerName },
    { label: 'Φύλο', value: getGenderLabel(formData.gender) },
    { label: 'Ημερομηνία Γέννησης', value: formData.birthDate },
    { label: 'Χρώμα', value: formData.color },
    { label: 'Βάρος (kg)', value: formData.weight },
    { label: 'Ιδιοκτήτης', value: formData.ownerLastName },
    { label: 'Τηλέφωνο', value: formData.ownerPhone },
    { label: 'Email', value: formData.ownerEmail },
    { label: 'Διεύθυνση', value: formData.ownerAddress },
    { label: 'ΑΦΜ', value: formData.afm },
  ];

  const breadcrumbItems = [];

  if (showSuccess) {
    return (
      <SuccessPage
        icon={Send}
        title="Η καταγραφή ολοκληρώθηκε!"
        description="Το κατοικίδιο καταχωρήθηκε με επιτυχία στο σύστημα."
        buttonText="Επιστροφή στην Αρχική Κτηνιάτρου"
        onButtonClick={() => navigate(ROUTES.vet.dashboard)}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Καταγραφή Κατοικιδίου"
      />
    );
  }

  return (
    <PageLayout title="Καταγραφή Κατοικιδίου" breadcrumbs={breadcrumbItems}>
      <div className="register">
        <h1 className="register__title">Καταγραφή Κατοικιδίου</h1>
        {/* Info Banner */}
        <div className="register__banner">
          <div className="register__banner-icon">
            <AlertCircle size={20} />
          </div>
          <div className="register__banner-content">
            <h3 className="register__banner-title">Σημείωση</h3>
            <p className="register__banner-text">
              Ο αριθμός μικροτσίπ είναι υποχρεωτικός και μοναδικός για κάθε κατοικίδιο.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="register__form-wrapper">
          <h2 className="register__section-title">Ταυτότητα Κατοικιδίου</h2>

          <form className="register__form" onSubmit={handleSubmit}>
            {/* Pet Identity Section */}
            <div className="register__section">
              <div className="register__field">
                <label className="register__label">
                  Αριθμός Μικροτσίπ <span className="register__required">*</span>
                </label>
                <input
                  type="text"
                  name="microchipNumber"
                  className={`register__input ${microchipError ? 'register__input--error' : ''}`}
                  placeholder="123456789012345 (15 ψηφία)"
                  value={formData.microchipNumber}
                  onChange={handleInputChange}
                  maxLength={15}
                  required
                />
                <span className="register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {microchipError && (
                  <span className="register__error-message">
                    <AlertCircle size={14} />
                    {microchipError}
                  </span>
                )}
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Είδος Ζώου <span className="register__required">*</span>
                  </label>
                  <CustomSelect
                    name="species"
                    value={formData.species}
                    onChange={(value) => handleSelectChange('species', value)}
                    options={[
                      { value: 'dog', label: 'Σκύλος' },
                      { value: 'cat', label: 'Γάτα' },
                      { value: 'bird', label: 'Πτηνό' },
                      { value: 'reptile', label: 'Ερπετό' },
                      { value: 'other', label: 'Άλλο' }
                    ]}
                    placeholder="Επιλέξτε είδος"
                    required
                  />
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Ράτσα <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="breed"
                    className="register__input"
                    placeholder="π.χ. Golden Retriever"
                    value={formData.breed}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Αν η ράτσα δεν είναι γνωστή συμπληρώστε "Ημίαιμο". Επιτρέπονται μόνο γράμματα και κενά.</span>
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Όνομα Κατοικιδίου <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    className="register__input"
                    placeholder="Γράψτε το όνομα του κατοικιδίου"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Φύλο <span className="register__required">*</span>
                  </label>
                  <CustomSelect
                    name="gender"
                    value={formData.gender}
                    onChange={(value) => handleSelectChange('gender', value)}
                    options={[
                      { value: 'male', label: 'Αρσενικό' },
                      { value: 'female', label: 'Θηλυκό' }
                    ]}
                    placeholder="Επιλέξτε φύλο"
                    required
                  />
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Ημερομηνία Γέννησης <span className="register__required">*</span>
                  </label>
                  <DatePicker
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    maxDate={new Date()}
                  />
                  <span className="register__field-note">Συμπληρώστε κατά προσέγγιση αν δεν γνωρίζετε την ακριβή ημερομηνία γέννησης</span>
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Χρώμα <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    className="register__input"
                    placeholder="π.χ. Καφέ με λευκές βούλες"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
              </div>

              <div className="register__field register__field--small">
                <label className="register__label">
                  Βάρος (kg) <span className="register__required">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  className="register__input"
                  placeholder="π.χ. 25.5"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Owner Information Section */}
            <div className="register__section">
              <h2 className="register__section-title">Στοιχεία Ιδιοκτήτη</h2>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Ονοματεπώνυμο <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerLastName"
                    className="register__input"
                    placeholder="π.χ. Γιάννης Παπαδόπουλος"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Τηλέφωνο <span className="register__required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    className="register__input"
                    placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Email <span className="register__required">*</span>
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    className="register__input"
                    placeholder="example@email.com"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Διεύθυνση <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerAddress"
                    className="register__input"
                    placeholder="π.χ. Σαρανταπόρου 5, 15342"
                    value={formData.ownerAddress}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Οδός, Αριθμός, Τ.Κ.</span>
                </div>
              </div>

              <div className="register__field register__field--small">
                <label className="register__label">
                  ΑΦΜ <span className="register__required">*</span>
                </label>
                <input
                  type="text"
                  name="afm"
                  className={`register__input ${afmError ? 'register__input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.afm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {afmError && (
                  <span className="register__error-message">
                    <AlertCircle size={14} />
                    {afmError}
                  </span>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="register__actions">
              <button
                type="button"
                className="register__btn register__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="register__btn register__btn--submit"
                disabled={!isFormValid()}
              >
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την καταγραφή του κατοικιδίου;"
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
          title="Επιβεβαίωση Καταγραφής"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της καταγραφής:"
          fields={confirmFields}
          cancelText="Επιστροφή"
          confirmText="Επιβεβαίωση"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />

        {/* Notification */}
        <Notification
          isVisible={notification !== null}
          message="Η καταγραφή του κατοικιδίου ακυρώθηκε με επιτυχία!"
          type="error"
        />
      </div>
    </PageLayout>
  );
};

export default Register;
