import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import { ROUTES } from '../../utils/constants';
import './Operation.css';

const Operation = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
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
    navigate(ROUTES.vet.dashboard);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <PageLayout>
        <div className="operation-success">
          <div className="operation-success__content">
            <div className="operation-success__icon">
              <Plus size={64} />
            </div>
            <h1 className="operation-success__title">Επιτυχής Καταγραφή!</h1>
            <p className="operation-success__description">
              Η ιατρική πράξη καταγράφηκε με επιτυχία στο σύστημα.
            </p>
            <button 
              className="operation-success__btn"
              onClick={() => navigate(ROUTES.vet.dashboard)}
            >
              Επιστροφή στο Μενού
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

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
      </div>
    </PageLayout>
  );
};

export default Operation;
