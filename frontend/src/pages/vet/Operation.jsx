import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, FileText, AlertCircle, Search } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import ConfirmDetailModal from '../../components/common/modals/ConfirmDetailModal';
import SuccessPage from '../../components/common/modals/SuccessPage';
import Notification from '../../components/common/modals/Notification';
import MicrochipSearch from '../../components/common/forms/MicrochipSearch';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES } from '../../utils/constants';
import './Operation.css';

// Mock lost pets database


const Operation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [foundPetDetails, setFoundPetDetails] = useState(null);
  const [formData, setFormData] = useState({
    petSearch: location.state?.microchip || '',
    operationType: '',
    operationDate: '',
    description: ''
  });

  const handleSearchComplete = (result) => {
    const { found, pet, microchip } = result;

    if (found && pet) {
      // Pet found - prefill with data
      setFormData(prev => ({
        ...prev,
        petSearch: pet.microchipId,
      }));
      setFoundPetDetails(pet);
    } else {
      // Pet not found - just set microchip
      setFormData(prev => ({
        ...prev,
        petSearch: microchip
      }));
      setFoundPetDetails({ microchipId: microchip });
      // Removed error handling
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for microchip number (petSearch)
    if (name === 'petSearch') {
      // Allow only numbers
      const numericValue = value.replace(/[^0-9]/g, '');

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      // Removed error handling
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    // Reset form data to initial empty state
    setFormData({
      petSearch: '',
      operationType: '',
      operationDate: '',
      description: ''
    });
    setFoundPetDetails(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate microchip before submission
    // Validate microchip before submission
    if (formData.petSearch.length !== 15) {
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // Get current user (vet) from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser || currentUser.id === undefined) {
        setNotification({
          type: 'error',
          title: 'Σφάλμα',
          message: 'Δεν ήταν δυνατή η αναγνώριση του κτηνιάτρου. Παρακαλώ συνδεθείτε ξανά.'
        });
        return;
      }

      // First, find the pet by microchip
      const petsResponse = await fetch('http://localhost:5000/pets');
      if (!petsResponse.ok) {
        throw new Error('Failed to fetch pets');
      }
      const pets = await petsResponse.json();
      const pet = pets.find(p => p.microchipId === formData.petSearch);

      if (!pet) {
        setNotification({
          type: 'error',
          title: 'Κατοικίδιο Δεν Βρέθηκε',
          message: `Δεν βρέθηκε κατοικίδιο με microchip ${formData.petSearch}.`
        });
        setShowConfirmModal(false);
        return;
      }

      // Prepare medical operation data
      const operationData = {
        petId: pet.id,
        vetId: currentUser.id,
        type: formData.operationType,
        date: formData.operationDate,
        description: formData.description,
        createdAt: new Date().toLocaleDateString('el-GR')
      };

      // Submit to backend
      const response = await fetch('http://localhost:5000/medicalProcedures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Medical operation recorded successfully');
      setShowConfirmModal(false);
      setShowSuccess(true);

    } catch (error) {
      console.error('Error recording medical operation:', error);
      setNotification({
        type: 'error',
        title: 'Σφάλμα Καταγραφής',
        message: 'Δεν ήταν δυνατή η καταγραφή της ιατρικής πράξης. Παρακαλώ προσπαθήστε ξανά.'
      });
      setShowConfirmModal(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Check if form is valid (all required fields filled and microchip is 15 digits)
  const isFormValid = () => {
    return (
      formData.petSearch &&
      formData.petSearch.toString().trim() !== '' &&
      formData.petSearch.length === 15 &&
      formData.operationType &&
      formData.operationType.toString().trim() !== '' &&
      formData.operationDate &&
      formData.operationDate.toString().trim() !== ''
    );
  };

  // Helper function to get label for operation type
  const getOperationTypeLabel = (value) => {
    // Since we now store Greek labels directly, just return the value
    return value || '';
  };

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.petSearch },
    { label: 'Τύπος Πράξης', value: getOperationTypeLabel(formData.operationType) },
    { label: 'Ημερομηνία', value: formData.operationDate },
    { label: 'Περιγραφή', value: formData.description },
  ];

  const breadcrumbItems = [];

  if (showSuccess) {
    return (
      <SuccessPage
        icon={FileText}
        title="Η Ιατρική Πράξη Καταχωρήθηκε!"
        description="Η ιατρική πράξη αποθηκεύτηκε επιτυχώς στο βιβλίο του κατοικιδίου."
        buttonText="Επιστροφή στην Αρχική Κτηνιάτρου"
        onButtonClick={() => navigate(ROUTES.vet.dashboard)}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Ιατρικές Πράξεις"
      />
    );
  }

  return (
    <PageLayout title="Ιατρικές Πράξεις" breadcrumbs={breadcrumbItems}>
      <div className="operation">
        <div className="operation__header">
          <h1 className="operation__title">Καταγραφή Ιατρικής Πράξης</h1>
        </div>

        <div className="operation__form-wrapper">
          <form className="operation__form" onSubmit={handleSubmit}>
            {foundPetDetails ? (
              <PetDetailsCard
                petData={foundPetDetails}
                onClear={() => {
                  setFoundPetDetails(null);
                  setFormData(prev => ({
                    ...prev,
                    petSearch: ''
                  }));
                }}
                variant="vet"
              />
            ) : (
              <>
                <MicrochipSearch
                  onSearchComplete={handleSearchComplete}
                  variant="vet"
                  initialValue={location.state?.microchip || ''}
                />
              </>
            )}

            <div className="operation__field">
              <label className="operation__label">
                Τύπος Ιατρικής Πράξης <span className="operation__required">*</span>
              </label>
              <CustomSelect
                name="operationType"
                value={formData.operationType}
                onChange={(value) => handleSelectChange('operationType', value)}
                options={[
                  { value: 'Εμβολιασμός', label: 'Εμβολιασμός' },
                  { value: 'Γενική Εξέταση', label: 'Γενική Εξέταση' },
                  { value: 'Τοποθέτηση microchip', label: 'Τοποθέτηση microchip' },
                  { value: 'Χειρουργείο', label: 'Χειρουργείο' },
                  { value: 'Θεραπεία', label: 'Θεραπεία' },
                  { value: 'Οδοντιατρική', label: 'Οδοντιατρική' },
                  { value: 'Επείγον Περιστατικό', label: 'Επείγον Περιστατικό' },
                  { value: 'Άλλο', label: 'Άλλο' }
                ]}
                placeholder="Επιλέξτε τύπο πράξης"
                required
              />
            </div>

            <div className="operation__field">
              <label className="operation__label">
                Ημερομηνία <span className="operation__required">*</span>
              </label>
              <DatePicker
                name="operationDate"
                value={formData.operationDate}
                onChange={handleInputChange}
                maxDate={new Date()}
              />
            </div>

            <div className="operation__field">
              <label className="operation__label">
                Περιγραφή Πράξης
              </label>
              <textarea
                name="description"
                className="operation__textarea"
                placeholder="Λεπτομέρειες της ιατρικής πράξης..."
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
              />
            </div>

            <div className="operation__actions">
              <button
                type="button"
                className="operation__btn operation__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="operation__btn operation__btn--submit"
                disabled={!isFormValid()}
                title={!isFormValid() ? 'Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία' : ''}
              >
                <Plus size={18} />
                Καταγραφή
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την καταγραφή ιατρικής πράξης του κατοικιδίου;"
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
          title="Επιβεβαίωση Ιατρικής Πράξης"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της ιατρικής πράξης:"
          fields={confirmFields}
          cancelText="Επιστροφή"
          confirmText="Επιβεβαίωση"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />

        {/* Notification */}
        <Notification
          isVisible={notification !== null}
          message="Η καταγραφή της ιατρικής πράξης ακυρώθηκε με επιτυχία!"
          type="error"
        />
      </div>
    </PageLayout>
  );
};

export default Operation;
