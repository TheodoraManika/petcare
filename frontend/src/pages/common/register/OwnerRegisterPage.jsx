import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Users, ChevronLeft, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';
import PageLayout from '../../../components/common/layout/PageLayout';
import ProgressBar from '../../../components/common/forms/ProgressBar';
import ConfirmModal from '../../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../../components/common/modals/ConfirmDetailModal';
import './OwnerRegisterPage.css';

const OwnerRegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    afm: '',
    email: '',
    phone: '',
    address: '',
    addressNumber: '',
    city: '',
    postalCode: '',
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
    else if (name === 'city') {
      const filteredValue = filterLettersOnly(value);
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue,
      }));
    }
    // Special handling for postal code
    else if (name === 'postalCode') {
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
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Παρακαλώ εισάγετε μία έγκυρη διεύθυνση email');
        return false;
      }
    } else if (step === 4) {
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
          formData.email.trim() !== '' &&
          emailRegex.test(formData.email) &&
          formData.phone.trim() !== ''
        );
      case 3:
        return (
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.postalCode.trim() !== ''
        );
      case 4:
        return true; // Always enabled in step 4
      default:
        return false;
    }
  };

  const handleContinue = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
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

      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.firstName,
        lastName: formData.lastName,
        userType: 'owner',
        phone: formData.phone,
        afm: formData.afm,
        address: formData.address,
        addressNumber: formData.addressNumber,
        city: formData.city,
        postalCode: formData.postalCode,
        avatar: null,
        createdAt: new Date().toLocaleDateString('el-GR'),
      };

      console.log('Sending owner registration data:', newUser);

      // POST to JSON Server
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to register user: ${response.statusText}`);
      }

      const registeredUser = await response.json();
      console.log('Registered user:', registeredUser);

      // Save to localStorage and redirect
      localStorage.setItem('currentUser', JSON.stringify({
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name,
        lastName: registeredUser.lastName,
        username: registeredUser.name,
        userType: registeredUser.userType,
        avatar: registeredUser.avatar,
        phone: registeredUser.phone,
        afm: registeredUser.afm,
        address: registeredUser.address,
        addressNumber: registeredUser.addressNumber,
        city: registeredUser.city,
        postalCode: registeredUser.postalCode,
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

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
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
    // Go back to step 3 (contact info) to change email
    setCurrentStep(3);
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
      { label: 'Email', value: formData.email },
      { label: 'Τηλέφωνο', value: formData.phone },
      { label: 'Διεύθυνση', value: formData.address },
      { label: 'Πόλη', value: formData.city },
      { label: 'Ταχυδρομικός Κώδικας', value: formData.postalCode },
    ];
  };

  const ownerSteps = [
    { label: 'Προσωπικά', icon: '1' },
    { label: 'Επικοινωνία', icon: '2' },
    { label: 'Διεύθυνση', icon: '3' },
    { label: 'Κωδικός', icon: '4' },
  ];

  return (
    <PageLayout title="Εγγραφή Ιδιοκτήτη">
      <div className="register-page">
        <div className="register-container">
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">
              <div className="register-icon-circle">
                <Users size={40} color="#23CED9" />
              </div>
            </div>
            <h1 className="register-title">Εγγραφή Ιδιοκτήτη</h1>
            <p className="register-subtitle">Δημιουργήστε λογαριασμό για τη διαχείρηση των κατοικιδίων σας</p>
          </div>

          {/* Steps Indicator */}
          <ProgressBar steps={ownerSteps} currentStep={currentStep} />

          {/* Error Message */}
          {error && <div className="register-error">{error}</div>}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Προσωπικά Στοιχεία</h2>
              
              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="firstName" className="register-label">
                    Όνομα<span className="register__required"> *</span>
                    </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="register-input"
                    placeholder="Όνομα"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
                <div className="register-form-group">
                  <label htmlFor="lastName" className="register-label">
                    Επώνυμο<span className="register__required"> *</span>
                    </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="register-input"
                    placeholder="Επώνυμο"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="afm" className="register-label">
                  ΑΦΜ<span className="register__required"> *</span>
                </label>
                <input
                  type="text"
                  id="afm"
                  name="afm"
                  className={`register-input ${afmError ? 'register-input--error' : ''}`}
                  placeholder="123456789 (9 ψηφία)"
                  value={formData.afm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
                <span className="register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                {afmError && (
                  <div className="register__error-message">
                    <AlertCircle size={16} />
                    <span>{afmError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Στοιχεία Επικοινωνίας</h2>
              
              <div className="register-form-group">
                <label htmlFor="email" className="register-label">
                  Email<span className="register__required"> *</span>
                  </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="register-input"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span className="register__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
              </div>

              <div className="register-form-group">
                <label htmlFor="phone" className="register-label">
                  Τηλέφωνο<span className="register__required"> *</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="register-input"
                  placeholder="69XXXXXXXX ή +30 69XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  reaquired
                />
                <span className="register__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Διεύθυνση</h2>
              
              <div className="register-form-group">
                <label htmlFor="address" className="register-label">
                  Διεύθυνση<span className="register__required"> *</span>
                  </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="register-input"
                  placeholder="π.χ. Ακαδημίας 25"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <span className="register__field-note">Οδός, Αριθμός</span>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="city" className="register-label">
                    Πόλη<span className="register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="register-input"
                    placeholder="Αθήνα"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
                </div>
                <div className="register-form-group">
                  <label htmlFor="postalCode" className="register-label">
                    Ταχυδρομικός Κώδικας<span className="register__required"> *</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="register-input"
                    placeholder="12345"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    maxLength={5}
                    required
                  />
                  <span className="register__field-note">Επιτρέπονται μόνο αριθμοί.</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Password */}
          {currentStep === 4 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Κωδικός Πρόσβασης</h2>
              
              <div className="register-form-group">
                <label htmlFor="password" className="register-label">
                  Κωδικός<span className="register__required"> *</span>
                </label>
                <div className="register-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="register-input"
                    placeholder="Ορίστε έναν κωδικό"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <span className="register__field-note">Ο κωδικός πρέπει να περιέχει τουλάχιστον 6 χαρακτήρες. Δεν επιτρέπονται ελληνικοί χαρακτήρες και κενά</span>
              </div>

              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-label">
                  Επιβεβαίωση Κωδικού<span className="register__required"> *</span>
                </label>
                <div className="register-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="register-input"
                    placeholder="Επιβεβαιώστε τον κωδικό"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="register-actions">
            <button
              type="button"
              className="register-btn register-btn--cancel"
              onClick={handleCancel}
            >
              Ακύρωση
            </button>

            {currentStep > 1 && (
              <button
                type="button"
                className="register-btn register-btn--secondary"
                onClick={handleBack}
              >
                Προηγούμενη
              </button>
            )}

            <button
              type="button"
              className="register-btn register-btn--primary"
              onClick={handleContinue}
              disabled={!isStepValid()}
            >
              {currentStep === 4 ? 'Εγγραφή' : 'Επόμενη'}
            </button>
          </div>

          {/* Login Link */}
          <div className="register-login">
            <p>Έχετε ήδη λογαριασμό; <Link to={ROUTES.login} className="register-login-link">Σύνδεση</Link></p>
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
          variant="blue"
        />
      </div>
    </PageLayout>
  );
};

export default OwnerRegisterPage;
