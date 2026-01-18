import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileCheck, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import LocationPicker from '../../components/common/forms/LocationPicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './LostPetHistoryEdit.css';

const LostPetHistoryEdit = () => {
  const navigate = useNavigate();
  const { declarationId } = useParams();

  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    breed: '',
    microchip: '',
    date: '',
    phone: '',
    location: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDeclaration = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the lost pet declaration
        const response = await fetch(`http://localhost:5000/lostPets/${declarationId}`);
        if (!response.ok) {
          throw new Error('Δήλωση δεν βρέθηκε');
        }

        const lostPet = await response.json();

        // Fetch pet details if petId exists
        let petDetails = {};
        if (lostPet.petId) {
          const petResponse = await fetch(`http://localhost:5000/pets/${lostPet.petId}`);
          if (petResponse.ok) {
            petDetails = await petResponse.json();
          }
        }

        // Fetch owner info to get phone if not in lostPet
        let ownerInfo = {};
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id) {
          const ownerResponse = await fetch(`http://localhost:5000/users/${currentUser.id}`);
          if (ownerResponse.ok) {
            ownerInfo = await ownerResponse.json();
          }
        }

        // Format the form data
        setFormData({
          petName: lostPet.petName || petDetails.name || '',
          petType: petDetails.species || lostPet.petType || '',
          breed: petDetails.breed || lostPet.breed || '',
          microchip: petDetails.microchipId || lostPet.microchip || '',
          date: lostPet.dateLost || '',
          phone: lostPet.phone || ownerInfo.phone || '',
          location: lostPet.location || '',
          description: lostPet.description || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching declaration:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (declarationId) {
      fetchDeclaration();
    }
  }, [declarationId]);

  const locationOptions = [
    { value: 'syntagma', label: 'Κέντρο Αθήνας, Πλατεία Συντάγματος' },
    { value: 'park', label: 'Πάρκο Εργηνης' },
    { value: 'thessaloniki', label: 'Θεσσαλονίκη' },
    { value: 'kolonaki', label: 'Κολωνάκι' },
    { value: 'other', label: 'Άλλη περιοχή' },
  ];

  const breadcrumbItems = [
    { label: 'Ιστορικό Δηλώσεων', path: ROUTES.owner.lostHistory },
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
    
    // Show notification
    setNotification('cancelled');
    
    // Auto-hide notification after 5 seconds and navigate
    setTimeout(() => {
      setNotification(null);
      navigate(`${ROUTES.owner.lostHistory}/${declarationId}`);
    }, 5000);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDraft = async () => {
    try {
      setIsSaving(true);

      const updateData = {
        petName: formData.petName,
        breed: formData.breed,
        dateLost: formData.date,
        phone: formData.phone,
        location: formData.location,
        description: formData.description,
        status: 'draft'
      };

      // Update the lost pet declaration in database
      const response = await fetch(`http://localhost:5000/lostPets/${declarationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Αποτυχία αποθήκευσης');
      }

      setIsSaving(false);

      // Show success notification
      setNotification('draft');

      // Navigate back quickly so user sees draft in history
      setTimeout(() => {
        setNotification(null);
        navigate(ROUTES.owner.lostHistory);
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      console.error('Error saving draft:', err);
      setNotification('error');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleSubmitClick = () => {
    // Validate phone before showing modal
    if (!validatePhone(formData.phone)) {
      setPhoneError('Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία');
      return;
    }
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSaving(true);

      const updateData = {
        petName: formData.petName,
        breed: formData.breed,
        dateLost: formData.date,
        phone: formData.phone,
        location: formData.location,
        description: formData.description,
        status: 'submitted'
      };

      // Update the lost pet declaration with submitted status
      const response = await fetch(`http://localhost:5000/lostPets/${declarationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Αποτυχία υποβολής');
      }

      setIsSaving(false);
      setShowSubmitModal(false);
      
      // Show success and navigate
      setNotification('submitted');
      setTimeout(() => {
        setNotification(null);
        navigate(ROUTES.owner.lostHistory);
      }, 5000);
    } catch (err) {
      setIsSaving(false);
      console.error('Error submitting:', err);
      setNotification('error');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
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
    <PageLayout variant="owner" title={formData.petName || 'Δήλωση Απώλειας'} breadcrumbs={breadcrumbItems}>
      <div className="lost-pet-edit">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Φόρτωση δήλωσης...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
            <p>Σφάλμα: {error}</p>
            <button 
              onClick={() => navigate(ROUTES.owner.lostHistory)}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Επιστροφή
            </button>
          </div>
        ) : (
          <>
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
                disabled={isSaving}
              >
                Ακύρωση
              </button>
              <button
                type="button"
                className="lost-pet-edit__btn lost-pet-edit__btn--draft"
                onClick={handleDraft}
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'Αποθήκευση...' : 'Πρόχειρο'}
              </button>
              <button
                type="button"
                className="lost-pet-edit__btn lost-pet-edit__btn--submit"
                onClick={handleSubmitClick}
                disabled={isSaving}
              >
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

        {/* Notification */}
        <Notification
          isVisible={notification !== null}
          message={
            notification === 'draft' 
              ? "Η δήλωση αποθηκεύτηκε ως πρόχειρη με επιτυχία! Μπορείτε να την επεξεργαστείτε από το Ιστορικό Δηλώσεων"
              : notification === 'submitted'
              ? "Η δήλωση υποβλήθηκε με επιτυχία!"
              : "Η επεξεργασία της δήλωσης ακυρώθηκε με επιτυχία!"
          }
          type={notification === 'draft' || notification === 'submitted' ? 'success' : 'error'}
        />
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default LostPetHistoryEdit;
