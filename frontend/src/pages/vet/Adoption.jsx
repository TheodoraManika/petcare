import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, Heart, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import ProgressBar from '../../components/common/forms/ProgressBar';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import SuccessPage from '../../components/common/modals/SuccessPage';
import Notification from '../../components/common/modals/Notification';
import MicrochipSearch from '../../components/common/forms/MicrochipSearch';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES } from '../../utils/constants';
import './Adoption.css';

// Mock lost pets database


const Adoption = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  const [ownerAfmError, setOwnerAfmError] = useState('');
  const [foundPet, setFoundPet] = useState(null);



  const [formData, setFormData] = useState({
    // Step 1: Pet Data
    microchipNumber: '',


    // Step 2: Owner Data
    ownerAfm: '',
    ownerName: '',
    ownerSurname: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    ownerCity: '',
    ownerPostalCode: '',

    // Step 3: Adoption Data
    adoptionDate: '',
    adoptionReason: '',
    shelterOwner: '',
    liveWithOtherPets: '',
    existingPets: '',
    notes: ''
  });

  const steps = [
    { icon: <PawPrint size={24} />, label: 'Κατοικίδιο' },
    { icon: <UserRound size={24} />, label: 'Ιδιοκτήτης' },
    { icon: <Heart size={24} />, label: 'Υιοθεσία' }
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

  const handleSearchComplete = (result) => {
    const { found, pet, microchip } = result;

    if (found && pet) {
      // Pet found - prefill with data
      setFormData(prev => ({
        ...prev,
        microchipNumber: pet.microchip,
        petName: pet.name,
        species: pet.type,
      }));
      setFoundPet(pet);
    } else {
      // Pet not found - just set microchip
      setFormData(prev => ({
        ...prev,
        microchipNumber: microchip,
        microchipNumber: microchip,
      }));
      setFoundPet({ microchip });
      setFoundPet({ microchip });
      // Removed error handling for microchip as field is hidden
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;


    // Special handling for owner AFM
    if (name === 'ownerAfm') {
      const numericValue = allowedAFMChars(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));

      if (numericValue.length > 0 && numericValue.length !== 9) {
        setOwnerAfmError('Το Α.Φ.Μ. πρέπει να έχει ακριβώς 9 ψηφία');
      } else {
        setOwnerAfmError('');
      }
    }
    // Special handling for owner name
    else if (name === 'ownerName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for owner surname
    else if (name === 'ownerSurname') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for owner phone
    else if (name === 'ownerPhone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for owner email
    else if (name === 'ownerEmail') {
      const filteredValue = allowedEmailChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for owner city
    else if (name === 'ownerCity') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for postal code
    else if (name === 'ownerPostalCode') {
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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.microchipNumber.trim() !== '' &&
          formData.microchipNumber.length === 15
        );
      case 2:
        return (
          formData.ownerAfm.trim() !== '' &&
          formData.ownerAfm.length === 9 &&
          formData.ownerName.trim() !== '' &&
          formData.ownerSurname.trim() !== '' &&
          formData.ownerPhone.trim() !== '' &&
          formData.ownerEmail.trim() !== '' &&
          formData.ownerAddress.trim() !== '' &&
          formData.ownerCity.trim() !== '' &&
          formData.ownerPostalCode.trim() !== ''
        );
      case 3:
        return (
          formData.adoptionDate.trim() !== '' &&
          formData.adoptionReason.trim() !== '' &&
          formData.shelterOwner.trim() !== '' &&
          formData.liveWithOtherPets.trim() !== '' &&
          formData.existingPets.trim() !== ''
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
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
    // Reset found pet
    setFoundPet(null);
    // Reset form data to initial empty state
    setFormData({
      microchipNumber: '',

      ownerAfm: '',
      ownerName: '',
      ownerSurname: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: '',
      ownerCity: '',
      ownerPostalCode: '',
      adoptionDate: '',
      adoptionReason: '',
      shelterOwner: '',
      liveWithOtherPets: '',
      existingPets: '',
      notes: ''
    });
    // Reset error states
    setOwnerAfmError('');
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

  // Helper functions for labels
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

  const getGenderLabel = (value) => {
    const options = {
      'male': 'Αρσενικό',
      'female': 'Θηλυκό'
    };
    return options[value] || value;
  };

  const getYesNoLabel = (value) => {
    return value === 'yes' ? 'Ναι' : 'Όχι';
  };

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.microchipNumber },

    { label: 'Ιδιοκτήτης - Α.Φ.Μ.', value: formData.ownerAfm },
    { label: 'Ιδιοκτήτης - Όνομα', value: formData.ownerName },
    { label: 'Ιδιοκτήτης - Επώνυμο', value: formData.ownerSurname },
    { label: 'Ιδιοκτήτης - Τηλέφωνο', value: formData.ownerPhone },
    { label: 'Ιδιοκτήτης - Email', value: formData.ownerEmail },
    { label: 'Ιδιοκτήτης - Διεύθυνση', value: formData.ownerAddress },
    { label: 'Ιδιοκτήτης - Πόλη', value: formData.ownerCity },
    { label: 'Ιδιοκτήτης - Τ.Κ.', value: formData.ownerPostalCode },
    { label: 'Ημερομηνία Υιοθεσίας', value: formData.adoptionDate },
    { label: 'Καταφύγιο/Φιλοζωική', value: formData.adoptionReason },
    { label: 'Διαθέσιμος Κήπος/Αυλή', value: getYesNoLabel(formData.shelterOwner) },
    { label: 'Υπάρχουν άλλα κατοικίδια', value: getYesNoLabel(formData.liveWithOtherPets) },
    { label: 'Υπάρχει εμπειρία', value: getYesNoLabel(formData.existingPets) },
    { label: 'Σημειώσεις', value: formData.notes || '-' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="adoption__step-content">
            <h2 className="adoption__step-title">Στοιχεία Κατοικιδίου</h2>

            {foundPet ? (
              <PetDetailsCard
                petData={foundPet}
                onClear={() => {
                  setFoundPet(null);
                  setFormData(prev => ({
                    ...prev,
                    microchipNumber: '',
                    microchipNumber: '',
                  }));
                }}
                variant="vet"
              />
            ) : (
              <>
                <MicrochipSearch
                  onSearchComplete={handleSearchComplete}
                  variant="vet"
                />


              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="adoption__step-content">
            <h2 className="adoption__step-title">Στοιχεία Ιδιοκτήτη</h2>

            <div className="adoption__row">
              <div className="adoption__field">
                <label className="adoption__label">
                  Α.Φ.Μ. <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerAfm"
                  className={`adoption__input ${ownerAfmError ? 'adoption__input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.ownerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {ownerAfmError && (
                  <div className="adoption__error-message">
                    <AlertCircle size={16} />
                    <span>{ownerAfmError}</span>
                  </div>
                )}
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Όνομα <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  className="adoption__input"
                  placeholder="π.χ. Μαρία"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>

            <div className="adoption__row">
              <div className="adoption__field">
                <label className="adoption__label">
                  Επώνυμο <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerSurname"
                  className="adoption__input"
                  placeholder="π.χ. Ιωάννου"
                  value={formData.ownerSurname}
                  onChange={handleInputChange}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Τηλέφωνο <span className="adoption__required">*</span>
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  className="adoption__input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>

            <div className="adoption__field">
              <label className="adoption__label">
                Email <span className="adoption__required">*</span>
              </label>
              <input
                type="email"
                name="ownerEmail"
                className="adoption__input"
                placeholder="example@email.com"
                value={formData.ownerEmail}
                onChange={handleInputChange}
                required
              />
              <span className="adoption__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
            </div>

            <div className="adoption__field">
              <label className="adoption__label">
                Διεύθυνση <span className="adoption__required">*</span>
              </label>
              <input
                type="text"
                name="ownerAddress"
                className="adoption__input"
                placeholder="π.χ. Ακαδημίας 25"
                value={formData.ownerAddress}
                onChange={handleInputChange}
                required
              />
              <span className="adoption__field-note">Οδός, Αριθμός</span>
            </div>

            <div className="adoption__row">
              <div className="adoption__field">
                <label className="adoption__label">
                  Πόλη <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerCity"
                  className="adoption__input"
                  placeholder="π.χ. Αθήνα"
                  value={formData.ownerCity}
                  onChange={handleInputChange}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Τ.Κ. <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerPostalCode"
                  className="adoption__input"
                  placeholder="π.χ. 10564"
                  value={formData.ownerPostalCode}
                  onChange={handleInputChange}
                  maxLength={5}
                  required
                />
                <span className="adoption__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="adoption__step-content">
            <h2 className="adoption__step-title">Στοιχεία Υιοθεσίας</h2>

            <div className="adoption__field">
              <label className="adoption__label">
                Ημερομηνία Υιοθεσίας <span className="adoption__required">*</span>
              </label>
              <DatePicker
                name="adoptionDate"
                value={formData.adoptionDate}
                onChange={handleInputChange}
                maxDate={new Date()}
              />
            </div>

            <div className="adoption__field">
              <label className="adoption__label">
                Καταφύγιο/Φιλοζωική στο οποίο ανήκει το ζώο <span className="adoption__required">*</span>
              </label>
              <textarea
                name="adoptionReason"
                className="adoption__textarea"
                placeholder="Σημειώστε..."
                value={formData.adoptionReason}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="adoption__row adoption__row--three-cols">
              <div className="adoption__field">
                <label className="adoption__label">
                  Διαθέσιμος Κήπος/Αυλή <span className="adoption__required">*</span>
                </label>
                <div className="adoption__radio-group">
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="shelterOwner"
                      value="yes"
                      checked={formData.shelterOwner === 'yes'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Ναι</span>
                  </label>
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="shelterOwner"
                      value="no"
                      checked={formData.shelterOwner === 'no'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Όχι</span>
                  </label>
                </div>
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Υπάρχουν άλλα κατοικίδια; <span className="adoption__required">*</span>
                </label>
                <div className="adoption__radio-group">
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="liveWithOtherPets"
                      value="yes"
                      checked={formData.liveWithOtherPets === 'yes'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Ναι</span>
                  </label>
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="liveWithOtherPets"
                      value="no"
                      checked={formData.liveWithOtherPets === 'no'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Όχι</span>
                  </label>
                </div>
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Υπάρχει εμπειρία με κατοικίδια; <span className="adoption__required">*</span>
                </label>
                <div className="adoption__radio-group">
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="existingPets"
                      value="yes"
                      checked={formData.existingPets === 'yes'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Ναι</span>
                  </label>
                  <label className="adoption__radio-label">
                    <input
                      type="radio"
                      name="existingPets"
                      value="no"
                      checked={formData.existingPets === 'no'}
                      onChange={handleInputChange}
                      className="adoption__radio-input"
                    />
                    <span className="adoption__radio-text">Όχι</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="adoption__field">
              <label className="adoption__label">
                Σημειώσεις
              </label>
              <textarea
                name="notes"
                className="adoption__textarea"
                placeholder="Πρόσθετες πληροφορίες για την υιοθεσία..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Δηλώσεις Συμβάντων Ζωής', path: ROUTES.vet.lifeEvents }
  ];

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={Heart}
        title="Η Δήλωση Υιοθεσίας ολοκληρώθηκε!"
        description="Η υιοθεσία καταχωρήθηκε επιτυχώς στο σύστημα. Το κατοικίδιο προστέθηκε στο προφίλ του ιδιοκτήτη."
        buttonText="Επιστροφή στην Αρχική Κτηνιάτρου"
        onButtonClick={handleSuccessReturn}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Δήλωση Υιοθεσίας"
      />
    );
  }

  return (
    <PageLayout title="Δήλωση Υιοθεσίας" breadcrumbs={breadcrumbItems}>
      <div className="adoption">
        <div className="adoption__header">
          <h1 className="adoption__title">Δήλωση Υιοθεσίας</h1>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="adoption__form-wrapper">
          <form className="adoption__form">
            {renderStepContent()}

            <div className="adoption__actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="adoption__btn adoption__btn--secondary"
                  onClick={handlePrevious}
                >
                  Προηγούμενη
                </button>
              )}

              <button
                type="button"
                className="adoption__btn adoption__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="adoption__btn adoption__btn--primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                {currentStep === 3 ? 'Υποβολή Δήλωσης' : 'Επόμενη'}
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την δήλωση υιοθεσίας;"
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
          title="Επιβεβαίωση Υιοθεσίας"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της υιοθεσίας:"
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
        message="Η δήλωση υιοθεσίας ακυρώθηκε με επιτυχία!"
        type="error"
      />
    </PageLayout>
  );
};

export default Adoption;
