import React, { useState } from 'react';
import { SquarePen, X } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Γιάννης',
    lastName: 'Πετρίδης',
    email: 'john@example.com',
    phone: '6912345678',
    vetLicense: 'VET12345',
    specialty: 'Γενική Κτηνιατρική',
    yearsOfExperience: '5',
    clinicName: 'Κτηνιατρικό Κέντρο Γέρακα',
    address: 'Ερμού 8, 15344',
    city: 'Γέρακας',
    university: 'Γεωπονικό Πανεπιστήμιο Αθηνών',
    bio: '',
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

  const handleDelete = () => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.')) {
      // Handle account deletion logic here
      console.log('Account deletion requested');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setIsEditing(false);
  };

  return (
    <PageLayout>
      <div className="profile">
        <div className="profile__header">
          <h1 className="profile__title">Το Προφίλ μου</h1>
          <div className="profile__actions">
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
              onClick={isEditing ? handleSubmit : handleEditToggle}
              type="button"
            >
              <SquarePen size={18} /> 
              {isEditing ? 'Επεξεργασία' : 'Επεξεργασία'}
            </button>
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
              <input
                type="text"
                name="specialty"
                className="profile__input"
                value={formData.specialty}
                onChange={handleInputChange}
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
      </div>
    </PageLayout>
  );
};

export default Profile;
