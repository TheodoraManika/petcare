import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileCheck, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import { ROUTES } from '../../utils/constants';
import './LostPetHistoryEdit.css';

const LostPetHistoryEdit = () => {
  const navigate = useNavigate();
  const { declarationId } = useParams();

  // Mock data - in real app, this would come from API
  const [formData, setFormData] = useState({
    petName: 'Μπάμπης',
    petType: 'Σκύλος',
    breed: 'Golden Retriever',
    microchip: '123456789012345',
    date: '05/11/2025',
    phone: '6935552540',
    location: 'Κέντρο Αθήνας, Πλατεία Συντάγματος',
    description: 'Ακούει στο όνομα του και είναι πολύ φιλικός',
  });

  const [phoneError, setPhoneError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const locationOptions = [
    { value: 'syntagma', label: 'Κέντρο Αθήνας, Πλατεία Συντάγματος' },
    { value: 'park', label: 'Πάρκο Εργηνης' },
    { value: 'thessaloniki', label: 'Θεσσαλονίκη' },
    { value: 'kolonaki', label: 'Κολωνάκι' },
    { value: 'other', label: 'Άλλη περιοχή' },
  ];

  const breadcrumbItems = [
    { label: 'Ιστορικό Δηλώσεων', path: ROUTES.owner.lostHistory },
    { label: 'Δήλωση Απώλειας', path: `${ROUTES.owner.lostHistory}/${declarationId}` },
  ];

  // Helper function to filter phone characters
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, '');

  // Validation function for phone
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s+]/g, '');
    return cleanPhone.length >= 10;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let filteredValue = value;
    
    // Apply phone character filtering
    if (name === 'phone') {
      filteredValue = allowedPhoneChars(value);
      // Clear error when user starts typing
      if (phoneError) {
        setPhoneError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate(`${ROUTES.owner.lostHistory}/${declarationId}`);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDraft = () => {
    console.log('Saving as draft:', formData);
    navigate(ROUTES.owner.lostHistory);
  };

  const handleSubmitClick = () => {
    // Validate phone before showing modal
    if (!validatePhone(formData.phone)) {
      setPhoneError('Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία');
      return;
    }
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    // Update status to 'submitted' when final submission is made
    const updatedData = {
      ...formData,
      status: 'submitted',
      statusLabel: 'Υποβλήθηκε'
    };
    
    console.log('Submitting with status updated:', updatedData);
    // ADD API CALL HERE
    
    setShowSubmitModal(false);
    navigate(ROUTES.owner.lostHistory);
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
  };

  // Function to get fields for the detail modal
  const getSubmitFields = () => {
    return [
      { label: 'Όνομα Κατοικιδίου', value: formData.petName },
      { label: 'Είδος', value: formData.petType },
      { label: 'Ράτσα', value: formData.breed },
      { label: 'Αριθμός Μικροτσίπ', value: formData.microchip },
      { label: 'Ημερομηνία Εξαφάνισης', value: formData.date },
      { label: 'Τηλέφωνο Επικοινωνίας', value: formData.phone },
      { label: 'Τοποθεσία Εξαφάνισης', value: formData.location },
      { label: 'Περιγραφή', value: formData.description || 'Δεν έχει συμπληρωθεί' },
    ];
  };

  return (
    <PageLayout variant="owner" title="Μπάμπης" breadcrumbs={breadcrumbItems}>
      <div className="lost-pet-edit">
        <div className="lost-pet-edit__header">
          <h1 className="lost-pet-edit__title">Δήλωση Απώλειας Κατοικιδίου</h1>
        </div>

        <div className="lost-pet-edit__card">
          {/* Pet Info Card */}
          <div className="lost-pet-edit__pet-card">
            <div className="lost-pet-edit__pet-image">🐕</div>
            <div className="lost-pet-edit__pet-details">
              <h3 className="lost-pet-edit__pet-name">Στοιχεία Κατοικιδίου</h3>
              <div className="lost-pet-edit__pet-info">
                <div className="lost-pet-edit__pet-row">
                  <span className="lost-pet-edit__pet-label">Όνομα</span>
                  <span className="lost-pet-edit__pet-value">{formData.petName}</span>
                </div>
                <div className="lost-pet-edit__pet-row">
                  <span className="lost-pet-edit__pet-label">Είδος</span>
                  <span className="lost-pet-edit__pet-value">{formData.petType}</span>
                </div>
                <div className="lost-pet-edit__pet-row">
                  <span className="lost-pet-edit__pet-label">Ράτσα</span>
                  <span className="lost-pet-edit__pet-value">{formData.breed}</span>
                </div>
                <div className="lost-pet-edit__pet-row">
                  <span className="lost-pet-edit__pet-label">Αριθμός Μικροτσίπ</span>
                  <span className="lost-pet-edit__pet-value">{formData.microchip}</span>
                </div>
              </div>
            </div>
          </div>

          <form className="lost-pet-edit__form">
            {/* Date and Phone */}
            <div className="lost-pet-edit__row">
              <div className="lost-pet-edit__field">
                <label className="lost-pet-edit__label">
                  Ημερομηνία Εξαφάνισης <span className="lost-pet-edit__required">*</span>
                </label>
                <DatePicker
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  variant="owner"
                  maxDate={new Date()}
                />
              </div>

              <div className="lost-pet-edit__field">
                <label className="lost-pet-edit__label">
                  Τηλέφωνο Επικοινωνίας <span className="lost-pet-edit__required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`lost-pet-edit__input ${phoneError ? 'lost-pet-edit__input--error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <span className="lost-pet-edit__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
                {phoneError && (
                  <div className="lost-pet-edit__error-message">
                    <AlertCircle size={16} />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="lost-pet-edit__field">
              <label className="lost-pet-edit__label">
                Τοποθεσία Εξαφάνισης <span className="lost-pet-edit__required">*</span>
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(val) => handleSelectChange('location', val)}
                onSelect={(place) => handleSelectChange('location', place?.label || formData.location)}
                placeholder="Επιλέξτε τοποθεσία"
                variant="owner"
              />
            </div>

            {/* Description */}
            <div className="lost-pet-edit__field">
              <label className="lost-pet-edit__label">Περιγραφή</label>
              <textarea
                name="description"
                className="lost-pet-edit__textarea"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Προσθέστε περιγραφή..."
              />
            </div>

            {/* Actions */}
            <div className="lost-pet-edit__actions">
              <button
                type="button"
                className="lost-pet-edit__btn lost-pet-edit__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="button"
                className="lost-pet-edit__btn lost-pet-edit__btn--draft"
                onClick={handleDraft}
              >
                <Save size={18} />
                Πρόχειρο
              </button>
              <button
                type="button"
                className="lost-pet-edit__btn lost-pet-edit__btn--submit"
                onClick={handleSubmitClick}
              >
                <FileCheck size={18} />
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την επεξεργασία;"
          description="Όλες οι αλλαγές που έχετε κάνει θα χαθούν."
          cancelText="Όχι, επιστροφή"
          confirmText="Ναι, ακύρωση"
          onCancel={handleCancelCancel}
          onConfirm={handleConfirmCancel}
          isDanger={true}
        />

        {/* Submit Confirmation Modal with Details */}
        <ConfirmDetailModal
          isOpen={showSubmitModal}
          title="Επιβεβαίωση Οριστικής Υποβολής"
          fields={getSubmitFields()}
          cancelText="Επιστροφή"
          confirmText="Οριστική Υποβολή"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />
      </div>
    </PageLayout>
  );
};

export default LostPetHistoryEdit;
