import React, { useState, useEffect } from 'react';
import { SquarePen, X, Save, UserRoundCheck, UserRound, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/global/layout/PageLayout';
import MultiSelect from '../../components/common/MultiSelect';
import { ROUTES } from '../../utils/constants';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Γιάννης',
    lastName: 'Πετρίδης',
    email: 'john@example.com',
    phone: '6912345678',
    vetLicense: 'VET12345',
    specialties: ['Γενική Κτηνιατρική', 'Οδοντιατρική'], // Changed to array
    yearsOfExperience: '5',
    clinicName: 'Κτηνιατρικό Κέντρο Γέρακα',
    address: 'Ερμού 8, 15344',
    city: 'Γέρακας',
    university: 'Γεωπονικό Πανεπιστήμιο Αθηνών',
    bio: '',
  });

  const specialtyOptions = [
    { value: 'Γενική Κτηνιατρική', label: 'Γενική Κτηνιατρική' },
    { value: 'Χειρουργική', label: 'Χειρουργική' },
    { value: 'Δερματολογία', label: 'Δερματολογία' },
    { value: 'Καρδιολογία', label: 'Καρδιολογία' },
    { value: 'Οδοντιατρική', label: 'Οδοντιατρική' },
    { value: 'Οφθαλμολογία', label: 'Οφθαλμολογία' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (selectedSpecialties) => {
    setFormData(prev => ({
      ...prev,
      specialties: selectedSpecialties
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setIsEditing(false);
    setShowCancelModal(false);
    // Optionally reset form data here
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Handle account deletion logic here
    console.log('Account deleted');
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    
    // Redirect to dashboard after 5 seconds - CHANGE TO HOME PAGE LATER
    setTimeout(() => {
      navigate(ROUTES.vet.dashboard);
    }, 5000);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setIsEditing(false);
    setShowSaveSuccessModal(true);
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.vet.dashboard);
  };

  // If showing save success, render only the success page
  if (showSaveSuccessModal) {
    return (
      <PageLayout>
        <div className="profile-success">
          <div className="profile-success__content">
            <div className="profile-success__icon">
              <UserRound size={64} />
            </div>
            <h1 className="profile-success__title">Το προφίλ ανανεώθηκε!</h1>
            <p className="profile-success__description">
              Το προφίλ σας επεξεργάστηκε με επιτυχία. Οι αλλαγές που κάνατε καταχωρήθηκαν επιτυχώς και φαίνονται στο προφίλ σας.
            </p>
            <button 
              className="profile-success__btn"
              onClick={handleBackToDashboard}
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
      <div className="profile">
        <div className="profile__header">
          <h1 className="profile__title">Το Προφίλ μου</h1>
          <div className="profile__actions">
            {isEditing ? (
              <>
                <button 
                  className="profile__btn profile__btn--cancel"
                  onClick={handleCancel}
                  type="button"
                >
                  Ακύρωση
                </button>
                <button 
                  className="profile__btn profile__btn--save"
                  onClick={handleSubmit}
                  type="button"
                >
                  <Save size={18} />
                  Αποθήκευση
                </button>
              </>
            ) : (
              <>
                <button 
                  className="profile__btn profile__btn--delete"
                  onClick={handleDelete}
                  type="button"
                >
                  <X size={18} />
                  Διαγραφή Λογαριασμού
                </button>
                <button 
                  className="profile__btn profile__btn--edit"
                  onClick={handleEditToggle}
                  type="button"
                >
                  <SquarePen size={18} /> 
                  Επεξεργασία
                </button>
              </>
            )}
          </div>
        </div>

        <form className="profile__form" onSubmit={handleSubmit}>
          <div className="profile__grid">
            {/* First Name */}
            <div className="profile__field">
              <label className="profile__label">
                Όνομα <span className="profile__required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="profile__input"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Last Name */}
            <div className="profile__field">
              <label className="profile__label">
                Επώνυμο <span className="profile__required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="profile__input"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <div className="profile__field">
              <label className="profile__label">
                Email <span className="profile__required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="profile__input"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Phone */}
            <div className="profile__field">
              <label className="profile__label">
                Τηλέφωνο <span className="profile__required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="profile__input"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Vet License */}
            <div className="profile__field">
              <label className="profile__label">
                Αριθμός Άδειας Άσκησης Επαγγέλματος <span className="profile__required">*</span>
              </label>
              <input
                type="text"
                name="vetLicense"
                className="profile__input"
                value={formData.vetLicense}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Specialty */}
            <div className="profile__field">
              <label className="profile__label">
                Ειδικότητα/ες <span className="profile__required">*</span>
              </label>
              <MultiSelect
                name="specialties"
                value={formData.specialties}
                onChange={handleSpecialtiesChange}
                options={specialtyOptions}
                placeholder="Επιλέξτε ειδικότητες..."
                disabled={!isEditing}
                required
              />
            </div>

            {/* Years of Experience */}
            <div className="profile__field">
              <label className="profile__label">
                Έτη Εμπειρίας
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                className="profile__input"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Clinic Name */}
            <div className="profile__field">
              <label className="profile__label">
                Όνομα Κλινικής/Ιατρείου
              </label>
              <input
                type="text"
                name="clinicName"
                className="profile__input"
                value={formData.clinicName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Address */}
            <div className="profile__field">
              <label className="profile__label">
                Διεύθυνση <span className="profile__required">*</span>
              </label>
              <input
                type="text"
                name="address"
                className="profile__input"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* City */}
            <div className="profile__field">
              <label className="profile__label">
                Πόλη <span className="profile__required">*</span>
              </label>
              <input
                type="text"
                name="city"
                className="profile__input"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* University */}
            <div className="profile__field">
              <label className="profile__label">
                Εκπαίδευση
              </label>
              <input
                type="text"
                name="university"
                className="profile__input"
                value={formData.university}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Bio - Full Width */}
            <div className="profile__field profile__field--full">
              <label className="profile__label">
                Βιογραφικό
              </label>
              <textarea
                name="bio"
                className="profile__textarea"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
              />
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Είστε σίγουροι ότι θέλετε να διαγράψετε το λογαριασμό σας;</h2>
              <p className="modal-description">
                Αυτή η ενέργεια δεν αναιρείται. Όλα σας τα δεδομένα θα χαθούν.
              </p>
              <div className="modal-actions">
                <button 
                  className="modal-btn modal-btn--cancel"
                  onClick={handleCancelDelete}
                >
                  Ακύρωση
                </button>
                <button 
                  className="modal-btn modal-btn--delete"
                  onClick={handleConfirmDelete}
                >
                  Διαγραφή
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Edit Confirmation Modal */}
        {showCancelModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Είστε σίγουροι ότι θέλετε να ακυρώσετε τις αλλαγές στο προφίλ σας;</h2>
              <p className="modal-description">
                Αυτή η ενέργεια δεν αναιρείται.
              </p>
              <div className="modal-actions">
                <button 
                  className="modal-btn modal-btn--cancel"
                  onClick={handleCancelCancel}
                >
                  Όχι, επιστροφή
                </button>
                <button 
                  className="modal-btn modal-btn--delete"
                  onClick={handleConfirmCancel}
                >
                  Ναι, ακύρωση
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content modal-content--success">
              <div className="success-icon">
                <UserRoundCheck size={48} />
              </div>
              <h2 className="modal-title">Επιτυχής Διαγραφή!</h2>
              <p className="modal-description">
                Ο λογαριασμός σας διαγράφηκε με επιτυχία.
                <br />
                Επιστροφή στην αρχική.
                <br />
                Παρακαλώ περιμένετε...
              </p>
              <div className="loading-spinner">
                <Loader2 size={32} className="spinner" />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;
