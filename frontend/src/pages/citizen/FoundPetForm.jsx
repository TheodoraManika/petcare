import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Check } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import './FoundPetForm.css';

const FoundPetForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identificationMark: '',
    species: '',
    breed: '',
    appearance: '',
    image: null,
    features: [],
    address: '',
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
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
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

  const features = [
    'Χρώμα πορτοκαλί',
    'Λευκά σημάδια',
    'Κοντά μαλλιά',
    'Πολυμελής',
    'Μεγάλο μέγεθος'
  ];

  const speciesOptions = [
    'Σκύλος',
    'Γάτα',
    'Ποντίκι',
    'Λαγός',
    'Άλλο'
  ];

  return (
    <PageLayout title="Δήλωση Εύρεσης Κατοικιδίου">
      <div className="found-pet-form">
        <div className="form-header">
          <h1 className="form-title">Δήλωση Εύρεσης Κατοικιδίου</h1>
          <p className="form-subtitle">
            Συμπληρώστε τα παρακάτω στοιχεία για το κατοικίδιο που βρήκατε
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          {/* Section 1: Identification Mark */}
          <div className="form-section">
            <h2 className="section-title">Σημα Ταυτοποιησης</h2>
            <p className="section-description">
              Περιγράψτε τυχόν σημάδια ταυτοποίησης (π.χ. μικροτσίπ αριθμό, ετικέτα κ.λπ.)
            </p>
            <div className="form-group">
              <label className="form-label">Σημα Ταυτοποιησης (και εμα αριθμο)</label>
              <input
                type="text"
                name="identificationMark"
                placeholder="π.χ. Αιδηρο"
                value={formData.identificationMark}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 2: Species and Breed */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Είδος</label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Επιλέξτε ένα είδος...</option>
                  {speciesOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Φυλη</label>
                <input
                  type="text"
                  name="breed"
                  placeholder="π.χ. Γερμανικό Ποιμενικό"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Appearance */}
          <div className="form-section">
            <h2 className="section-title">Τροφιμη Εμφανιση</h2>
            <p className="section-description">
              Περιγράψτε την εμφάνιση του κατοικιδίου
            </p>
            <div className="form-group">
              <label className="form-label">Περιγραφη</label>
              <textarea
                name="appearance"
                placeholder="Περιγράψτε λεπτομερώς την εμφάνιση του κατοικιδίου..."
                value={formData.appearance}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="form-section">
            <h2 className="section-title">Φωτογραφια (Προαιρετικο)</h2>
            <div className="image-upload-area">
              {!imagePreview ? (
                <label className="image-upload-label">
                  <div className="upload-icon">
                    <Upload size={32} color="#23CED9" />
                  </div>
                  <p className="upload-text">Κάντε κλικ για να ανεβάσετε φωτογραφία</p>
                  <input
                    type="file"
                    name="image"
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
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="change-image-btn"
                  >
                    Αλλαξε Εικονα
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Distinctive Features */}
          <div className="form-section">
            <h2 className="section-title">Τροφιμε Υπηχει</h2>
            <p className="section-description">
              Επιλέξτε τα ξεχωριστά χαρακτηριστικά
            </p>
            <div className="features-grid">
              {features.map(feature => (
                <label key={feature} className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <span className="checkbox-label">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 6: Location and Contact */}
          <div className="form-section">
            <h2 className="section-title">Διευθυνση Ευρεσης</h2>
            <p className="section-description">
              Πού βρήκατε το κατοικίδιο;
            </p>
            <div className="form-group">
              <label className="form-label">Διευθυνση</label>
              <input
                type="text"
                name="address"
                placeholder="Π.χ. Οδός Αριστοτέλους 45, Αθήνα"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 7: Contact Information */}
          <div className="form-section">
            <h2 className="section-title">Στοιχεια Επικοινωνιας</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Τηλεφωνο</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="69xxxxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <p className="form-note">
              Τα στοιχεία θα χρησιμοποιηθούν μόνο για επικοινωνία με ιδιοκτήτες χαμένων κατοικιδίων
            </p>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Υποβολη Δηλωσης Ευρεσης
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default FoundPetForm;
