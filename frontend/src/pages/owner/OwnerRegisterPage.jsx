import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Home, ChevronLeft } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/global/layout/PageLayout';
import ProgressBar from '../../components/common/ProgressBar';
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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
    } else if (step === 3) {
      if (!formData.address.trim()) {
        setError('Παρακαλώ εισάγετε τη διεύθυνση');
        return false;
      }
      if (!formData.city.trim()) {
        setError('Παρακαλώ εισάγετε την πόλη');
        return false;
      }
      if (!formData.postalCode.trim()) {
        setError('Παρακαλώ εισάγετε το ΤΚ');
        return false;
      }
    } else if (step === 4) {
      if (!formData.password.trim()) {
        setError('Παρακαλώ εισάγετε ένα κωδικό');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες');
        return false;
      }
      if (!formData.confirmPassword.trim()) {
        setError('Παρακαλώ επιβεβαιώστε τον κωδικό');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Οι κωδικοί δεν ταιριάζουν');
        return false;
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Handle registration submission
        try {
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
            createdAt: new Date().toISOString(),
          };

          // POST to JSON Server
          const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          });

          if (!response.ok) {
            throw new Error('Failed to register user');
          }

          const registeredUser = await response.json();

          // Save to localStorage and redirect
          localStorage.setItem('currentUser', JSON.stringify({
            id: registeredUser.id,
            email: registeredUser.email,
            name: registeredUser.name,
            username: registeredUser.name,
            userType: registeredUser.userType,
            avatar: registeredUser.avatar,
          }));

          // Dispatch custom event to notify auth change
          window.dispatchEvent(new Event('loginStatusChanged'));

          navigate(ROUTES.home);
        } catch (err) {
          console.error('Registration error:', err);
          setError('Σφάλμα κατά την εγγραφή. Βεβαιωθείτε ότι το JSON Server είναι ενεργό.');
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
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
                <Home size={40} color="#23CED9" />
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
              <p className="register-step-subtitle">Δώστε τα βασικά στοιχεία σας</p>
              
              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="firstName" className="register-label">Όνομα *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="register-input"
                    placeholder="Όνομα"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="register-form-group">
                  <label htmlFor="lastName" className="register-label">Επώνυμο *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="register-input"
                    placeholder="Επώνυμο"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="afm" className="register-label">ΑΦΜ *</label>
                <input
                  type="text"
                  id="afm"
                  name="afm"
                  className="register-input"
                  placeholder="123456789"
                  value={formData.afm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Στοιχεία Επικοινωνίας</h2>
              <p className="register-step-subtitle">Δώστε τα στοιχεία επικοινωνίας σας</p>
              
              <div className="register-form-group">
                <label htmlFor="email" className="register-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="register-input"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="phone" className="register-label">Τηλέφωνο *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="register-input"
                  placeholder="69XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Διεύθυνση</h2>
              <p className="register-step-subtitle">Δώστε τη διεύθυνσή σας</p>
              
              <div className="register-form-group">
                <label htmlFor="address" className="register-label">Διεύθυνση (ημιουπολείου) *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="register-input"
                  placeholder="Πατριάρχου Γρηγορίου"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="city" className="register-label">Πόλη *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="register-input"
                    placeholder="Αθήνα"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="register-form-group">
                  <label htmlFor="postalCode" className="register-label">Ταχυδρομικός Κώδικας *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="register-input"
                    placeholder="12345"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Password */}
          {currentStep === 4 && (
            <div className="register-step-content">
              <h2 className="register-step-title">Κωδικός Πρόσβασης</h2>
              <p className="register-step-subtitle">Ορίστε έναν ισχυρό κωδικό</p>
              
              <div className="register-form-group">
                <label htmlFor="password" className="register-label">Κωδικός *</label>
                <div className="register-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="register-input"
                    placeholder="Ορίστε έναν κωδικό"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-label">Επιβεβαίωση Κωδικού *</label>
                <div className="register-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="register-input"
                    placeholder="Επιβεβαιώστε τον κωδικό"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
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
              className="register-btn register-btn--back"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={18} />
              Πίσω
            </button>
            <button
              type="button"
              className="register-btn register-btn--continue"
              onClick={handleContinue}
            >
              {currentStep === 4 ? 'Εγγραφή' : 'Συνέχεια'}
            </button>
          </div>

          {/* Login Link */}
          <div className="register-login">
            <p>Έχετε ήδη λογαριασμό; <Link to={ROUTES.login} className="register-login-link">Σύνδεση</Link></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OwnerRegisterPage;
