import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [foundPetDetails, setFoundPetDetails] = useState(null);
  const [formData, setFormData] = useState({
    petSearch: '',
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
        petSearch: pet.microchip,
      }));
      setFoundPetDetails(pet);
    } else {
      // Pet not found - just set microchip
      setFormData(prev => ({
        ...prev,
        petSearch: microchip
      }));
      setFoundPetDetails({ microchip });
      setFoundPetDetails({ microchip });
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
      const storedUser = localStorage.getItem('currentUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const response = await fetch('http://localhost:5000/medicalActs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vetId: currentUser?.id,
          petId: foundPetDetails?.id,
          date: new Date(formData.operationDate).toISOString(), // Ensure ISO format
          type: formData.operationType,
          description: formData.description,
          cost: 0 // Default cost as not in form
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit medical act');
      }

      console.log('Medical act submitted successfully');
      setShowConfirmModal(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Optional: Show error notification
      setNotification('start_error');
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Check if form is valid (all required fields filled and microchip is 15 digits)
  const isFormValid = () => {
    return (
      formData.petSearch.trim() !== '' &&
      formData.petSearch.length === 15 &&
      formData.operationType.trim() !== '' &&
      formData.operationDate.trim() !== ''
    );
  };

  // Helper function to get label for operation type
  const getOperationTypeLabel = (value) => {
    const options = {
      'vaccination': 'Εμβολιασμός',
      'checkup': 'Γενική Εξέταση',
      'surgery': 'Χειρουργείο',
      'treatment': 'Θεραπεία',
      'dental': 'Οδοντιατρική',
      'emergency': 'Επείγον Περιστατικό',
      'other': 'Άλλο'
    };
    return options[value] || value;
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
                  { value: 'vaccination', label: 'Εμβολιασμός' },
                  { value: 'checkup', label: 'Γενική Εξέταση' },
                  { value: 'surgery', label: 'Χειρουργείο' },
                  { value: 'treatment', label: 'Θεραπεία' },
                  { value: 'dental', label: 'Οδοντιατρική' },
                  { value: 'emergency', label: 'Επείγον Περιστατικό' },
                  { value: 'other', label: 'Άλλο' }
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
