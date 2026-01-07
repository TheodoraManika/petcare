import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/global/layout/PageLayout';
import DatePicker from '../../components/common/DatePicker';
import LocationPicker from '../../components/common/LocationPicker';
import { ROUTES } from '../../utils/constants';
import './LostPet.css';

const LostPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    microchipNumber: '',
    petName: '',
    lostDate: '',
    contactPhone: '',
    location: '',
    locationLat: '',
    locationLon: '',
    description: '',
    photo: '',
    ownerName: '',
    ownerSurname: '',
    ownerAfm: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      location: place?.label || prev.location,
      locationLat: place?.lat || '',
      locationLon: place?.lon || ''
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: ''
    }));
    setPhotoPreview(null);
  };

  const isFormValid = () => {
    return (
      formData.microchipNumber.trim() !== '' &&
      formData.petName.trim() !== '' &&
      formData.lostDate.trim() !== '' &&
      formData.contactPhone.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.ownerName.trim() !== '' &&
      formData.ownerSurname.trim() !== '' &&
      formData.ownerAfm.trim() !== ''
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const submitLostPetDeclaration = async () => {
        try {
          // First, find the owner by AFM
          const usersResponse = await fetch('http://localhost:5000/users');
          const users = await usersResponse.json();
          const owner = users.find(u => u.afm === formData.ownerAfm && u.userType === 'owner');

          if (!owner) {
            alert('Δεν βρέθηκε ιδιοκτήτης με αυτό το ΑΦΜ');
            return;
          }

          // Find the pet by microchip to get petId
          const petsResponse = await fetch('http://localhost:5000/pets');
          const pets = await petsResponse.json();
          const pet = pets.find(p => p.microchipId === formData.microchipNumber);

          if (!pet) {
            alert('Δεν βρέθηκε κατοικίδιο με αυτό το μικροτσίπ');
            return;
          }

          // Get current vet from localStorage
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (!currentUser || currentUser.userType !== 'vet') {
            alert('Παρακαλώ συνδεθείτε ως κτηνίατρος');
            return;
          }

          // Create lost pet declaration object
          const newDeclaration = {
            petId: pet.id,
            ownerId: owner.id,
            reportedByVetId: currentUser.id,
            microchipNumber: formData.microchipNumber,
            petName: formData.petName,
            lostDate: formData.lostDate,
            lostLocation: formData.location,
            locationLat: formData.locationLat,
            locationLon: formData.locationLon,
            contactPhone: formData.contactPhone,
            description: formData.description || '',
            imageUrl: null, // TODO: Handle file upload to a storage service
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          // POST to lostPets endpoint
          const response = await fetch('http://localhost:5000/lostPets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDeclaration),
          });

          if (!response.ok) {
            throw new Error('Failed to submit lost pet declaration');
          }

          alert('Η δήλωση απώλειας καταχωρήθηκε με επιτυχία!');
          navigate(ROUTES.vet.dashboard);
        } catch (err) {
          console.error('Lost pet declaration error:', err);
          alert('Σφάλμα κατά την υποβολή της δήλωσης. Βεβαιωθείτε ότι το JSON Server είναι ενεργό.');
        }
      };

      submitLostPetDeclaration();
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.vet.dashboard);
  };

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

  return (
    <PageLayout title="Δήλωση Απώλειας" breadcrumbs={breadcrumbItems}>
      <div className="lost-pet">
        <div className="lost-pet__content">

          <form className="lost-pet__form">
            {/* Κωδικός Μικροτσίπ */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Κωδικός Μικροτσίπ <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="microchipNumber"
                className="lost-pet__input"
                placeholder="GR123456789012345"
                value={formData.microchipNumber}
                onChange={handleInputChange}
                maxLength={15}
                required
              />
            </div>

            {/* Όνομα Κατοικιδίου */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Όνομα Κατοικιδίου <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="petName"
                className="lost-pet__input"
                value={formData.petName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Ημερομηνία Εξαφάνισης & Τηλέφωνο */}
            <div className="lost-pet__row">
              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Ημερομηνία Εξαφάνισης <span className="lost-pet__required">*</span>
                </label>
                <DatePicker
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Τηλέφωνο Επικοινωνίας <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="lost-pet__input"
                  placeholder="69XXXXXXXX"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Τοποθεσία Εξαφάνισης */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Τοποθεσία Εξαφάνισης <span className="lost-pet__required">*</span>
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                onSelect={handleLocationSelect}
                required
                variant="vet"
              />
            </div>

            {/* Περιγραφή */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Περιγραφή
              </label>
              <textarea
                name="description"
                className="lost-pet__textarea"
                placeholder="Περιγράψτε το κατοικίδιο (χρώμα, μέγεθος, διακριτικά γνωρίσματα...)"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {/* Φωτογραφία */}
            <div className="lost-pet__field">
              <label className="lost-pet__label">
                Φωτογραφία
              </label>
              
              {!photoPreview ? (
                <div className="lost-pet__file-upload">
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo"
                    className="lost-pet__file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="photo-upload" className="lost-pet__file-label">
                    <span className="lost-pet__file-text">Επιλέξτε Φωτογραφία</span>
                  </label>
                  <span className="lost-pet__field-note">Προσθέστε φωτογραφία του κατοικιδίου</span>
                </div>
              ) : (
                <div className="lost-pet__photo-preview">
                  <img src={photoPreview} alt="Preview" className="lost-pet__preview-image" />
                  <button
                    type="button"
                    className="lost-pet__remove-photo"
                    onClick={handleRemovePhoto}
                    title="Αφαίρεση φωτογραφίας"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Στοιχεία Ιδιοκτήτη */}
            <div className="lost-pet__section-title">
              Στοιχεία Ιδιοκτήτη (για τον οποίο γίνεται η δήλωση)
            </div>

            <div className="lost-pet__row">
              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Όνομα <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  className="lost-pet__input"
                  placeholder="Όνομα Ιδιοκτήτη"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="lost-pet__field">
                <label className="lost-pet__label">
                  Επώνυμο <span className="lost-pet__required">*</span>
                </label>
                <input
                  type="text"
                  name="ownerSurname"
                  className="lost-pet__input"
                  placeholder="Επώνυμο Ιδιοκτήτη"
                  value={formData.ownerSurname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="lost-pet__field">
              <label className="lost-pet__label">
                ΑΦΜ <span className="lost-pet__required">*</span>
              </label>
              <input
                type="text"
                name="ownerAfm"
                className="lost-pet__input"
                placeholder="ΑΦΜ Ιδιοκτήτη"
                value={formData.ownerAfm}
                onChange={handleInputChange}
                maxLength={9}
                required
              />
            </div>

            {/* Actions */}
            <div className="lost-pet__actions">
              <button
                type="button"
                className="lost-pet__btn lost-pet__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>

              <button
                type="button"
                className="lost-pet__btn lost-pet__btn--primary"
                onClick={handleSubmit}
                disabled={!isFormValid()}
              >
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default LostPet;
