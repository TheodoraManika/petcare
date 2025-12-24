import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Send } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import { ROUTES } from '../../utils/constants';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    microchipNumber: '',
    species: '',
    breed: '',
    ownerName: '',
    gender: '',
    birthDate: '',
    color: '',
    weight: '',
    ownerLastName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerAddress: '',
    afm: '',
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
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <PageLayout>
        <div className="register-success">
          <div className="register-success__content">
            <div className="register-success__icon">
              <Send size={64} />
            </div>
            <h1 className="register-success__title">Επιτυχής Καταγραφή!</h1>
            <p className="register-success__description">
              Το κατοικίδιο καταγράφηκε με επιτυχία στο σύστημα.
            </p>
            <button 
              className="register-success__btn"
              onClick={() => navigate(ROUTES.vet.dashboard)}
            >
              Επιστροφή στο Μενού
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="register">
        {/* Info Banner */}
        <div className="register__banner">
          <div className="register__banner-icon">
            <AlertCircle size={20} />
          </div>
          <div className="register__banner-content">
            <h3 className="register__banner-title">Σημείωση</h3>
            <p className="register__banner-text">
              Ο αριθμός μικροτσίπ είναι υποχρεωτικός και μοναδικός για κάθε κατοικίδιο.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="register__form-wrapper">
          <h1 className="register__title">Ταυτότητα Κατοικιδίου</h1>

          <form className="register__form" onSubmit={handleSubmit}>
            {/* Pet Identity Section */}
            <div className="register__section">
              <div className="register__field">
                <label className="register__label">
                  Αριθμός Μικροτσίπ <span className="register__required">*</span>
                </label>
                <input
                  type="text"
                  name="microchipNumber"
                  className="register__input"
                  placeholder="123456789012345 (15 ψηφία)"
                  value={formData.microchipNumber}
                  onChange={handleInputChange}
                  maxLength={15}
                  required
                />
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Είδος Ζώου <span className="register__required">*</span>
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
                    required
                  />
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Ράτσα
                  </label>
                  <input
                    type="text"
                    name="breed"
                    className="register__input"
                    placeholder="π.χ. Golden Retriever"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                  <span className="register__field-note">Αν η ράτσα δεν είναι γνωστή συμπληρώστε "Ημίαιμο"</span>
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Όνομα Κατοικιδίου <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    className="register__input"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Φύλο <span className="register__required">*</span>
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
                    required
                  />
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Ημερομηνία Γέννησης <span className="register__required">*</span>
                  </label>
                  <DatePicker
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                  <span className="register__field-note">Συμπληρώστε κατά προσέγγιση αν δεν γνωρίζετε την ακριβή ημερομηνία γέννησης</span>
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Χρώμα
                  </label>
                  <input
                    type="text"
                    name="color"
                    className="register__input"
                    placeholder="π.χ. Καφέ"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="register__field register__field--small">
                <label className="register__label">
                  Βάρος (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  className="register__input"
                  placeholder="π.χ. 25.5"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.1"
                />
              </div>
            </div>

            {/* Owner Information Section */}
            <div className="register__section">
              <h2 className="register__section-title">Στοιχεία Ιδιοκτήτη</h2>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Ονοματεπώνυμο <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerLastName"
                    className="register__input"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Τηλέφωνο <span className="register__required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    className="register__input"
                    placeholder="69XXXXXXXX"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="register__row">
                <div className="register__field">
                  <label className="register__label">
                    Email <span className="register__required">*</span>
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    className="register__input"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="register__field">
                  <label className="register__label">
                    Διεύθυνση <span className="register__required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerAddress"
                    className="register__input"
                    placeholder="π.χ. Σαρανταπόρου 5, 15342"
                    value={formData.ownerAddress}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="register__field-note">Οδός, Αριθμός, Τ.Κ.</span>
                </div>
              </div>

              <div className="register__field register__field--small">
                <label className="register__label">
                  ΑΦΜ <span className="register__required">*</span>
                </label>
                <input
                  type="text"
                  name="afm"
                  className="register__input"
                  value={formData.afm}
                  onChange={handleInputChange}
                  maxLength={9}
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="register__actions">
              <button
                type="button"
                className="register__btn register__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="register__btn register__btn--submit"
              >
                <Send size={18} />
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;
