import React, { useState } from 'react';
import { SquarePen, X, Save, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Μαρία',
    lastName: 'Παπαδοπούλου',
    email: 'maria.p@example.com',
    phone: '6912345678',
    afm: '123456789',
    address: 'Πανεπιστημίου 45',
    city: 'Αθήνα',
    postalCode: '10679',
  });

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
    navigate(ROUTES.owner.dashboard);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsEditing(false);
    setShowSaveSuccessModal(true);
  };

  const handleBackToDashboard = () => {
    navigate(ROUTES.owner.dashboard);
  };

  if (showSaveSuccessModal) {
    return (
      <PageLayout variant="owner">
        <div className="owner-profile-success">
          <div className="owner-profile-success__content">
            <div className="owner-profile-success__icon">
              <UserRound size={64} />
            </div>
            <h1 className="owner-profile-success__title">Το προφίλ ανανεώθηκε!</h1>
            <p className="owner-profile-success__description">
              Το προφίλ σας επεξεργάστηκε με επιτυχία. Οι αλλαγές που κάνατε καταχωρήθηκαν επιτυχώς και φαίνονται στο προφίλ σας.
            </p>
            <button 
              className="owner-profile-success__btn"
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
    <PageLayout variant="owner">
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
      </div>
    </PageLayout>
  );
};

export default Profile;
