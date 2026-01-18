import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, ChevronLeft, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import PageLayout from '../../../components/common/layout/PageLayout';
import MultiSelect from '../../../components/common/forms/MultiSelect';
import ProgressBar from '../../../components/common/forms/ProgressBar';
import ConfirmModal from '../../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../../components/common/modals/ConfirmDetailModal';
import './VetRegisterPage.css';

const VetRegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    afm: '',
    specialization: [],
    licenseNumber: '',
    yearsOfExperience: '',
    university: '',
    bio: '',
    clinicName: '',
    licenseType: '',
    clinicAddress: '',
    clinicCity: '',
    clinicPostalCode: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [afmError, setAfmError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  const navigate = useNavigate();

  const specializations = [
    'Γενική Κτηνιατρική',
    'Χειρουργική',
    'Δερματολογία',
    'Καρδιολογία',
    'Οδοντιατρική',
    'Οφθαλμολογία',
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

  // Helper function to filter password characters - no Greek letters and spaces
  const allowedPasswordChars = (value) => value.replace(/[\u0370-\u03FF\u1F00-\u1FFF\s]/g, ''); // Αφαιρεί ελληνικούς χαρακτήρες και κενά

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for first name
    if (name === 'firstName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for last name
    else if (name === 'lastName') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for AFM
    else if (name === 'afm') {
      const numericValue = allowedAFMChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
      
      if (numericValue.length > 0 && numericValue.length !== 9) {
        setAfmError('Το Α.Φ.Μ. πρέπει να έχει ακριβώς 9 ψηφία');
      } else {
        setAfmError('');
      }
    }
    // Special handling for email
    else if (name === 'email') {
      const filteredValue = allowedEmailChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for phone
    else if (name === 'phone') {
      const filteredValue = allowedPhoneChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for city
    else if (name === 'clinicCity') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for postal code
    else if (name === 'clinicPostalCode') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    // Special handling for license number (numbers and dashes only)
    else if (name === 'licenseNumber') {
      const numericValue = value.replace(/[^0-9\-]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    // Special handling for years of experience (numbers only)
    else if (name === 'yearsOfExperience') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    // Special handling for password
    else if (name === 'password') {
      const filteredValue = allowedPasswordChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for confirm password
    else if (name === 'confirmPassword') {
      const filteredValue = allowedPasswordChars(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // All other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    setError('');
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.firstName.trim()) {
        setError('Παρακαλώ εισάγετε το όνομά σας');
        return false;
      }
      if (!formData.lastName.trim()) {
        setError('Παρακαλώ εισάγετε το επώνυμό σας');
        return false;
      }
      if (!formData.afm.trim()) {
        setError('Παρακαλώ εισάγετε το ΑΦΜ');
        return false;
      }
    } else if (step === 2) {
      if (formData.specialization.length === 0) {
        setError('Παρακαλώ επιλέξτε τουλάχιστον μία ειδικότητα');
        return false;
      }
      if (!formData.licenseNumber.trim()) {
        setError('Παρακαλώ εισάγετε τον αριθμό άδειας');
        return false;
      }
    } else if (step === 3) {
      if (!formData.clinicName.trim()) {
        setError('Παρακαλώ εισάγετε το όνομα της κλινικής');
        return false;
      }
      if (!formData.clinicAddress.trim()) {
        setError('Παρακαλώ εισάγετε τη διεύθυνση');
        return false;
      }
      if (!formData.clinicCity.trim()) {
        setError('Παρακαλώ εισάγετε την πόλη');
        return false;
      }
      if (!formData.clinicPostalCode.trim()) {
        setError('Παρακαλώ εισάγετε το ΤΚ');
        return false;
      }
    } else if (step === 4) {
      if (!formData.email.trim()) {
        setError('Παρακαλώ εισάγετε το email');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Παρακαλώ εισάγετε ένα έγκυρο email');
        return false;
      }
      if (!formData.phone.trim()) {
        setError('Παρακαλώ εισάγετε τον αριθμό τηλεφώνου');
        return false;
      }
    } else if (step === 5) {
      if (formData.password.length < 6) {
        setError('Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Οι κωδικοί δεν ταιριάζουν');
        return false;
      }
    }
    return true;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.afm.trim() !== '' &&
          formData.afm.length === 9
        );
      case 2:
        return formData.specialization.length > 0 && formData.licenseNumber.trim() !== '';
      case 3:
        return (
          formData.clinicName.trim() !== '' &&
          formData.clinicAddress.trim() !== '' &&
          formData.clinicCity.trim() !== '' &&
          formData.clinicPostalCode.trim() !== ''
        );
      case 4:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          formData.email.trim() !== '' &&
          emailRegex.test(formData.email) &&
          formData.phone.trim() !== ''
        );
      case 5:
        return true; // Always enabled in step 5
      default:
        return false;
    }
  };

  const handleContinue = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        // Show confirmation modal instead of submitting directly
        setShowSubmitModal(true);
      }
    }
  };

  const handleSubmit = async () => {
    // Handle registration submission
    try {
      // Check if email already exists
      const checkEmailResponse = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(formData.email)}`);
      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email');
      }
      const existingUsers = await checkEmailResponse.json();
      
      if (existingUsers && existingUsers.length > 0) {
        // Email already exists, show modal
        setShowEmailExistsModal(true);
        return;
      }

      const newVet = {
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        lastName: formData.lastName,
        userType: 'vet',
        phone: formData.phone,
        afm: formData.afm,
        specialization: formData.specialization.join(', ') || formData.specialization,
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        experience: formData.yearsOfExperience,
        education: formData.university,
        biography: formData.bio,
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        clinicCity: formData.clinicCity,
        clinicPostalCode: formData.clinicPostalCode,
        avatar: null,
        createdAt: new Date().toLocaleDateString('el-GR'),
      };

      console.log('Sending vet registration data:', newVet);

      // POST to JSON Server
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVet),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to register user: ${response.statusText}`);
      }

      const registeredVet = await response.json();
      console.log('Registered vet:', registeredVet);

      // Save to localStorage and redirect
      localStorage.setItem('currentUser', JSON.stringify({
        id: registeredVet.id,
        email: registeredVet.email,
        name: registeredVet.name,
        lastName: registeredVet.lastName,
        username: registeredVet.name,
        userType: registeredVet.userType,
        avatar: registeredVet.avatar,
        phone: registeredVet.phone,
        afm: registeredVet.afm,
        specialization: registeredVet.specialization,
        licenseNumber: registeredVet.licenseNumber,
        experience: registeredVet.experience,
        education: registeredVet.education,
        biography: registeredVet.biography,
        clinicName: registeredVet.clinicName,
        clinicAddress: registeredVet.clinicAddress,
        clinicCity: registeredVet.clinicCity,
        clinicPostalCode: registeredVet.clinicPostalCode,
      }));

      // Dispatch custom event to notify auth change
      window.dispatchEvent(new Event('loginStatusChanged'));

      // Navigate to home with success notification
      navigate(ROUTES.home, {
        state: {
          notification: {
            message: 'Η εγγραφή ολοκληρώθηκε με επιτυχία!',
            type: 'success'
          }
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Σφάλμα κατά την εγγραφή. Βεβαιωθείτε ότι το JSON Server είναι ενεργό.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    
    // Navigate to home with notification state
    navigate(ROUTES.home, {
      state: {
        notification: {
          message: 'Η εγγραφή ακυρώθηκε με επιτυχία!',
          type: 'error'
        }
      }
    });
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    await handleSubmit();
  };

  const handleEmailExistsReturn = () => {
    setShowEmailExistsModal(false);
    // Go back to step 4 (contact info) to change email
    setCurrentStep(4);
  };

  const handleEmailExistsLogin = () => {
    setShowEmailExistsModal(false);
    // Navigate to login page
    navigate(ROUTES.login);
  };

  // Function to get fields for the detail modal
  const getSubmitFields = () => {
    return [
      { label: 'Όνομα', value: formData.firstName },
      { label: 'Επώνυμο', value: formData.lastName },
      { label: 'ΑΦΜ', value: formData.afm },
      { label: 'Ειδικότητα/ες', value: formData.specialization.join(', ') },
      { label: 'Αριθμός Άδειας', value: formData.licenseNumber },
      { label: 'Έτη Εμπειρίας', value: formData.yearsOfExperience || 'Δεν έχει συμπληρωθεί' },
      { label: 'Εκπαίδευση', value: formData.university || 'Δεν έχει συμπληρωθεί' },
      { label: 'Βιογραφικό', value: formData.bio || 'Δεν έχει συμπληρωθεί' },
      { label: 'Όνομα Κλινικής', value: formData.clinicName },
      { label: 'Διεύθυνση Κλινικής', value: formData.clinicAddress },
      { label: 'Πόλη', value: formData.clinicCity },
      { label: 'ΤΚ', value: formData.clinicPostalCode },
      { label: 'Email', value: formData.email },
      { label: 'Τηλέφωνο', value: formData.phone },
    ];
  };

  const vetSteps = [
    { label: 'Προσωπικά', icon: '1' },
    { label: 'Επαγγελματικά', icon: '2' },
    { label: 'Κλινική', icon: '3' },
    { label: 'Επικοινωνία', icon: '4' },
    { label: 'Κωδικός', icon: '5' },
  ];

  return (
    <PageLayout title="Εγγραφή Κτηνιάτρου">
      <div className="vet-register-page">
        <div className="vet-register-container">
          {/* Header */}
          <div className="vet-register-header">
            <div className="vet-register-icon">
              <div className="vet-register-icon-circle">
                <Stethoscope size={40} color="#FCA47C" />
              </div>
            </div>
            <h1 className="vet-register-title">Εγγραφή Κτηνιάτρου</h1>
            <p className="vet-register-subtitle">Δημιουργήστε λογαριασμό για την ολοκληρωμένη διαχείριση της υγείας των κατοικιδίων και των ραντεβού σας</p>
          </div>

          {/* Steps Indicator */}
          <ProgressBar steps={vetSteps} currentStep={currentStep} />

          {/* Error Message */}
          {error && <div className="vet-register-error">{error}</div>}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Προσωπικά Στοιχεία</h2>
              
              <div className="vet-register-form-row">
                <div className="vet-register-form-group">
                  <label htmlFor="firstName" className="vet-register-label">
                    Όνομα<span className="vet-register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="vet-register-input"
                    placeholder="Όνομα"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="vet-register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
                <div className="vet-register-form-group">
                  <label htmlFor="lastName" className="vet-register-label">
                    Επώνυμο<span className="vet-register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="vet-register-input"
                    placeholder="Επώνυμο"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="vet-register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="afm" className="vet-register-label">
                  ΑΦΜ<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="text"
                  id="afm"
                  name="afm"
                  className={`vet-register-input ${afmError ? 'vet-register-input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.afm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="vet-register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {afmError && (
                  <div className="vet-register__error-message">
                    <AlertCircle size={16} />
                    <span>{afmError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Specialization */}
          {currentStep === 2 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Επαγγελματικά Στοιχεία</h2>
              
              <div className="vet-register-form-group">
                <label htmlFor="specialization" className="vet-register-label">
                  Ειδικότητα/ες<span className="vet-register__required"> *</span>
                </label>
                <MultiSelect
                  value={formData.specialization}
                  onChange={(value) => setFormData({...formData, specialization: value})}
                  placeholder="Επιλέξτε ειδικότητες"
                  options={specializations.map((spec) => ({ value: spec, label: spec }))}
                  variant="vet"
                />
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="licenseNumber" className="vet-register-label">
                  Αριθμός Άδειας Άσκησης Επαγγέλματος<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  className="vet-register-input"
                  placeholder="π.χ. 1-12345"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
                <span className="vet-register__field-note">Επιτρέπονται μόνο αριθμοί και παύλα (-).</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="yearsOfExperience" className="vet-register-label">
                  Έτη Εμπειρίας (προαιρετικό)
                </label>
                <input
                  type="text"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  className="vet-register-input"
                  placeholder="π.χ. 5"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                />
                <span className="vet-register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="university" className="vet-register-label">
                  Εκπαίδευση (προαιρετικό)
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  className="vet-register-input"
                  placeholder="π.χ. Γεωπονικό Πανεπιστήμιο Αθηνών"
                  value={formData.university}
                  onChange={handleInputChange}
                />
                <span className="vet-register__field-note">Συμπληρώστε το εκπαιδευτικό ίδρυμα απόκτησης πτυχίου.</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="bio" className="vet-register-label">
                  Βιογραφικό (προαιρετικό)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="vet-register-input"
                  placeholder="Συντομη περιγραφή του επαγγελματικού σας προφίλ..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
                <span className="vet-register__field-note">Προαιρετική περιγραφή της εμπειρίας και εξειδίκευσής σας.</span>
              </div>
            </div>
          )}

          {/* Step 3: Clinic Information */}
          {currentStep === 3 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Στοιχεία Κλινικής/Ιατρείου</h2>
              
              <div className="vet-register-form-group">
                <label htmlFor="clinicName" className="vet-register-label">
                  Όνομα Κλινικής/Ιατρείου<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  className="vet-register-input"
                  placeholder="Όνομα κλινικής"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  required
                />
                <span className="vet-register__field-note">Συμπληρώστε "Ιδιωτικό Ιατρείο" αν το ιατρείο σας δεν έχει όνομα.</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="clinicAddress" className="vet-register-label">
                  Διεύθυνση<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="text"
                  id="clinicAddress"
                  name="clinicAddress"
                  className="vet-register-input"
                  placeholder="π.χ. Ακαδημίας 23"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  required
                />
                <span className="vet-register__field-note">Οδός, Αριθμός</span>
              </div>

              <div className="vet-register-form-row">
                <div className="vet-register-form-group">
                  <label htmlFor="clinicCity" className="vet-register-label">
                    Πόλη<span className="vet-register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="clinicCity"
                    name="clinicCity"
                    className="vet-register-input"
                    placeholder="Αθήνα"
                    value={formData.clinicCity}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="vet-register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
                <div className="vet-register-form-group">
                  <label htmlFor="clinicPostalCode" className="vet-register-label">
                    ΤΚ<span className="vet-register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="clinicPostalCode"
                    name="clinicPostalCode"
                    className="vet-register-input"
                    placeholder="12345"
                    value={formData.clinicPostalCode}
                    onChange={handleInputChange}
                    maxLength={5}
                    required
                  />
                  <span className="vet-register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Στοιχεία Επικοινωνίας</h2>
              
              <div className="vet-register-form-group">
                <label htmlFor="email" className="vet-register-label">
                  Email<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="vet-register-input"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span className="vet-register__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="phone" className="vet-register-label">
                  Τηλέφωνο<span className="vet-register__required"> *</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="vet-register-input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <span className="vet-register__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>
          )}

          {/* Step 5: Password */}
          {currentStep === 5 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Κωδικός Πρόσβασης</h2>
              
              <div className="vet-register-form-group">
                <label htmlFor="password" className="vet-register-label">
                  Κωδικός<span className="vet-register__required"> *</span>
                </label>
                <div className="vet-register-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="vet-register-input"
                    placeholder="Ορίστε έναν κωδικό"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="vet-register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <span className="vet-register__field-note">Ο κωδικός πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες. Δεν επιτρέπονται ελληνικοί χαρακτήρες και κενά</span>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="confirmPassword" className="vet-register-label">
                  Επιβεβαίωση Κωδικού<span className="vet-register__required"> *</span>
                </label>
                <div className="vet-register-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="vet-register-input"
                    placeholder="Επιβεβαιώστε τον κωδικό"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="vet-register-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="vet-register-actions">
            <button
              type="button"
              className="vet-register-btn vet-register-btn--cancel"
              onClick={handleCancel}
            >
              Ακύρωση
            </button>

            {currentStep > 1 && (
              <button
                type="button"
                className="vet-register-btn vet-register-btn--secondary"
                onClick={handleBack}
              >
                Προηγούμενη
              </button>
            )}

            <button
              type="button"
              className="vet-register-btn vet-register-btn--primary"
              onClick={handleContinue}
              disabled={!isStepValid()}
            >
              {currentStep === 5 ? 'Εγγραφή' : 'Επόμενη'}
            </button>
          </div>

          {/* Login Link */}
          <div className="vet-register-login">
            <p>Έχετε ήδη λογαριασμό; <Link to={ROUTES.login} className="vet-register-login-link">Σύνδεση</Link></p>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την εγγραφή;"
          description="Αυτή η ενέργεια δεν αναιρείται. Όλα τα στοιχεία που έχετε εισάγει θα χαθούν."
          cancelText="Όχι, επιστροφή"
          confirmText="Ναι, ακύρωση"
          onCancel={handleCancelCancel}
          onConfirm={handleConfirmCancel}
          isDanger={true}
        />

        {/* Submit Confirmation Modal with Details */}
        <ConfirmDetailModal
          isOpen={showSubmitModal}
          title="Επιβεβαίωση Στοιχείων Εγγραφής"
          fields={getSubmitFields()}
          cancelText="Επιστροφή"
          confirmText="Εγγραφή"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />

        {/* Email Already Exists Modal */}
        <ConfirmModal
          isOpen={showEmailExistsModal}
          title="Αποτυχία Δημιουργίας Λογαριασμού"
          description="Φαίνεται πως το email αυτό χρησιμοποιείται ήδη.

          Αν έχετε λογαριασμό, δοκιμάστε να συνδεθείτε ή να επαναφέρετε τον κωδικό πρόσβασης σας."
          cancelText="Επιστροφή"
          confirmText="Σύνδεση"
          onCancel={handleEmailExistsReturn}
          onConfirm={handleEmailExistsLogin}
          isDanger={false}
        />
      </div>
    </PageLayout>
  );
};

export default VetRegisterPage;
