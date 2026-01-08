import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, AlertCircle, MapPin, Calendar, PawPrint, Search as SearchIcon, X } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import LocationPicker from '../../components/common/forms/LocationPicker';
import DatePicker from '../../components/common/forms/DatePicker';
import CustomSelect from '../../components/common/forms/CustomSelect';
import './FoundPetForm.css';

// Mock lost pets database
const lostPetsDatabase = [
  {
    id: 1,
    name: 'Μπάμπης',
    type: 'Σκύλος',
    breed: 'Golden Retriever',
    area: 'Κέντρο Αθήνας, Πλατεία Συντάγματος',
    dateLost: '05/11/2025',
    color: 'Χρυσαφί',
    microchip: 'GR123456789012345',
    description: 'Φιλικός, φοράει πράσινο περιλαίμιο.',
    traits: ['Ήρεμος', 'Αγαπά παιδιά', 'Σπιτικός'],
  },
  {
    id: 2,
    name: 'Φιφή',
    type: 'Γάτα',
    breed: 'Περσική',
    area: 'Θεσσαλονίκη, Καλαμαριά',
    dateLost: '10/11/2025',
    color: 'Λευκό',
    microchip: 'GR987654321000111',
    description: 'Τρομάζει εύκολα, προτιμά ήρεμα περιβάλλοντα.',
    traits: ['Πολύ ήρεμη', 'Αγαπά λιχουδιές'],
  },
  {
    id: 3,
    name: 'Ρεξ',
    type: 'Σκύλος',
    breed: 'Λαμπραντόρ',
    area: 'Πάτρα, Κέντρο',
    dateLost: '08/11/2025',
    color: 'Μαύρο',
    microchip: 'GR000111222333444',
    description: 'Ενεργητικός, αγαπά να τρέχει.',
    traits: ['Ενεργητικός', 'Χρειάζεται χώρο'],
  },
];

