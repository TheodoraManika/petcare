import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, UserRoundPlus, ArrowLeftRight, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import ProgressBar from '../../components/common/ProgressBar';
import DatePicker from '../../components/common/DatePicker';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Transfer.css';

const Transfer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [microchipError, setMicrochipError] = useState('');
  const [currentOwnerAfmError, setCurrentOwnerAfmError] = useState('');
  const [newOwnerAfmError, setNewOwnerAfmError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Pet Data
    microchipNumber: '',
    petName: '',
    
    // Step 2: Current Owner Data
    currentOwnerAfm: '',
    currentOwnerName: '',
    currentOwnerSurname: '',
    currentOwnerPhone: '',
    currentOwnerEmail: '',
    
    // Step 3: New Owner Data
    newOwnerAfm: '',
    newOwnerName: '',
    newOwnerSurname: '',
    newOwnerPhone: '',
    newOwnerEmail: '',
    newOwnerAddress: '',
    newOwnerCity: '',
    newOwnerPostalCode: '',
    
    // Step 4: Transfer Data
    transferDate: '',
    transferReason: '',
    notes: ''
  });

  const steps = [
    { icon: <PawPrint size={24} />, label: 'Κατοικίδιο' },
    { icon: <UserRound size={24} />, label: 'Ιδιοκτήτης' },
    { icon: <UserRoundPlus size={24} />, label: 'Νέος Ιδιοκτήτης' },
    { icon: <ArrowLeftRight size={24} />, label: 'Μεταβίβαση' }
  ];

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
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      if (numericValue.length > 0 && numericValue.length !== 15) {
        setMicrochipError('Ο αριθμός μικροτσίπ πρέπει να έχει ακριβώς 15 ψηφία');
      } else {
        setMicrochipError('');
      }
    } 
    // Special handling for pet name
    else if (name === 'petName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for current owner AFM
    else if (name === 'currentOwnerAfm') {
      const numericValue = allowedAFMChars(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      if (numericValue.length > 0 && numericValue.length !== 9) {
        setCurrentOwnerAfmError('Το Α.Φ.Μ. πρέπει να έχει ακριβώς 9 ψηφία');
      } else {
        setCurrentOwnerAfmError('');
      }
    }
    // Special handling for current owner name
    else if (name === 'currentOwnerName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for current owner surname
    else if (name === 'currentOwnerSurname') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for current owner phone
    else if (name === 'currentOwnerPhone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for current owner email
    else if (name === 'currentOwnerEmail') {
      const filteredValue = allowedEmailChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for new owner AFM
    else if (name === 'newOwnerAfm') {
      const numericValue = allowedAFMChars(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      if (numericValue.length > 0 && numericValue.length !== 9) {
        setNewOwnerAfmError('Το Α.Φ.Μ. πρέπει να έχει ακριβώς 9 ψηφία');
      } else {
        setNewOwnerAfmError('');
      }
    }
    // Special handling for new owner name
    else if (name === 'newOwnerName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for new owner surname
    else if (name === 'newOwnerSurname') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for new owner phone
    else if (name === 'newOwnerPhone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for new owner email
    else if (name === 'newOwnerEmail') {
      const filteredValue = allowedEmailChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for new owner city
    else if (name === 'newOwnerCity') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for postal code
    else if (name === 'newOwnerPostalCode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.microchipNumber.trim() !== '' && 
          formData.microchipNumber.length === 15 && 
          formData.petName.trim() !== ''
        );
      case 2:
        return (
          formData.currentOwnerAfm.trim() !== '' &&
          formData.currentOwnerAfm.length === 9 &&
          formData.currentOwnerName.trim() !== '' &&
          formData.currentOwnerSurname.trim() !== '' &&
          formData.currentOwnerPhone.trim() !== '' &&
          formData.currentOwnerEmail.trim() !== ''
        );
      case 3:
        return (
          formData.newOwnerAfm.trim() !== '' &&
          formData.newOwnerAfm.length === 9 &&
          formData.newOwnerName.trim() !== '' &&
          formData.newOwnerSurname.trim() !== '' &&
          formData.newOwnerPhone.trim() !== '' &&
          formData.newOwnerEmail.trim() !== '' &&
          formData.newOwnerAddress.trim() !== '' &&
          formData.newOwnerCity.trim() !== '' &&
          formData.newOwnerPostalCode.trim() !== ''
        );
      case 4:
        return (
          formData.transferDate.trim() !== '' &&
          formData.transferReason.trim() !== ''
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show confirmation modal instead of submitting directly
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

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Reset form data to initial empty state
    setFormData({
      microchipNumber: '',
      petName: '',
      currentOwnerAfm: '',
      currentOwnerName: '',
      currentOwnerSurname: '',
      currentOwnerPhone: '',
      currentOwnerEmail: '',
      newOwnerAfm: '',
      newOwnerName: '',
      newOwnerSurname: '',
      newOwnerPhone: '',
      newOwnerEmail: '',
      newOwnerAddress: '',
      newOwnerCity: '',
      newOwnerPostalCode: '',
      transferDate: '',
      transferReason: '',
      notes: ''
    });
    // Reset error states
    setMicrochipError('');
    setCurrentOwnerAfmError('');
    setNewOwnerAfmError('');
    // Reset to step 1
    setCurrentStep(1);
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
    { label: 'Όνομα Κατοικιδίου', value: formData.petName },
    { label: 'Τρέχων Ιδιοκτήτης - Α.Φ.Μ.', value: formData.currentOwnerAfm },
    { label: 'Τρέχων Ιδιοκτήτης - Όνομα', value: formData.currentOwnerName },
    { label: 'Τρέχων Ιδιοκτήτης - Επώνυμο', value: formData.currentOwnerSurname },
    { label: 'Τρέχων Ιδιοκτήτης - Τηλέφωνο', value: formData.currentOwnerPhone },
    { label: 'Τρέχων Ιδιοκτήτης - Email', value: formData.currentOwnerEmail },
    { label: 'Νέος Ιδιοκτήτης - Α.Φ.Μ.', value: formData.newOwnerAfm },
    { label: 'Νέος Ιδιοκτήτης - Όνομα', value: formData.newOwnerName },
    { label: 'Νέος Ιδιοκτήτης - Επώνυμο', value: formData.newOwnerSurname },
    { label: 'Νέος Ιδιοκτήτης - Τηλέφωνο', value: formData.newOwnerPhone },
    { label: 'Νέος Ιδιοκτήτης - Email', value: formData.newOwnerEmail },
    { label: 'Νέος Ιδιοκτήτης - Διεύθυνση', value: formData.newOwnerAddress },
    { label: 'Νέος Ιδιοκτήτης - Πόλη', value: formData.newOwnerCity },
    { label: 'Νέος Ιδιοκτήτης - Τ.Κ.', value: formData.newOwnerPostalCode },
    { label: 'Ημερομηνία Μεταβίβασης', value: formData.transferDate },
    { label: 'Λόγος Μεταβίβασης', value: formData.transferReason },
    { label: 'Σημειώσεις', value: formData.notes || '-' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="transfer__step-content">
            <h2 className="transfer__step-title">Στοιχεία Κατοικιδίου</h2>
            
            <div className="transfer__field">
              <label className="transfer__label">
                Κωδικός Μικροτσίπ <span className="transfer__required">*</span>
              </label>
              <input
                type="text"
                name="microchipNumber"
                className={`transfer__input ${microchipError ? 'transfer__input--error' : ''}`}
                placeholder="123456789012345 (15 ψηφία)"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
              <span className="transfer__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              {microchipError && (
                <span className="transfer__error-message">
                  <AlertCircle size={14} />
                  {microchipError}
                </span>
              )}
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Όνομα Κατοικιδίου <span className="transfer__required">*</span>
              </label>
              <input
                type="text"
                name="petName"
                className="transfer__input"
                placeholder="Γράψτε το όνομα του κατοικιδίου"
                value={formData.petName}
                onChange={handleInputChange}
                required
              />
              <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="transfer__step-content">
            <h2 className="transfer__step-title">Στοιχεία Τρέχοντος Ιδιοκτήτη</h2>
            
            <div className="transfer__row">
              <div className="transfer__field">
                <label className="transfer__label">
                  Α.Φ.Μ. <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="currentOwnerAfm"
                  className={`transfer__input ${currentOwnerAfmError ? 'transfer__input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.currentOwnerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {currentOwnerAfmError && (
                  <span className="transfer__error-message">
                    <AlertCircle size={14} />
                    {currentOwnerAfmError}
                  </span>
                )}
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Όνομα <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="currentOwnerName"
                  className="transfer__input"
                  placeholder="π.χ. Γιάννης"
                  value={formData.currentOwnerName}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>

            <div className="transfer__row">
              <div className="transfer__field">
                <label className="transfer__label">
                  Επώνυμο <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="currentOwnerSurname"
                  className="transfer__input"
                  placeholder="π.χ. Ιωάννου"
                  value={formData.currentOwnerSurname}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Τηλέφωνο <span className="transfer__required">*</span>
                </label>
                <input
                  type="tel"
                  name="currentOwnerPhone"
                  className="transfer__input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.currentOwnerPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Email <span className="transfer__required">*</span>
              </label>
              <input
                type="email"
                name="currentOwnerEmail"
                className="transfer__input"
                placeholder="example@email.com"
                value={formData.currentOwnerEmail}
                onChange={handleInputChange}
                required
              />
              <span className="transfer__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="transfer__step-content">
            <h2 className="transfer__step-title">Στοιχεία Νέου Ιδιοκτήτη</h2>
            
            <div className="transfer__row">
              <div className="transfer__field">
                <label className="transfer__label">
                  Α.Φ.Μ. <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerAfm"
                  className={`transfer__input ${newOwnerAfmError ? 'transfer__input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.newOwnerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {newOwnerAfmError && (
                  <span className="transfer__error-message">
                    <AlertCircle size={14} />
                    {newOwnerAfmError}
                  </span>
                )}
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Όνομα <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerName"
                  className="transfer__input"
                  placeholder="π.χ. Μαρία"
                  value={formData.newOwnerName}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>

            <div className="transfer__row">
              <div className="transfer__field">
                <label className="transfer__label">
                  Επώνυμο <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerSurname"
                  className="transfer__input"
                  placeholder="π.χ. Ιωάννου"
                  value={formData.newOwnerSurname}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Τηλέφωνο <span className="transfer__required">*</span>
                </label>
                <input
                  type="tel"
                  name="newOwnerPhone"
                  className="transfer__input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.newOwnerPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Email <span className="transfer__required">*</span>
              </label>
              <input
                type="email"
                name="newOwnerEmail"
                className="transfer__input"
                placeholder="example@email.com"
                value={formData.newOwnerEmail}
                onChange={handleInputChange}
                required
              />
              <span className="transfer__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Διεύθυνση <span className="transfer__required">*</span>
              </label>
              <input
                type="text"
                name="newOwnerAddress"
                className="transfer__input"
                placeholder="π.χ. Ακαδημίας 25"
                value={formData.newOwnerAddress}
                onChange={handleInputChange}
                required
              />
              <span className="transfer__field-note">Οδός, Αριθμός</span>
            </div>

            <div className="transfer__row">
              <div className="transfer__field">
                <label className="transfer__label">
                  Πόλη <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerCity"
                  className="transfer__input"
                  placeholder="π.χ. Αθήνα"
                  value={formData.newOwnerCity}
                  onChange={handleInputChange}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Τ.Κ. <span className="transfer__required">*</span>
                </label>
                <input
                  type="text"
                  name="newOwnerPostalCode"
                  className="transfer__input"
                  placeholder="π.χ. 10564"
                  value={formData.newOwnerPostalCode}
                  onChange={handleInputChange}
                  maxLength={5}
                  required
                />
                <span className="transfer__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="transfer__step-content">
            <h2 className="transfer__step-title">Στοιχεία Μεταβίβασης</h2>
            
            <div className="transfer__field">
              <label className="transfer__label">
                Ημερομηνία Μεταβίβασης <span className="transfer__required">*</span>
              </label>
              <DatePicker
                name="transferDate"
                value={formData.transferDate}
                onChange={handleInputChange}
                maxDate={new Date()}
              />
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Λόγος Μεταβίβασης <span className="transfer__required">*</span>
              </label>
              <input
                type="text"
                name="transferReason"
                className="transfer__input"
                placeholder="Αναφέρετε συνοπτικά το λόγο μεταβίβασης"
                value={formData.transferReason}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Σημειώσεις
              </label>
              <textarea
                name="notes"
                className="transfer__textarea"
                placeholder="Πρόσθετες πληροφορίες..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard },
    { label: 'Δηλώσεις Συμβάντων Ζωής', path: ROUTES.vet.lifeEvents }
  ];

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={ArrowLeftRight}
        title="Η Δήλωση Μεταβίβασης ολοκληρώθηκε!"
        description="Η αλλαγή ιδιοκτήτη καταχωρήθηκε επιτυχώς στο σύστημα. Το κατοικίδιο έχει μεταφερθεί στο προφίλ του νέου ιδιοκτήτη."
        buttonText="Επιστροφή στο Μενού"
        onButtonClick={handleSuccessReturn}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Δήλωση Μεταβίβασης"
      />
    );
  }

  return (
    <PageLayout title="Δήλωση Μεταβίβασης" breadcrumbs={breadcrumbItems}>
      <div className="transfer">
        <div className="transfer__header">
          <h1 className="transfer__title">Δήλωση Μεταβίβασης</h1>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="transfer__form-wrapper">
          <form className="transfer__form">
            {renderStepContent()}

            <div className="transfer__actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="transfer__btn transfer__btn--secondary"
                  onClick={handlePrevious}
                >
                  Προηγούμενη
                </button>
              )}
              
              <button
                type="button"
                className="transfer__btn transfer__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="transfer__btn transfer__btn--primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {currentStep === 4 ? 'Υποβολή Δήλωσης' : 'Επόμενη'}
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την δήλωση μεταβίβασης;"
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
          title="Επιβεβαίωση Μεταβίβασης"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της μεταβίβασης:"
          fields={confirmFields}
          cancelText="Επιστροφή"
          confirmText="Επιβεβαίωση"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />
      </div>

      {/* Notification */}
      <Notification
        isVisible={notification !== null}
        message="Η δήλωση μεταβίβασης ακυρώθηκε με επιτυχία!"
        type="error"
      />
    </PageLayout>
  );
};

export default Transfer;
