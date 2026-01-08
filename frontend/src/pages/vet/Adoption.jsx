import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, Heart } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import ProgressBar from '../../components/common/ProgressBar';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Adoption.css';

const Adoption = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Pet Data
    microchipNumber: '',
    petName: '',
    species: '',
    age: '',
    gender: '',
    
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          formData.petName.trim() !== '' &&
          formData.species.trim() !== '' &&
          formData.age.trim() !== '' &&
          formData.gender.trim() !== ''
        );
      case 2:
        return (
          formData.ownerAfm.trim() !== '' &&
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
    // Reset form data to initial empty state
    setFormData({
      microchipNumber: '',
      petName: '',
      species: '',
      age: '',
      gender: '',
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
    { label: 'Όνομα Κατοικιδίου', value: formData.petName },
    { label: 'Είδος Ζώου', value: getSpeciesLabel(formData.species) },
    { label: 'Ηλικία (έτη)', value: formData.age },
    { label: 'Φύλο', value: getGenderLabel(formData.gender) },
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
            
            <div className="adoption__field">
              <label className="adoption__label">
                Κωδικός Μικροτσίπ<span className="adoption__required">*</span>
              </label>
              <input
                type="text"
                name="microchipNumber"
                className="adoption__input"
                placeholder="GR123456789012345"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
            </div>

            <div className="adoption__row">
              <div className="adoption__field">
                <label className="adoption__label">
                  Είδος Ζώου<span className="adoption__required">*</span>
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
                />
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Ηλικία (σε έτη) <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="age"
                  className="adoption__input"
                  placeholder="π.χ. 2"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="adoption__row">
              <div className="adoption__field">
                <label className="adoption__label">
                  Φύλο <span className="adoption__required">*</span>
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
                />
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Όνομα Κατοικιδίου <span className="adoption__required">*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  className="adoption__input"
                  value={formData.petName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
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
                  className="adoption__input"
                  placeholder="123456789"
                  value={formData.ownerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
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
              </div>

              <div className="adoption__field">
                <label className="adoption__label">
                  Τηλέφωνο <span className="adoption__required">*</span>
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  className="adoption__input"
                  placeholder="6912345678"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  required
                />
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
    { label: 'Μενού', path: ROUTES.vet.dashboard },
    { label: 'Δηλώσεις Συμβάντων Ζωής', path: ROUTES.vet.lifeEvents }
  ];

  // Show success page after successful submission
  if (showSuccess) {
    return (
      <SuccessPage
        icon={Heart}
        title="Η Δήλωση Υιοθεσίας ολοκληρώθηκε!"
        description="Η υιοθεσία καταχωρήθηκε επιτυχώς στο σύστημα. Το κατοικίδιο προστέθηκε στο προφίλ του ιδιοκτήτη."
        buttonText="Επιστροφή στο Μενού"
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
