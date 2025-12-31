import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import './VetSearchMap.css';

const VetSearchMap = ({ variant }) => {
  // Auto-detect variant if not provided
  const detectedVariant = variant || (() => {
    const path = window.location.pathname;
    if (path.startsWith('/owner')) return 'owner';
    if (path.startsWith('/vet')) return 'vet';
    return 'citizen';
  })();
  
  const [filters, setFilters] = useState({
    area: '',
    specialty: '',
    availability: '',
    time: '',
    rating: '',
  });

  const [showMap, setShowMap] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock vets data with coordinates
  const vets = [
    { id: 1, name: 'Dr. Παπαδόπουλος', specialty: 'Γενικός Κτηνίατρος', area: 'Αθήνα', lat: 37.9838, lng: 23.7275, rating: 4.8 },
    { id: 2, name: 'Dr. Αλεξόπουλος', specialty: 'Χειρουργική Κτηνιατρική', area: 'Αθήνα', lat: 37.9700, lng: 23.7300, rating: 4.5 },
    { id: 3, name: 'Dr. Νικολάου', specialty: 'Οδοντιατρική Κτηνιατρική', area: 'Αθήνα', lat: 37.9750, lng: 23.7400, rating: 4.9 },
    { id: 4, name: 'Dr. Μαργαρίτης', specialty: 'Ορθοπεδική Κτηνιατρική', area: 'Αθήνα', lat: 37.9600, lng: 23.7200, rating: 4.6 },
    { id: 5, name: 'Dr. Κωνσταντίνου', specialty: 'Εσωτερική Παθολογία', area: 'Αθήνα', lat: 37.9900, lng: 23.7350, rating: 4.7 },
    { id: 6, name: 'Dr. Διαμαντίδης', specialty: 'Γενικός Κτηνίατρος', area: 'Αθήνα', lat: 37.9850, lng: 23.7250, rating: 4.4 },
    { id: 7, name: 'Dr. Σταματόπουλος', specialty: 'Χειρουργική Κτηνιατρική', area: 'Αθήνα', lat: 37.9720, lng: 23.7350, rating: 4.8 },
    { id: 8, name: 'Dr. Γιανναράκης', specialty: 'Οδοντιατρική Κτηνιατρική', area: 'Αθήνα', lat: 37.9800, lng: 23.7400, rating: 4.7 },
    { id: 9, name: 'Dr. Παvταζοπούλου', specialty: 'Ορθοπεδική Κτηνιατρική', area: 'Αθήνα', lat: 37.9650, lng: 23.7200, rating: 4.5 },
    { id: 10, name: 'Dr. Λυμπεράκης', specialty: 'Εσωτερική Παθολογία', area: 'Αθήνα', lat: 37.9900, lng: 23.7300, rating: 4.9 },
    { id: 11, name: 'Dr. Βασιλειάδης', specialty: 'Γενικός Κτηνίατρος', area: 'Αθήνα', lat: 37.9780, lng: 23.7280, rating: 4.6 },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = () => {
    setFilters({
      area: '',
      specialty: '',
      availability: '',
      time: '',
      rating: '',
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(vets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVets = vets.slice(startIndex, endIndex);

  return (
    <PageLayout title="Αναζήτηση Κτηνιάτρων" variant={detectedVariant}>
      <div className="vet-search-map-page">
        {/* Sidebar Filters */}
        <aside className="search-sidebar">
          <div className="filter-header">
            <h3 className="filter-title">Φίλτρο Αναζήτησης</h3>
          </div>

          <div className="filters-container">
            {/* Area Filter */}
            <div className="filter-group">
              <label className="filter-label">Περιοχή</label>
              <select 
                name="area" 
                value={filters.area} 
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">π.χ. Αθήνα, Καλαμαριά...</option>
                <option value="athens">Αθήνα</option>
                <option value="thessaloniki">Θεσσαλονίκη</option>
                <option value="patras">Πάτρα</option>
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="filter-group">
              <label className="filter-label">Ειδικότητα</label>
              <select 
                name="specialty" 
                value={filters.specialty} 
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Επιλέξτε ειδικότητα...</option>
                <option value="general">Γενικός Κτηνίατρος</option>
                <option value="surgery">Χειρουργική</option>
                <option value="dentistry">Οδοντιατρική</option>
                <option value="orthopedics">Ορθοπεδική</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <label className="filter-label">Ημερα Διαθεσιμοτητας</label>
              <select 
                name="availability" 
                value={filters.availability} 
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Επιλέξτε ημέρα...</option>
                <option value="today">Σήμερα</option>
                <option value="tomorrow">Αύριο</option>
                <option value="week">Αυτή την εβδομάδα</option>
              </select>
            </div>

            {/* Time Filter */}
            <div className="filter-group">
              <label className="filter-label">Ύρα</label>
              <select 
                name="time" 
                value={filters.time} 
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Επιλέξτε ώρα...</option>
                <option value="morning">Πρωί (08:00-12:00)</option>
                <option value="afternoon">Απόγευμα (12:00-18:00)</option>
                <option value="evening">Βράδυ (18:00-21:00)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <label className="filter-label">Ελαχιστη Αβολυμιμη</label>
              <select 
                name="rating" 
                value={filters.rating} 
                onChange={handleFilterChange}
                className="filter-input"
              >
                <option value="">Επιλέξτε αξιολόγηση...</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.8">4.8+ ⭐</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="search-button-sidebar">
              <Search size={18} />
              Αναζήτηση
            </button>

            {/* Clear Button */}
            <button className="clear-button-sidebar" onClick={handleClear}>
              Καθαρισμός Δήλιων
            </button>

            {/* Rating & Info */}
            <div className="sidebar-info">
              <p className="info-text">Βρήθηκαν 5 κτηνίατροι</p>
            </div>
          </div>
        </aside>

        {/* Main Map Area */}
        <main className="map-container">
          <div className="map-header">
            <h2 className="map-title">Αποτελέσματα (5)</h2>
            <div className="view-toggles">
              <button className={`toggle-btn ${showMap ? 'active' : ''}`} onClick={() => setShowMap(true)}>
                <MapPin size={18} />
                Χάρτης
              </button>
              <button className={`toggle-btn ${!showMap ? 'active' : ''}`} onClick={() => setShowMap(false)}>
                Λίστα
              </button>
            </div>
          </div>

          {showMap ? (
            <div className="map-wrapper">
              <iframe
                className="map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841071150157!2d23.727551!3d37.9838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135964427e9b3b55%3A0x9c1e98e1e0b5e5e0!2sAthens%2C%20Greece!5e0!3m2!1sen!2s!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              {/* Vet Markers Info */}
              <div className="vet-markers-overlay">
                {vets.map((vet) => (
                  <div key={vet.id} className="vet-marker-info">
                    <div className="marker-pin">📍</div>
                    <div className="marker-content">
                      <h4 className="marker-name">{vet.name}</h4>
                      <p className="marker-specialty">{vet.specialty}</p>
                      <p className="marker-rating">⭐ {vet.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="list-view-container">
              <div className="list-view">
                {currentVets.map((vet) => (
                  <div key={vet.id} className="vet-list-item">
                    <div className="vet-avatar">
                      <span className="avatar-initials">Dr</span>
                    </div>
                    <div className="vet-details">
                      <h3 className="vet-name">Δρ. {vet.name.split(' ')[1]}</h3>
                      <p className="vet-specialty">{vet.specialty}</p>
                      <div className="vet-rating-info">
                        <span className="rating-stars">⭐ {vet.rating} (23 ratings)</span>
                      </div>
                      <p className="vet-address">Δουλιανής Ταβέρνες, 2008-1618</p>
                    </div>
                    <button className="vet-profile-btn">Προφίλ Ιατρού</button>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-nav-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt; Προηγούμενη
                  </button>
                  
                  <div className="page-info">
                    {currentPage} σελίδα {currentPage} σε {totalPages}
                  </div>
                  
                  <button 
                    className="page-nav-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Επόμενη &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </PageLayout>
  );
};

export default VetSearchMap;
