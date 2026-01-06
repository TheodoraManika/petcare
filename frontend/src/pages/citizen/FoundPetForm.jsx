import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, AlertCircle, MapPin, Calendar, PawPrint } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import LocationPicker from '../../components/common/LocationPicker';
import DatePicker from '../../components/common/DatePicker';
import CustomSelect from '../../components/common/CustomSelect';
import './FoundPetForm.css';

const FoundPetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine variant based on route
  const getVariant = () => {
    if (location.pathname.includes('/owner/')) return 'owner';
    if (location.pathname.includes('/vet/')) return 'vet';
    return 'citizen';
  };
  
  const variant = getVariant();
  
  // Get pet details from navigation state if coming from LostPetDetails
  const prefilledPetData = location.state?.petDetails || {};
  
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    foundLocation: '',
    foundDate: '',
    description: '',
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      foundLocation: place?.label || formData.foundLocation
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/confirmation', {
      state: {
        title: 'Δήλωση Εύρεσης Υποβλήθηκε',
        message: 'Ευχαριστούμε για τη δήλωση εύρεσης. Θα επικοινωνήσουμε το συντομότερο δυνατό.',
        buttonText: 'Επιστροφή',
        buttonTo: '/',
        icon: <AlertCircle size={56} style={{ color: '#23CED9' }} />
      }
    });
  };

  const speciesOptions = [
    { value: 'dog', label: 'Σκύλος' },
    { value: 'cat', label: 'Γάτα' },
    { value: 'bird', label: 'Πουλί' },
    { value: 'rabbit', label: 'Λαγός' },
    { value: 'other', label: 'Άλλο' }
  ];

  const hasPrefilledData = Object.keys(prefilledPetData).length > 0;

  return (
    <PageLayout title="Δήλωση Εύρεσης Κατοικιδίου" variant={variant}>
      <div className="found-pet-form">
        <div className="form-header">
          <h1 className="form-title">Δήλωση Εύρεσης Κατοικιδίου</h1>
          <p className="form-subtitle">
            Βρήκατε ένα χαμένο κατοικίδιο; Συμπληρώστε τη φόρμα για να βοηθήσετε την επιστροφή του στους ιδιοκτήτες
          </p>
        </div>

        {/* Prefilled Pet Info Card */}
        {hasPrefilledData && (
          <div className="lost-pet-info-card">
            <div className="pet-card-container">
              <div className="pet-card-image">🐕</div>
              <div className="pet-card-details">
                <h3 className="pet-card-title">Στοιχεία Χαμένου Κατοικιδίου</h3>
                <div className="pet-card-info">
                  <div className="pet-card-section">
                    <div className="pet-card-row">
                      <span className="pet-card-label">Όνομα</span>
                      <span className="pet-card-value">{prefilledPetData.petName}</span>
                    </div>
                    <div className="pet-card-row">
                      <span className="pet-card-label">Είδος</span>
                      <span className="pet-card-value">{prefilledPetData.species}</span>
                    </div>
                    <div className="pet-card-row">
                      <span className="pet-card-label">Ράτσα</span>
                      <span className="pet-card-value">{prefilledPetData.breed}</span>
                    </div>
                  </div>
                  <div className="pet-card-section">
                    {prefilledPetData.microchip && (
                      <div className="pet-card-row">
                        <span className="pet-card-label">Αριθμός Μικροτσίπ</span>
                        <span className="pet-card-value">{prefilledPetData.microchip}</span>
                      </div>
                    )}
                    <div className="pet-card-row">
                      <span className="pet-card-label">Ημερομηνία Απώλειας</span>
                      <span className="pet-card-value">{prefilledPetData.dateReported}</span>
                    </div>
                    <div className="pet-card-row">
                      <span className="pet-card-label">Τοποθεσία Απώλειας</span>
                      <span className="pet-card-value">{prefilledPetData.foundLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container">
          {/* Only show pet detail fields if no prefilled data */}
          {!hasPrefilledData && (
            <>
              {/* Pet Name (optional) */}
              <div className="form-group">
                <label className="form-label">
                  Όνομα Κατοικιδίου <span className="form-label-optional">(αν είναι γνωστό)</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  placeholder="π.χ. Μπάμπης"
                  value={formData.petName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              {/* Species and Breed Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Είδος <span className="form-required">*</span>
                  </label>
                  <CustomSelect
                    value={formData.species}
                    onChange={(value) => setFormData({...formData, species: value})}
                    placeholder="Επιλέξτε είδος"
                    options={speciesOptions}
                    variant={variant}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ράτσα</label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="π.χ. Golden Retriever"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  Περιγραφή <span className="form-required">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Περιγράψτε το κατοικίδιο που βρήκατε (χρώμα, μέγεθος, ιδιαίτερα χαρακτηριστικά...)"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="5"
                  required
                />
              </div>
            </>
          )}

          {/* Location Row - Always visible */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} className="form-label-icon" />
              Τοποθεσία Εύρεσης <span className="form-required">*</span>
            </label>
            <LocationPicker
              value={formData.foundLocation}
              onChange={(val) => handleInputChange({ target: { name: 'foundLocation', value: val } })}
              onSelect={handleLocationSelect}
              placeholder="π.χ. Πλατεία Συντάγματος, Αθήνα"
              variant={variant}
            />
          </div>

          {/* Date Row - Always visible */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} className="form-label-icon" />
              Ημερομηνία Εύρεσης <span className="form-required">*</span>
            </label>
            <DatePicker
              name="foundDate"
              value={formData.foundDate}
              onChange={(value) => setFormData({...formData, foundDate: value})}
              variant={variant}
            />
          </div>

          {/* Photo Upload (optional) */}
          <div className="form-group">
            <label className="form-label">
              Φωτογραφία <span className="form-label-optional">(προαιρετικό)</span>
            </label>
            <div className="image-upload-area">
              {!imagePreview ? (
                <label className="image-upload-label">
                  <div className="upload-icon">
                    <Upload size={32} color="#23CED9" />
                  </div>
                  <p className="upload-text">Κάντε κλικ για να ανεβάσετε φωτογραφία</p>
                  <p className="upload-subtext">ή σύρετε και αφήστε εδώ</p>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, photo: null }));
                    }}
                    className="change-image-btn"
                  >
                    Αλλαγή Εικόνας
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="form-section-divider">
            <h2 className="section-title">Προσωπικά Στοιχεία <span className="form-required">*</span></h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Όνομα <span className="form-required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Όνομα"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Επώνυμο <span className="form-required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Επώνυμο"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="form-section-divider">
            <h2 className="section-title">Στοιχεία Επικοινωνίας</h2>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="form-required">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Τηλέφωνο <span className="form-required">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="69XXXXXXXX"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Υποβολή Δήλωσης
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default FoundPetForm;
