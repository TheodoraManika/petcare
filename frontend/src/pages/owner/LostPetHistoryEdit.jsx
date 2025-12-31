import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileCheck } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
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

  const locationOptions = [
    { value: 'syntagma', label: 'Κέντρο Αθήνας, Πλατεία Συντάγματος' },
    { value: 'park', label: 'Πάρκο Εργηνης' },
    { value: 'thessaloniki', label: 'Θεσσαλονίκη' },
    { value: 'kolonaki', label: 'Κολωνάκι' },
    { value: 'other', label: 'Άλλη περιοχή' },
  ];

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.owner.dashboard },
    { label: 'Ιστορικό Δηλώσεων', path: ROUTES.owner.lostHistory },
    { label: 'Δήλωση Απώλειας', path: `${ROUTES.owner.lostHistory}/${declarationId}` },
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

  const handleCancel = () => {
    navigate(`${ROUTES.owner.lostHistory}/${declarationId}`);
  };

  const handleDraft = () => {
    console.log('Saving as draft:', formData);
    navigate(ROUTES.owner.lostHistory);
  };

  const handleSubmit = () => {
    console.log('Submitting:', formData);
    navigate(ROUTES.owner.lostHistory);
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
                />
              </div>

              <div className="lost-pet-edit__field">
                <label className="lost-pet-edit__label">
                  Τηλέφωνο Επικοινωνίας <span className="lost-pet-edit__required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="lost-pet-edit__input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="lost-pet-edit__field">
              <label className="lost-pet-edit__label">
                Τοποθεσία Εξαφάνισης <span className="lost-pet-edit__required">*</span>
              </label>
              <CustomSelect
                name="location"
                value={formData.location}
                onChange={(value) => handleSelectChange('location', value)}
                options={locationOptions}
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
                onClick={handleSubmit}
              >
                <FileCheck size={18} />
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default LostPetHistoryEdit;
