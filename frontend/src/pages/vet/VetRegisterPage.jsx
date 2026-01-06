import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, ChevronLeft } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/global/ui/CustomSelect';
import './VetRegisterPage.css';

const VetRegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    afm: '',
    specialization: '',
    clinicName: '',
    licenseNumber: '',
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
  const navigate = useNavigate();

  const specializations = [
    'Γενική Κτηνιατρική',
    'Χειρουργική',
    'Ορθοδοντική',
    'Δερματολογία',
    'Εσωτερικές Ασθένειες',
    'Επείγουσα Ιατρική',
    'Αναισθησιολογία',
  ];

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
      if (!formData.specialization.trim()) {
        setError('Παρακαλώ επιλέξτε εξειδίκευση');
        return false;
      }
    } else if (step === 3) {
      if (!formData.clinicName.trim()) {
        setError('Παρακαλώ εισάγετε το όνομα της κλινικής');
        return false;
      }
      if (!formData.licenseNumber.trim()) {
        setError('Παρακαλώ εισάγετε τον αριθμό αδείας');
        return false;
      }
    } else if (step === 4) {
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
    } else if (step === 5) {
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
    } else if (step === 6) {
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
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      } else {
        // Handle registration submission
        try {
          const newVet = {
            email: formData.email,
            password: formData.password,
            name: formData.firstName,
            lastName: formData.lastName,
            userType: 'vet',
            phone: formData.phone,
            afm: formData.afm,
            specialization: formData.specialization,
            clinicName: formData.clinicName,
            licenseNumber: formData.licenseNumber,
            licenseType: formData.licenseType,
            clinicAddress: formData.clinicAddress,
            clinicCity: formData.clinicCity,
            clinicPostalCode: formData.clinicPostalCode,
            avatar: null,
            createdAt: new Date().toISOString(),
          };

          // POST to JSON Server
          const response = await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newVet),
          });

          if (!response.ok) {
            throw new Error('Failed to register user');
          }

          const registeredVet = await response.json();

          // Save to localStorage and redirect
          localStorage.setItem('currentUser', JSON.stringify({
            id: registeredVet.id,
            email: registeredVet.email,
            name: registeredVet.name,
            username: registeredVet.name,
            userType: registeredVet.userType,
            avatar: registeredVet.avatar,
          }));

          // Dispatch custom event to notify auth change
          window.dispatchEvent(new Event('loginStatusChanged'));

          navigate(ROUTES.vet.dashboard);
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
            <p className="vet-register-subtitle">Δημιουργήστε λογαριασμό για τη διαχείριση της κλινικής σας</p>
          </div>

          {/* Steps Indicator */}
          <div className="vet-register-steps">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className={`vet-register-step ${currentStep >= step ? 'vet-register-step--active' : ''}`}>
                <div className={`vet-register-step-circle ${currentStep === step ? 'vet-register-step-circle--current' : ''}`}>
                  {currentStep > step ? '✓' : step}
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && <div className="vet-register-error">{error}</div>}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Προσωπικά Στοιχεία</h2>
              <p className="vet-register-step-subtitle">Δώστε τα βασικά στοιχεία σας</p>
              
              <div className="vet-register-form-row">
                <div className="vet-register-form-group">
                  <label htmlFor="firstName" className="vet-register-label">Όνομα *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="vet-register-input"
                    placeholder="Όνομα"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="vet-register-form-group">
                  <label htmlFor="lastName" className="vet-register-label">Επώνυμο *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="vet-register-input"
                    placeholder="Επώνυμο"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="afm" className="vet-register-label">ΑΦΜ *</label>
                <input
                  type="text"
                  id="afm"
                  name="afm"
                  className="vet-register-input"
                  placeholder="123456789"
                  value={formData.afm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 2: Specialization */}
          {currentStep === 2 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Εξειδίκευση</h2>
              <p className="vet-register-step-subtitle">Επιλέξτε την εξειδίκευσή σας</p>
              
              <div className="vet-register-form-group">
                <label htmlFor="specialization" className="vet-register-label">Εξειδίκευση *</label>
                <CustomSelect
                  value={formData.specialization}
                  onChange={(value) => setFormData({...formData, specialization: value})}
                  placeholder="Επιλέξτε εξειδίκευση"
                  options={specializations.map((spec) => ({ value: spec, label: spec }))}
                  variant="vet"
                />
              </div>
            </div>
          )}

          {/* Step 3: Clinic Information */}
          {currentStep === 3 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Στοιχεία Κλινικής/Οργανισμού</h2>
              <p className="vet-register-step-subtitle">Δώστε τα στοιχεία της κλινικής σας</p>
              
              <div className="vet-register-form-group">
                <label htmlFor="clinicName" className="vet-register-label">Όνομα Κλινικής/Οργανισμού *</label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  className="vet-register-input"
                  placeholder="Όνομα κλινικής"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="licenseNumber" className="vet-register-label">Αριθμός Άδειας Ασκήσεως *</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  className="vet-register-input"
                  placeholder="π.χ. ΥΕT-12345"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="licenseType" className="vet-register-label">Τύπος Βιβλίου/Έγκρισης</label>
                <input
                  type="text"
                  id="licenseType"
                  name="licenseType"
                  className="vet-register-input"
                  placeholder="π.χ. Άδεια Ασκήσεως"
                  value={formData.licenseType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {currentStep === 4 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Στοιχεία Διεύθυνσης</h2>
              <p className="vet-register-step-subtitle">Δώστε τη διεύθυνση της κλινικής σας</p>
              
              <div className="vet-register-form-group">
                <label htmlFor="clinicAddress" className="vet-register-label">Διεύθυνση (ημιουπολείου) *</label>
                <input
                  type="text"
                  id="clinicAddress"
                  name="clinicAddress"
                  className="vet-register-input"
                  placeholder="Πατριάρχου Γρηγορίου 26"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vet-register-form-row">
                <div className="vet-register-form-group">
                  <label htmlFor="clinicCity" className="vet-register-label">Πόλη *</label>
                  <input
                    type="text"
                    id="clinicCity"
                    name="clinicCity"
                    className="vet-register-input"
                    placeholder="Αθήνα"
                    value={formData.clinicCity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="vet-register-form-group">
                  <label htmlFor="clinicPostalCode" className="vet-register-label">ΤΚ *</label>
                  <input
                    type="text"
                    id="clinicPostalCode"
                    name="clinicPostalCode"
                    className="vet-register-input"
                    placeholder="12345"
                    value={formData.clinicPostalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Contact Information */}
          {currentStep === 5 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Στοιχεία Επικοινωνίας</h2>
              <p className="vet-register-step-subtitle">Δώστε τα στοιχεία επικοινωνίας σας</p>
              
              <div className="vet-register-form-group">
                <label htmlFor="email" className="vet-register-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="vet-register-input"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="phone" className="vet-register-label">Τηλέφωνο *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="vet-register-input"
                  placeholder="69XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Step 6: Password */}
          {currentStep === 6 && (
            <div className="vet-register-step-content">
              <h2 className="vet-register-step-title">Κωδικός Πρόσβασης</h2>
              <p className="vet-register-step-subtitle">Ορίστε έναν ισχυρό κωδικό</p>
              
              <div className="vet-register-form-group">
                <label htmlFor="password" className="vet-register-label">Κωδικός *</label>
                <div className="vet-register-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="vet-register-input"
                    placeholder="Ορίστε έναν κωδικό"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="vet-register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="vet-register-form-group">
                <label htmlFor="confirmPassword" className="vet-register-label">Επιβεβαίωση Κωδικού *</label>
                <div className="vet-register-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="vet-register-input"
                    placeholder="Επιβεβαιώστε τον κωδικό"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
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
              className="vet-register-btn vet-register-btn--back"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={18} />
              Πίσω
            </button>
            <button
              type="button"
              className="vet-register-btn vet-register-btn--continue"
              onClick={handleContinue}
            >
              {currentStep === 6 ? 'Εγγραφή' : 'Συνέχεια'}
            </button>
          </div>

          {/* Login Link */}
          <div className="vet-register-login">
            <p>Έχετε ήδη λογαριασμό; <Link to={ROUTES.login} className="vet-register-login-link">Σύνδεση</Link></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetRegisterPage;
