import React, { useState, useEffect } from 'react';
import { SquarePen, X, Save, UserRound, UserRoundCheck, Loader2, AlertCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    afm: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const navigate = useNavigate();
  
  // Original data that won't change unless saved
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    afm: '',
    address: '',
    city: '',
    postalCode: '',
  });
  
  // Working copy for editing
  const [formData, setFormData] = useState({...originalData});

  // Load user data from localStorage on component mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
      const userData = {
        firstName: currentUser.name || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        afm: currentUser.afm || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        postalCode: currentUser.postalCode || '',
      };
      
      setOriginalData(userData);
      setFormData({...userData});
    }
    
    setIsLoading(false);
  }, []);

  // Helper function to filter only Greek and English letters and spaces
  const filterLettersOnly = (value) => {
    return value.replace(/[^A-Za-z\u0370-\u03FF\u1F00-\u1FFF\u00B4\s]/g, '');
  };

  // Helper function to filter only numbers
  const allowedAFMChars = (value) => value.replace(/[^0-9]/g, '');

  // Helper function to filter phone characters
  const allowedPhoneChars = (value) => value.replace(/[^0-9\s+]/g, '');

  // Helper function to filter email characters - no Greek letters
  const allowedEmailChars = (value) => value.replace(/[\u0370-\u03FF\u1F00-\u1FFF]/g, '');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s+]/g, '');
    return cleanPhone.length >= 10;
  };

  const validateAFM = (afm) => {
    return afm.length === 9;
  };

  const validatePostalCode = (postalCode) => {
    return postalCode.length === 5;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let filteredValue = value;

    // Apply character filters based on field type
    if (name === 'firstName' || name === 'lastName' || name === 'city') {
      filteredValue = filterLettersOnly(value);
    } else if (name === 'afm' || name === 'postalCode') {
      filteredValue = allowedAFMChars(value);
      
      // Apply max length
      if (name === 'afm' && filteredValue.length > 9) {
        filteredValue = filteredValue.slice(0, 9);
      }
      if (name === 'postalCode' && filteredValue.length > 5) {
        filteredValue = filteredValue.slice(0, 5);
      }
    } else if (name === 'phone') {
      filteredValue = allowedPhoneChars(value);
    } else if (name === 'email') {
      filteredValue = allowedEmailChars(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
    // Clear all errors
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      afm: '',
      address: '',
      city: '',
      postalCode: '',
    });
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
    
    // Validate all fields
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Το πεδίο είναι υποχρεωτικό';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Το πεδίο είναι υποχρεωτικό';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Μη έγκυρη διεύθυνση email';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Το τηλέφωνο πρέπει να έχει τουλάχιστον 10 ψηφία';
    }

    if (!validateAFM(formData.afm)) {
      newErrors.afm = 'Το ΑΦΜ πρέπει να έχει ακριβώς 9 ψηφία';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Το πεδίο είναι υποχρεωτικό';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Το πεδίο είναι υποχρεωτικό';
    }

    if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Ο ταχυδρομικός κώδικας πρέπει να έχει ακριβώς 5 ψηφία';
    }

    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, save the changes to database
    saveProfileChanges();
  };

  const saveProfileChanges = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.id) {
        throw new Error('User not logged in');
      }

      const updatedUser = {
        ...currentUser,
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        afm: formData.afm,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      };

      // Save to database
      const response = await fetch(`http://localhost:5000/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const savedUser = await response.json();
      console.log('Profile updated successfully:', savedUser);

      // Update localStorage with new data
      localStorage.setItem('currentUser', JSON.stringify({
        ...currentUser,
        name: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        afm: formData.afm,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      }));

      // Update original data to reflect saved changes
      setOriginalData({...formData});
      setIsEditing(false);
      setShowSaveSuccessModal(true);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Σφάλμα κατά την αποθήκευση. Παρακαλώ δοκιμάστε ξανά.');
    }
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

  // If loading, show loading state
  if (isLoading) {
    return (
      <PageLayout variant="owner" title="Προφίλ" breadcrumbs={breadcrumbItems}>
        <div className="owner-profile">
          <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Loader2 size={40} className="loader-spin" />
          </div>
        </div>
      </PageLayout>
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
                className={`owner-profile__input ${errors.firstName ? 'owner-profile__input--error' : ''}`}
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              )}
              {errors.firstName && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.firstName}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Επώνυμο <span className="owner-profile__required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className={`owner-profile__input ${errors.lastName ? 'owner-profile__input--error' : ''}`}
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              )}
              {errors.lastName && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.lastName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Email <span className="owner-profile__required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`owner-profile__input ${errors.email ? 'owner-profile__input--error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται λατινικά γράμματα, αριθμοί και σύμβολα.</span>
              )}
              {errors.email && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Τηλέφωνο <span className="owner-profile__required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className={`owner-profile__input ${errors.phone ? 'owner-profile__input--error' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται αριθμοί, κενά και το σύμβολο +</span>
              )}
              {errors.phone && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Tax ID (AFM) */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                ΑΦΜ <span className="owner-profile__required">*</span>
              </label>
              <input
                type="text"
                name="afm"
                className={`owner-profile__input ${errors.afm ? 'owner-profile__input--error' : ''}`}
                value={formData.afm}
                onChange={handleInputChange}
                disabled={!isEditing}
                maxLength={9}
                required
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται μόνο αριθμοί, ακριβώς 9 ψηφία.</span>
              )}
              {errors.afm && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.afm}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Διεύθυνση<span className="owner-profile__required"> *</span>
              </label>
              <input
                type="text"
                name="address"
                className={`owner-profile__input ${errors.address ? 'owner-profile__input--error' : ''}`}
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {isEditing && (
                <span className="owner-profile__field-note">Οδός, Αριθμός</span>
              )}
              {errors.address && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.address}</span>
                </div>
              )}
            </div>

            {/* City */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Πόλη<span className="owner-profile__required"> *</span>
              </label>
              <input
                type="text"
                name="city"
                className={`owner-profile__input ${errors.city ? 'owner-profile__input--error' : ''}`}
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται ελληνικοί/λατινικοί χαρακτήρες και κενά.</span>
              )}
              {errors.city && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.city}</span>
                </div>
              )}
            </div>

            {/* Postal Code */}
            <div className="owner-profile__field">
              <label className="owner-profile__label">
                Τ.Κ.<span className="owner-profile__required"> *</span>
              </label>
              <input
                type="text"
                name="postalCode"
                className={`owner-profile__input ${errors.postalCode ? 'owner-profile__input--error' : ''}`}
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                maxLength={5}
              />
              {isEditing && (
                <span className="owner-profile__field-note">Επιτρέπονται μόνο αριθμοί.</span>
              )}
              {errors.postalCode && (
                <div className="owner-profile__error-message">
                  <AlertCircle size={16} />
                  <span>{errors.postalCode}</span>
                </div>
              )}
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
