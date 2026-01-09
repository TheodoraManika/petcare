import React, { useState } from 'react';
import { SquarePen, X, Save, UserRound, UserRoundCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/common/layout/PageLayout';
import SuccessPage from '../../components/common/modals/SuccessPage';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import { ROUTES } from '../../utils/constants';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const navigate = useNavigate();
  
  // Original data that won't change unless saved
  const [originalData, setOriginalData] = useState({
    firstName: 'Μαρία',
    lastName: 'Παπαδοπούλου',
    email: 'maria.p@example.com',
    phone: '6912345678',
    afm: '123456789',
    address: 'Πανεπιστημίου 45',
    city: 'Αθήνα',
    postalCode: '10679',
  });
  
  // Working copy for editing
  const [formData, setFormData] = useState({...originalData});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    // Reset form data to original values
    setFormData({...originalData});
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log('Account deleted');
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    
    // Redirect to home after 5 seconds
    setTimeout(() => {
      navigate(ROUTES.home);
    }, 5000);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Save the changes to originalData
    setOriginalData({...formData});
    setIsEditing(false);
    setShowSaveSuccessModal(true);
  };

  const handleBackToProfile = () => {
    setShowSaveSuccessModal(false);
  };

  const breadcrumbItems = [
  ];

  // If showing save success, render only the success page
  if (showSaveSuccessModal) {
    return (
      <SuccessPage
        icon={UserRound}
        title="Το προφίλ ανανεώθηκε!"
        description="Το προφίλ σας επεξεργάστηκε με επιτυχία. Οι αλλαγές που κάνατε καταχωρήθηκαν επιτυχώς και φαίνονται στο προφίλ σας."
        buttonText="Επιστροφή στο Προφίλ μου"
        onButtonClick={handleBackToProfile}
        iconColor="#23CDD9"
        iconBgColor="#E8F8FA"
        breadcrumbs={breadcrumbItems}
        pageTitle="Προφίλ"
        variant="owner"
      />
    );
  }

  return (
    <PageLayout variant="owner" title="Προφίλ" breadcrumbs={breadcrumbItems}>
      <div className="owner-profile">
        <div className="owner-profile__header">
          <h1 className="owner-profile__title">Το Προφίλ μου</h1>
          <div className="owner-profile__actions">
            {isEditing ? (
              <>
                <button 
                  className="owner-profile__btn owner-profile__btn--cancel"
                  onClick={handleCancel}
                  type="button"
                >
                  Ακύρωση
                </button>
                <button 
                  className="owner-profile__btn owner-profile__btn--save"
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
                  className="owner-profile__btn owner-profile__btn--delete"
                  onClick={handleDelete}
                  type="button"
                >
                  <X size={18} />
                  Διαγραφή Λογαριασμού
                </button>
                <button 
                  className="owner-profile__btn owner-profile__btn--edit"
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

        <form className="owner-profile__form" onSubmit={handleSubmit}>
          <div className="owner-profile__grid">
            {/* First Name */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Όνομα <span className="owner-profile__required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="owner-profile__input"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Last Name */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Επώνυμο <span className="owner-profile__required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="owner-profile__input"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Email <span className="owner-profile__required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="owner-profile__input"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Phone */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Τηλέφωνο <span className="owner-profile__required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="owner-profile__input"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Tax ID (AFM) */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                ΑΦΜ <span className="owner-profile__required">*</span>
              </label>
              <input
                type="text"
                name="afm"
                className="owner-profile__input"
                value={formData.afm}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Address */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Διεύθυνση
              </label>
              <input
                type="text"
                name="address"
                className="owner-profile__input"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* City */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Πόλη
              </label>
              <input
                type="text"
                name="city"
                className="owner-profile__input"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Postal Code */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Τ.Κ.
              </label>
              <input
                type="text"
                name="postalCode"
                className="owner-profile__input"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Είστε σίγουροι ότι θέλετε να διαγράψετε το λογαριασμό σας;"
          description="Αυτή η ενέργεια δεν αναιρείται. Όλα σας τα δεδομένα θα χαθούν."
          cancelText="Ακύρωση"
          confirmText="Διαγραφή"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isDanger={true}
        />

        {/* Cancel Edit Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε τις αλλαγές στο προφίλ σας;"
          description="Αυτή η ενέργεια δεν αναιρείται."
          cancelText="Όχι, επιστροφή"
          confirmText="Ναι, ακύρωση"
          onCancel={handleCancelCancel}
          onConfirm={handleConfirmCancel}
          isDanger={true}
        />

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