const FoundPetForm = ({ inline = false, onClose = null, prefill = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  
  // Determine variant based on logged-in user type, not route
  const getVariant = () => {
    if (!currentUser) return 'citizen';
    if (currentUser.userType === 'owner') return 'owner';
    if (currentUser.userType === 'vet') return 'vet';
    return 'citizen';
  };
  
  const variant = getVariant();
  const isOwner = currentUser?.userType === 'owner';
  
  // Mock pet data for owner
  const userPets = [
    { value: 'pet1', label: 'Μαξ - GR123456789012345', name: 'Μαξ', type: 'Σκύλος', breed: 'Golden Retriever', microchip: 'GR123456789012345' },
    { value: 'pet2', label: 'Λούνα - GR987654321098765', name: 'Λούνα', type: 'Γάτα', breed: 'Persian', microchip: 'GR987654321098765' },
    { value: 'pet3', label: 'Ρεξ - GR555666777888999', name: 'Ρεξ', type: 'Σκύλος', breed: 'German Shepherd', microchip: 'GR555666777888999' },
  ];
  
  // Get pet details from prefill prop or navigation state if coming from LostPetDetails
  const navigationState = location.state || {};
  const navigationPetData = (prefill && prefill.petDetails) || navigationState.petDetails || {};
  
  // Get microchip ID if passed directly (for unregistered pets)
  const navigationMicrochipId = (prefill && prefill.microchipId) || navigationState.microchipId || '';
  
  const [selectedOwnPet, setSelectedOwnPet] = useState('');
  const [prefilledPetData, setPrefilledPetData] = useState(
    navigationMicrochipId 
      ? { microchip: navigationMicrochipId }
      : navigationPetData
  );
  const [microchipInput, setMicrochipInput] = useState(navigationMicrochipId || prefilledPetData.microchip || '');
  
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία (*)');
      return;
    }

    try {
      // Create the found pet declaration object
      const newFoundPet = {
        petName: formData.petName || 'Άγνωστο',
        species: formData.species || '',
        breed: formData.breed || '',
        description: formData.description || '',
        foundDate: formData.foundDate,
        foundLocation: formData.foundLocation,
        reporterFirstName: formData.firstName,
        reporterLastName: formData.lastName,
        reporterEmail: formData.email,
        reporterPhone: formData.phone,
        status: 'active',
        imageUrl: null, // TODO: Implement file upload
        createdAt: new Date().toISOString()
      };

      // Submit to backend
      const response = await fetch('http://localhost:5000/foundPets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFoundPet)
      });

      if (!response.ok) {
        throw new Error('Failed to submit found pet declaration');
      }

      // Success - navigate to confirmation
      alert('Δήλωση εύρεσης υποβλήθηκε με επιτυχία!');
      navigate('/confirmation', {
        state: {
          title: 'Δήλωση Εύρεσης Υποβλήθηκε',
          message: 'Ευχαριστούμε για τη δήλωση εύρεσης. Θα επικοινωνήσουμε το συντομότερο δυνατό.',
          buttonText: 'Επιστροφή',
          buttonTo: '/',
          icon: <AlertCircle size={56} style={{ color: '#23CED9' }} />
        }
      });
    } catch (error) {
      console.error('Error submitting found pet declaration:', error);
      alert('Σφάλμα κατά την υποβολή της δήλωσης. Παρακαλώ προσπαθήστε ξανά.');
    }
  };

  const speciesOptions = [
    { value: 'dog', label: 'Σκύλος' },
    { value: 'cat', label: 'Γάτα' },
    { value: 'bird', label: 'Πουλί' },
    { value: 'rabbit', label: 'Λαγός' },
    { value: 'other', label: 'Άλλο' }
  ];

  const handleOwnPetSelect = (petValue) => {
    setSelectedOwnPet(petValue);
    if (petValue) {
      const selectedPet = userPets.find(p => p.value === petValue);
      if (selectedPet) {
        setPrefilledPetData({
          petName: selectedPet.name,
          species: selectedPet.type,
          breed: selectedPet.breed,
          microchip: selectedPet.microchip,
          dateReported: new Date().toLocaleDateString('el-GR'),
          foundLocation: ''
        });
      }
    } else {
      setPrefilledPetData({});
    }
  };

  const isFormValid = () => {
    return (
      formData.foundLocation.trim() !== '' &&
      formData.foundDate.trim() !== '' &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      (!hasPrefilledData && formData.description.trim() !== '' || hasPrefilledData)
    );
  };

  const handleClearPrefilledData = () => {
    setSelectedOwnPet('');
    setPrefilledPetData({});
    setMicrochipInput('');
  };

  const handleMicrochipSearch = () => {
    if (!microchipInput.trim()) return;
    
    // Search in lost pets database
    const foundPet = lostPetsDatabase.find(
      pet => pet.microchip.toLowerCase() === microchipInput.toLowerCase()
    );
    
    if (foundPet) {
      // Pet found - prefill with full data
      setPrefilledPetData({
        petName: foundPet.name,
        species: foundPet.type,
        breed: foundPet.breed,
        foundLocation: foundPet.area,
        description: foundPet.description,
        dateReported: foundPet.dateLost,
        microchip: foundPet.microchip,
      });
    } else {
      // Pet not found - just store microchip
      setPrefilledPetData({
        microchip: microchipInput
      });
    }
  };

  const handleMicrochipInputChange = (e) => {
    setMicrochipInput(e.target.value);
  };

  const hasPrefilledData = Object.keys(prefilledPetData).length > 0;

  const breadcrumbItems = [
    { label: 'Χαμένα Κατοικίδια', path: '/citizen/lost-pets' },
  ];

  const formContent = (
    <div className={`found-pet-form found-pet-form--${variant}`}>
      {inline && (
        <button
          type="button"
          className="inline-form-close"
          onClick={() => {
            if (onClose) onClose(); else navigate('/');
          }}
          aria-label="Κλείσιμο φόρμας"
        >
          <X size={16} />
        </button>
      )}
      <h1 className="form-title">Δήλωση Εύρεσης </h1>
      <p className="form-subtitle">
        Βρήκατε ένα χαμένο κατοικίδιο; Συμπληρώστε τη φόρμα για να βοηθήσετε την επιστροφή του στους ιδιοκτήτες
      </p>
      <div className="form-header">
      </div>

      <form onSubmit={handleSubmit} className="form-container">
          {/* Microchip Search - Always visible when no prefilled data */}
          {!hasPrefilledData && (
            <div className="microchip-search-section">
              <label className="form-label">
                <SearchIcon size={16} className="form-label-icon" />
                Αναζήτηση με Microchip <span className="form-label-optional">(προαιρετικό)</span>
              </label>
              <div className="microchip-search-input-wrapper">
                <input
                  type="text"
                  value={microchipInput}
                  onChange={handleMicrochipInputChange}
                  placeholder="π.χ. GR123456789012345"
                  className="form-input microchip-search-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleMicrochipSearch();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleMicrochipSearch}
                  className="microchip-search-btn"
                  disabled={!microchipInput.trim()}
                >
                  <SearchIcon size={18} />
                  Αναζήτηση
                </button>
              </div>
              <p className="microchip-search-hint">
                Εάν το κατοικίδιο έχει microchip, εισάγετε τον αριθμό για αυτόματη συμπλήρωση των στοιχείων
              </p>
            </div>
          )}

          {/* Owner Pet Selection */}
          {isOwner && !hasPrefilledData && (
            <div className="owner-pet-selection">
              <label className="form-label">
                Επιλέξτε κατοικίδιο
              </label>
              <CustomSelect
                value={selectedOwnPet}
                onChange={handleOwnPetSelect}
                placeholder="Επιλέξτε ένα από τα κατοικίδιά σας"
                options={userPets}
                variant={variant}
              />
            </div>
          )}

          {/* Prefilled Pet Info Card */}
          {hasPrefilledData && (
            <div className="lost-pet-info-card">
              <button
                type="button"
                className="pet-card-remove"
                onClick={handleClearPrefilledData}
                title="Αφαίρεση επιλεγμένου κατοικιδίου"
              >
                ×
              </button>
              <div className="pet-card-container">
                <div className="pet-card-image">🐕</div>
                <div className="pet-card-details">
                  <h3 className="pet-card-title">
                    {prefilledPetData.petName ? 'Στοιχεία Χαμένου Κατοικιδίου' : 'Αριθμός Microchip'}
                  </h3>
                  <div className="pet-card-info">
                    {prefilledPetData.petName ? (
                      <>
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
                      </>
                    ) : (
                      <div className="pet-card-section">
                        <div className="pet-card-row">
                          <span className="pet-card-label">Microchip</span>
                          <span className="pet-card-value">{prefilledPetData.microchip}</span>
                        </div>
                        <p className="pet-card-note">
                          Δεν βρέθηκε καταχωρημένο κατοικίδιο με αυτόν τον αριθμό. Παρακαλώ συμπληρώστε τα στοιχεία του κατοικιδίου παρακάτω.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        
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
              onChange={handleInputChange}
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
                    <Upload size={32} color={variant === 'vet' ? '#FCA47C' : '#23CED9'} />
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
                {isOwner ? (
              <>
                <button 
                  type="button" 
                  className="submit-btn submit-btn--cancel"
                  onClick={() => { if (inline && onClose) onClose(); else navigate('/'); }}
                >
                  Ακύρωση
                </button>

                <button 
                  type="button" 
                  className="submit-btn submit-btn--draft"
                >
                  Πρόχειρο
                </button>

                <button 
                  type="submit" 
                  className="submit-btn submit-btn--primary"
                  disabled={!isFormValid()}
                >
                  Οριστική Υποβολή
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className="submit-btn submit-btn--cancel"
                  onClick={() => { if (inline && onClose) onClose(); else navigate('/'); }}
                >
                  Ακύρωση
                </button>

                <button 
                  type="submit" 
                  className={`submit-btn submit-btn--wide ${variant === 'vet' ? 'submit-btn--orange' : variant === 'citizen' ? 'submit-btn--primary' : 'submit-btn--yellow'}`}
                  disabled={!isFormValid()}
                >
                  Υποβολή Δήλωσης Εύρεσης
                </button>
              </>
            )}
          </div>
        </form>
      </div>
  );

  // When `inline` is true, render the form embedded in the page (no modal, no PageLayout)
  if (inline) {
    return formContent;
  }

  return (
    <PageLayout title="Δήλωση Εύρεσης" variant={variant} breadcrumbs={breadcrumbItems}>
      {formContent}
    </PageLayout>
  );
};

export default FoundPetForm;
