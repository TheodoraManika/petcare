import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, UserRoundPlus, ArrowLeftRight } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import ProgressBar from '../../components/common/ProgressBar';
import DatePicker from '../../components/common/DatePicker';
import { ROUTES } from '../../utils/constants';
import './Transfer.css';

const Transfer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.microchipNumber.trim() !== '' && formData.petName.trim() !== '';
      case 2:
        return (
          formData.currentOwnerAfm.trim() !== '' &&
          formData.currentOwnerName.trim() !== '' &&
          formData.currentOwnerSurname.trim() !== '' &&
          formData.currentOwnerPhone.trim() !== '' &&
          formData.currentOwnerEmail.trim() !== ''
        );
      case 3:
        return (
          formData.newOwnerAfm.trim() !== '' &&
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
      // Submit form
      console.log('Form submitted:', formData);
      navigate(ROUTES.vet.dashboard);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.vet.dashboard);
  };

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
                className="transfer__input"
                placeholder="GR123456789012345"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
            </div>

            <div className="transfer__field">
              <label className="transfer__label">
                Όνομα Κατοικιδίου <span className="transfer__required">*</span>
              </label>
              <input
                type="text"
                name="petName"
                className="transfer__input"
                value={formData.petName}
                onChange={handleInputChange}
                required
              />
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
                  className="transfer__input"
                  placeholder="123456789"
                  value={formData.currentOwnerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
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
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Τηλέφωνο <span className="transfer__required">*</span>
                </label>
                <input
                  type="tel"
                  name="currentOwnerPhone"
                  className="transfer__input"
                  placeholder="6912345678"
                  value={formData.currentOwnerPhone}
                  onChange={handleInputChange}
                  required
                />
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
                  className="transfer__input"
                  placeholder="123456789"
                  value={formData.newOwnerAfm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
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
              </div>

              <div className="transfer__field">
                <label className="transfer__label">
                  Τηλέφωνο <span className="transfer__required">*</span>
                </label>
                <input
                  type="tel"
                  name="newOwnerPhone"
                  className="transfer__input"
                  placeholder="6912345678"
                  value={formData.newOwnerPhone}
                  onChange={handleInputChange}
                  required
                />
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
      </div>
    </PageLayout>
  );
};

export default Transfer;
