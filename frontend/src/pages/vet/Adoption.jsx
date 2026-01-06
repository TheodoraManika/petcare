import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, UserRound, FileHeart } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import ProgressBar from '../../components/common/ProgressBar';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import { ROUTES } from '../../utils/constants';
import './Adoption.css';

const Adoption = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    { icon: <FileHeart size={24} />, label: 'Υιοθεσία' }
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
    navigate(ROUTES.vet.lifeEvents);
  };

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
      </div>
    </PageLayout>
  );
};

export default Adoption;
