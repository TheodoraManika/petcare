import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, HandHeart, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import ProgressBar from '../../components/common/forms/ProgressBar';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import SuccessPage from '../../components/common/modals/SuccessPage';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './Foster.css';

const Foster = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);
  const [microchipError, setMicrochipError] = useState('');
  const [fosterParentAfmError, setFosterParentAfmError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Pet Data
    microchipNumber: '',
    petName: '',
    species: '',
    age: '',
    gender: '',
    
    // Step 2: Foster Parent Data
    fosterParentAfm: '',
    fosterParentName: '',
    fosterParentSurname: '',
    fosterParentPhone: '',
    fosterParentEmail: '',
    fosterParentAddress: '',
    fosterParentCity: '',
    fosterParentPostalCode: '',
    fosterParentLat: '',
    fosterParentLon: '',

    // Step 3: Fosterage Data
    fosterDate: '',
    fosterReason: '',
    shelterOwner: '',
    liveWithOtherPets: '',
    existingPets: '',
    notes: ''
  });

  const steps = [
    { icon: <PawPrint size={24} />, label: 'Κατοικίδιο' },
    { icon: <UserRound size={24} />, label: 'Ανάδοχος' },
    { icon: <HandHeart size={24} />, label: 'Αναδοχή' }
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
    // Special handling for foster parent AFM
    else if (name === 'fosterParentAfm') {
      const numericValue = allowedAFMChars(value);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      if (numericValue.length > 0 && numericValue.length !== 9) {
        setFosterParentAfmError('Το Α.Φ.Μ. πρέπει να έχει ακριβώς 9 ψηφία');
      } else {
        setFosterParentAfmError('');
      }
    }
    // Special handling for foster parent name
    else if (name === 'fosterParentName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for foster parent surname
    else if (name === 'fosterParentSurname') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for foster parent phone
    else if (name === 'fosterParentPhone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for foster parent email
    else if (name === 'fosterParentEmail') {
      const filteredValue = allowedEmailChars(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for foster parent city
    else if (name === 'fosterParentCity') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    }
    // Special handling for foster parent postal code
    else if (name === 'fosterParentPostalCode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    }
    // Special handling for age
    else if (name === 'age') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    }
    // All other fields
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
          formData.microchipNumber.length === 15 &&
          formData.petName.trim() !== '' &&
          formData.species.trim() !== '' &&
          formData.age.trim() !== '' &&
          formData.gender.trim() !== ''
        );
      case 2:
        return (
          formData.fosterParentAfm.trim() !== '' &&
          formData.fosterParentAfm.length === 9 &&
          formData.fosterParentName.trim() !== '' &&
          formData.fosterParentSurname.trim() !== '' &&
          formData.fosterParentPhone.trim() !== '' &&
          formData.fosterParentEmail.trim() !== '' &&
          formData.fosterParentAddress.trim() !== '' &&
          formData.fosterParentCity.trim() !== '' &&
          formData.fosterParentPostalCode.trim() !== ''
        );
      case 3:
        return (
          formData.fosterDate.trim() !== '' &&
          formData.fosterReason.trim() !== '' &&
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
      fosterParentAfm: '',
      fosterParentName: '',
      fosterParentSurname: '',
      fosterParentPhone: '',
      fosterParentEmail: '',
      fosterParentAddress: '',
      fosterParentCity: '',
      fosterParentPostalCode: '',
      fosterParentLat: '',
      fosterParentLon: '',
      fosterDate: '',
      fosterReason: '',
      shelterOwner: '',
      liveWithOtherPets: '',
      existingPets: '',
      notes: ''
    });
    // Reset error states
    setMicrochipError('');
    setFosterParentAfmError('');
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
    { label: 'Ανάδοχος - Α.Φ.Μ.', value: formData.fosterParentAfm },
    { label: 'Ανάδοχος - Όνομα', value: formData.fosterParentName },
    { label: 'Ανάδοχος - Επώνυμο', value: formData.fosterParentSurname },
    { label: 'Ανάδοχος - Τηλέφωνο', value: formData.fosterParentPhone },
    { label: 'Ανάδοχος - Email', value: formData.fosterParentEmail },
    { label: 'Ανάδοχος - Διεύθυνση', value: formData.fosterParentAddress },
    { label: 'Ανάδοχος - Πόλη', value: formData.fosterParentCity },
    { label: 'Ανάδοχος - Τ.Κ.', value: formData.fosterParentPostalCode },
    { label: 'Ημερομηνία Αναδοχής', value: formData.fosterDate },
    { label: 'Καταφύγιο/Φιλοζωική', value: formData.fosterReason },
    { label: 'Διαθέσιμος Κήπος/Αυλή', value: getYesNoLabel(formData.shelterOwner) },
    { label: 'Υπάρχουν άλλα κατοικίδια', value: getYesNoLabel(formData.liveWithOtherPets) },
    { label: 'Υπάρχει εμπειρία', value: getYesNoLabel(formData.existingPets) },
    { label: 'Σημειώσεις', value: formData.notes || '-' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="foster__step-content">
            <h2 className="foster__step-title">Στοιχεία Κατοικιδίου</h2>
            
            <div className="foster__field">
              <label className="foster__label">
                Κωδικός Μικροτσίπ<span className="foster__required"> *</span>
              </label>
              <input
                type="text"
                name="microchipNumber"
                className={`foster__input ${microchipError ? 'foster__input--error' : ''}`}
                placeholder="123456789012345 (15 ψηφία)"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
              <span className="foster__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              {microchipError && (
                <div className="foster__error-message">
                  <AlertCircle size={16} />
                  <span>{microchipError}</span>
                </div>
              )}
            </div>

            <div className="foster__row">
              <div className="foster__field">
                <label className="foster__label">
                  Είδος Ζώου<span className="foster__required"> *</span>
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

              <div className="foster__field">
                <label className="foster__label">
                  Ηλικία (σε έτη) <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="age"
                  className="foster__input"
                  placeholder="π.χ. 2"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              </div>
            </div>

            <div className="foster__row">
              <div className="foster__field">
                <label className="foster__label">
                  Φύλο <span className="foster__required">*</span>
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

              <div className="foster__field">
                <label className="foster__label">
                  Όνομα Κατοικιδίου <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  className="foster__input"
                  placeholder="Γράψτε το όνομα του κατοικιδίου"
                  value={formData.petName}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="foster__step-content">
            <h2 className="foster__step-title">Στοιχεία Ανάδοχου Γονέα</h2>
            
            <div className="foster__row">
              <div className="foster__field">
                <label className="foster__label">
                  Α.Φ.Μ. <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="fosterParentAfm"
                  className={`foster__input ${fosterParentAfmError ? 'foster__input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.fosterParentAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {fosterParentAfmError && (
                  <div className="foster__error-message">
                    <AlertCircle size={16} />
                    <span>{fosterParentAfmError}</span>
                  </div>
                )}
              </div>

              <div className="foster__field">
                <label className="foster__label">
                  Όνομα <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="fosterParentName"
                  className="foster__input"
                  placeholder="π.χ. Μαρία"
                  value={formData.fosterParentName}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>
            </div>

            <div className="foster__row">
              <div className="foster__field">
                <label className="foster__label">
                  Επώνυμο <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="fosterParentSurname"
                  className="foster__input"
                  placeholder="π.χ. Ιωάννου"
                  value={formData.fosterParentSurname}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="foster__field">
                <label className="foster__label">
                  Τηλέφωνο <span className="foster__required">*</span>
                </label>
                <input
                  type="tel"
                  name="fosterParentPhone"
                  className="foster__input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.fosterParentPhone}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>

            <div className="foster__field">
              <label className="foster__label">
                Email <span className="foster__required">*</span>
              </label>
              <input
                type="email"
                name="fosterParentEmail"
                className="foster__input"
                placeholder="example@email.com"
                value={formData.fosterParentEmail}
                onChange={handleInputChange}
                required
              />
              <span className="foster__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
            </div>

            <div className="foster__field">
              <label className="foster__label">
                Διεύθυνση <span className="foster__required">*</span>
              </label>
              <input
                type="text"
                name="fosterParentAddress"
                className="foster__input"
                placeholder="π.χ. Ακαδημίας 25"
                value={formData.fosterParentAddress}
                onChange={handleInputChange}
                required
              />
              <span className="foster__field-note">Οδός, Αριθμός</span>
            </div>

            <div className="foster__row">
              <div className="foster__field">
                <label className="foster__label">
                  Πόλη <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="fosterParentCity"
                  className="foster__input"
                  placeholder="π.χ. Αθήνα"
                  value={formData.fosterParentCity}
                  onChange={handleInputChange}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              </div>

              <div className="foster__field">
                <label className="foster__label">
                  Τ.Κ. <span className="foster__required">*</span>
                </label>
                <input
                  type="text"
                  name="fosterParentPostalCode"
                  className="foster__input"
                  placeholder="π.χ. 10564"
                  value={formData.fosterParentPostalCode}
                  onChange={handleInputChange}
                  maxLength={5}
                  required
                />
                <span className="foster__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="foster__step-content">
            <h2 className="foster__step-title">Στοιχεία Αναδοχής</h2>
            
            <div className="foster__field">
              <label className="foster__label">
                Ημερομηνία Αναδοχής <span className="foster__required">*</span>
              </label>
              <DatePicker
                name="fosterDate"
                value={formData.fosterDate}
                onChange={handleInputChange}
                maxDate={new Date()}
              />
            </div>

            <div className="foster__field">
              <label className="foster__label">
                Καταφύγιο/Φιλοζωική στο οποίο ανήκει το ζώο <span className="foster__required">*</span>
              </label>
              <textarea
                name="fosterReason"
                className="foster__textarea"
                placeholder="Σημειώστε..."
                value={formData.fosterReason}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="foster__row foster__row--three-cols">
              <div className="foster__field">
                <label className="foster__label">
                  Διαθέσιμος Κήπος/Αυλή <span className="foster__required">*</span>
                </label>
                <div className="foster__radio-group">
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="shelterOwner"
                      value="yes"
                      checked={formData.shelterOwner === 'yes'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Ναι</span>
                  </label>
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="shelterOwner"
                      value="no"
                      checked={formData.shelterOwner === 'no'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Όχι</span>
                  </label>
                </div>
              </div>

              <div className="foster__field">
                <label className="foster__label">
                  Υπάρχουν άλλα κατοικίδια; <span className="foster__required">*</span>
                </label>
                <div className="foster__radio-group">
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="liveWithOtherPets"
                      value="yes"
                      checked={formData.liveWithOtherPets === 'yes'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Ναι</span>
                  </label>
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="liveWithOtherPets"
                      value="no"
                      checked={formData.liveWithOtherPets === 'no'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Όχι</span>
                  </label>
                </div>
              </div>

              <div className="foster__field">
                <label className="foster__label">
                  Υπάρχει εμπειρία με κατοικίδια; <span className="foster__required">*</span>
                </label>
                <div className="foster__radio-group">
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="existingPets"
                      value="yes"
                      checked={formData.existingPets === 'yes'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Ναι</span>
                  </label>
                  <label className="foster__radio-label">
                    <input
                      type="radio"
                      name="existingPets"
                      value="no"
                      checked={formData.existingPets === 'no'}
                      onChange={handleInputChange}
                      className="foster__radio-input"
                    />
                    <span className="foster__radio-text">Όχι</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="foster__field">
              <label className="foster__label">
                Σημειώσεις
              </label>
              <textarea
                name="notes"
                className="foster__textarea"
                placeholder="Πρόσθετες πληροφορίες για την αναδοχή..."
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
        icon={HandHeart}
        title="Η Δήλωση Αναδοχής ολοκληρώθηκε!"
        description="Η δήλωση αναδοχής καταχωρήθηκε επιτυχώς στο σύστημα. Το κατοικίδιο προστέθηκε στο προφίλ του ανάδοχου ιδιοκτήτη"
        buttonText="Επιστροφή στην Αρχική Κτηνιάτρου"
        onButtonClick={handleSuccessReturn}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Δήλωση Αναδοχής"
      />
    );
  }

  return (
    <PageLayout title="Δήλωση Αναδοχής" breadcrumbs={breadcrumbItems}>
      <div className="foster">
        <div className="foster__header">
          <h1 className="foster__title">Δήλωση Αναδοχής</h1>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="foster__form-wrapper">
          <form className="foster__form">
            {renderStepContent()}

            <div className="foster__actions">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="foster__btn foster__btn--secondary"
                  onClick={handlePrevious}
                >
                  Προηγούμενη
                </button>
              )}
              
              <button
                type="button"
                className="foster__btn foster__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="foster__btn foster__btn--primary"
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
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την δήλωση αναδοχής;"
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
          title="Επιβεβαίωση Αναδοχής"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της αναδοχής:"
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
        message="Η δήλωση αναδοχής ακυρώθηκε με επιτυχία!"
        type="error"
      />
    </PageLayout>
  );
};

export default Foster;
