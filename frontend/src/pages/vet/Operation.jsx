import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Plus, FileText } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Operation.css';

const Operation = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    petSearch: '',
    operationType: '',
    operationDate: '',
    description: ''
  });

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
    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    console.log('Form submitted:', formData);
    setShowConfirmModal(false);
    setShowConfirmModal(false);
    setShowSuccess(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
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
  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
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

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

  if (showSuccess) {
    return (
      <SuccessPage
        icon={FileText}
        title="Η Ιατρική Πράξη Καταχωρήθηκε!"
        description="Η ιατρική πράξη αποθηκεύτηκε επιτυχώς στο βιβλίο του κατοικιδίου."
        buttonText="Επιστροφή στο Μενού"
        onButtonClick={() => navigate(ROUTES.vet.dashboard)}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Ιατρικές Πράξεις"
      />
    );
  }

  if (showSuccess) {
    return (
      <SuccessPage
        icon={FileText}
        title="Η Ιατρική Πράξη Καταχωρήθηκε!"
        description="Η ιατρική πράξη αποθηκεύτηκε επιτυχώς στο βιβλίο του κατοικιδίου."
        buttonText="Επιστροφή στο Μενού"
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
            <div className="operation__field">
              <label className="operation__label">
                Αναζήτηση Κατοικιδίου (Μικροτσίπ) <span className="operation__required">*</span>
              </label>
              <input
                type="text"
                name="petSearch"
                className="operation__input"
                placeholder="GR123456789012345"
                value={formData.petSearch}
                onChange={handleInputChange}
                required
              />
            </div>

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
