import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Send } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import LocationPicker from '../../components/common/LocationPicker';
import ConfirmModal from '../../components/common/ConfirmModal';
import ConfirmDetailModal from '../../components/common/ConfirmDetailModal';
import SuccessPage from '../../components/common/SuccessPage';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(null);
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
    ownerAddressLat: '',
    ownerAddressLon: '',
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
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Reset form data to initial empty state
    setFormData({
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
      ownerAddressLat: '',
      ownerAddressLon: '',
      afm: '',
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
    
    // Validate required fields
    if (!formData.microchipNumber.trim() || !formData.species || !formData.ownerName.trim() || 
        !formData.gender || !formData.birthDate || !formData.ownerLastName.trim() || 
        !formData.ownerPhone.trim() || !formData.ownerEmail.trim() || !formData.ownerAddress.trim() || !formData.afm.trim()) {
      alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία');
      return;
    }

    // Submit to backend
    const submitPetData = async () => {
      try {
        // First, find the owner by AFM to get their ID
        const usersResponse = await fetch('http://localhost:5000/users');
        const users = await usersResponse.json();
        const owner = users.find(u => u.afm === formData.afm && u.userType === 'owner');

        if (!owner) {
          alert('Δεν βρέθηκε ιδιοκτήτης με αυτό το ΑΦΜ');
          return;
        }

        // Create pet object
        const newPet = {
          ownerId: owner.id,
          name: formData.ownerName,
          species: formData.species,
          breed: formData.breed || 'Ημίαιμο',
          gender: formData.gender,
          birthDate: formData.birthDate,
          color: formData.color || '',
          weight: formData.weight || '',
          microchipId: formData.microchipNumber,
          registeredByVetId: 2, // TODO: Get current vet ID from localStorage
          createdAt: new Date().toISOString(),
        };

        // POST to pets endpoint
        const response = await fetch('http://localhost:5000/pets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPet),
        });

        if (!response.ok) {
          throw new Error('Failed to register pet');
        }

        setShowSuccess(true);
      } catch (err) {
        console.error('Pet registration error:', err);
        alert('Σφάλμα κατά την καταγραφή του κατοικιδίου. Βεβαιωθείτε ότι το JSON Server είναι ενεργό.');
      }
    };

    submitPetData();
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  // Helper function to get label for species
  const getSpeciesLabel = (value) => {
    const options = {
      'dog': 'Σκύλος',
      'cat': 'Γάτα',
      'bird': 'Πτηνό',
      'reptile': 'Ερπετό',
      'other': 'Άλλο'
    };
    return options[value] || value;
  };

  // Helper function to get label for gender
  const getGenderLabel = (value) => {
    const options = {
      'male': 'Αρσενικό',
      'female': 'Θηλυκό'
    };
    return options[value] || value;
  };

  // Prepare fields for confirmation modal
  const confirmFields = [
    { label: 'Μικροτσίπ', value: formData.microchipNumber },
    { label: 'Είδος', value: getSpeciesLabel(formData.species) },
    { label: 'Ράτσα', value: formData.breed },
    { label: 'Όνομα', value: formData.ownerName },
    { label: 'Φύλο', value: getGenderLabel(formData.gender) },
    { label: 'Ημερομηνία Γέννησης', value: formData.birthDate },
    { label: 'Χρώμα', value: formData.color },
    { label: 'Βάρος (kg)', value: formData.weight },
    { label: 'Ιδιοκτήτης', value: formData.ownerLastName },
    { label: 'Τηλέφωνο', value: formData.ownerPhone },
    { label: 'Email', value: formData.ownerEmail },
    { label: 'Διεύθυνση', value: formData.ownerAddress },
    { label: 'ΑΦΜ', value: formData.afm },
  ];

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

  if (showSuccess) {
    return (
      <SuccessPage
        icon={Send}
        title="Η καταγραφή ολοκληρώθηκε!"
        description="Το κατοικίδιο καταχωρήθηκε με επιτυχία στο σύστημα."
        buttonText="Επιστροφή στο Μενού"
        onButtonClick={() => navigate(ROUTES.vet.dashboard)}
        iconColor="#FCA47C"
        iconBgColor="#FFF4ED"
        breadcrumbs={breadcrumbItems}
        pageTitle="Καταγραφή Κατοικιδίου"
      />
    );
  }

  return (
    <PageLayout title="Καταγραφή Κατοικιδίου" breadcrumbs={breadcrumbItems}>
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

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε την καταγραφή του κατοικιδίου;"
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
          title="Επιβεβαίωση Καταγραφής"
          subtitle="Παρακαλώ ελέγξτε τα στοιχεία της καταγραφής:"
          fields={confirmFields}
          cancelText="Επιστροφή"
          confirmText="Επιβεβαίωση"
          onCancel={handleCancelSubmit}
          onConfirm={handleConfirmSubmit}
        />

        {/* Notification */}
        <Notification
          isVisible={notification !== null}
          message="Η καταγραφή του κατοικιδίου ακυρώθηκε με επιτυχία!"
          type="error"
        />
      </div>
    </PageLayout>
  );
};

export default Register;
