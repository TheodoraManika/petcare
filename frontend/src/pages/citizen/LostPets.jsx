import React, { useState } from 'react';
import { Search, MapPin, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/global/ui/CustomSelect';
import './LostPets.css';

const LostPets = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    animal: '',
    area: '',
    dateFrom: '',
    color: '',
    months: '',
    breed: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with actual data from API
  const lostPets = [
    {
      id: 1,
      name: 'Μιχαλάκης',
      type: 'Σκύλος',
      breed: 'Golden Retriever',
      area: 'Κήπος Αθηνών, Παλαιά Συντακτική',
      color: 'Χρυσαφί',
      dateReported: '05/11/2025',
      image: null,
    },
    {
      id: 2,
      name: 'Φίλι',
      type: 'Γάτα',
      breed: 'Μια - Γάτα Ταρίχι',
      area: 'Θεσσαλονίκη, Καλαμαριά',
      color: 'Λευκό',
      dateReported: '05/11/2025',
      image: null,
    },
    {
      id: 3,
      name: 'Πάλι',
      type: 'Σκύλος',
      breed: 'Σκύλος - Λαμπραδόριος',
      area: 'Πατρα, Κότορι',
      color: 'Μαύρο',
      dateReported: '05/11/2025',
      image: null,
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(lostPets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPets = lostPets.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  return (
    <PageLayout title="Χαμένα Κατοικίδια">
      <div className="lost-pets-page">
        <div className="lost-pets-main">

        {/* Page Title */}
        <div className="page-header">
          <h1 className="page-title">Χαμένα Κατοικίδια</h1>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Φίλτρα Αναζήτησης</label>
            <div className="filter-content">
              <div className="search-bar-row">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Αναζήτηση ονόματος..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="search-input"
                  />
                </div>
                <button className="search-button" onClick={handleSearch}>
                  <Search size={16} />
                  Αναζήτηση
                </button>
              </div>

              <div className="filters-row-1">
                <div className="filter-item">
                  <label>Ζωο</label>
                  <CustomSelect
                    value={filters.animal}
                    onChange={(value) => setFilters({...filters, animal: value})}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: 'dog', label: 'Σκύλος' },
                      { value: 'cat', label: 'Γάτα' },
                      { value: 'other', label: 'Άλλο' },
                    ]}
                  />
                </div>

                <div className="filter-item">
                  <label>Περιοχή</label>
                  <CustomSelect
                    value={filters.area}
                    onChange={(value) => setFilters({...filters, area: value})}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: 'athens', label: 'Αθήνα' },
                      { value: 'thessaloniki', label: 'Θεσσαλονίκη' },
                      { value: 'patras', label: 'Πάτρα' },
                    ]}
                  />
                </div>

                <div className="filter-item">
                  <label>Από Ημερομηνία</label>
                  <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                </div>
              </div>

              <div className="filters-row-2">
                <div className="filter-item">
                  <label>Χρώμα</label>
                  <CustomSelect
                    value={filters.color}
                    onChange={(value) => setFilters({...filters, color: value})}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: 'white', label: 'Λευκό' },
                      { value: 'black', label: 'Μαύρο' },
                      { value: 'brown', label: 'Καφέ' },
                      { value: 'golden', label: 'Χρυσαφί' },
                    ]}
                  />
                </div>

                <div className="filter-item">
                  <label>Μήνες</label>
                  <CustomSelect
                    value={filters.months}
                    onChange={(value) => setFilters({...filters, months: value})}
                    placeholder="Επιλέξτε..."
                    options={[
                      { value: '1', label: '1 μήνα' },
                      { value: '3', label: '3 μήνες' },
                      { value: '6', label: '6 μήνες' },
                    ]}
                  />
                </div>

                <button className="clear-button" onClick={() => {
                  setFilters({
                    search: '',
                    animal: '',
                    area: '',
                    dateFrom: '',
                    color: '',
                    months: '',
                    breed: '',
                  });
                }}>
                  Καθαρισμός
                </button>
              </div>
            </div>

            <div className="results-info">
              <span>Αποτελέσματα ({lostPets.length})</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="results-section">
          <div className="pets-grid">
            {displayedPets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-image">
                  {pet.image ? (
                    <img src={pet.image} alt={pet.name} />
                  ) : (
                    <div className="pet-image-placeholder">
                      <Camera size={48} />
                    </div>
                  )}
                </div>
                <div className="pet-info">
                  <h3 className="pet-name">{pet.name}</h3>
                  <p className="pet-type">{pet.type} - {pet.breed}</p>
                  <div className="pet-details">
                    <MapPin size={16} className="detail-icon" />
                    <span className="detail-text">{pet.area}</span>
                  </div>
                  <div className="pet-date">
                    <span className="date-label">Κάτηγορία:</span>
                    <span className="date-value">{pet.dateReported}</span>
                  </div>
                </div>
                <button 
                  className="pet-profile-button"
                  onClick={() => navigate(`/citizen/lost-pets/${pet.id}`)}
                >
                  Προφίλ Αγαπημένου
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Σελίδα 1 από 5</span>
          <button className="pagination-button">Επόμενη &gt;</button>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LostPets;
