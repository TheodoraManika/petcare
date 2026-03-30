import React, { useState } from 'react';
import { Search, Download, Dog, Cat, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import MedicalEventCard from '../../components/owner/healthcard/MedicalEventCard';
import StatCard from '../../components/owner/healthcard/StatCard';
import { ROUTES } from '../../utils/constants';
import './HealthBook.css';

const HealthBook = () => {
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [petData, setPetData] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper function to get operation type in Greek
  const getOperationTypeLabel = (operationType) => {
    const typeMap = {
      'vaccination': 'Εμβολιασμός',
      'surgery': 'Χειρουργείο',
      'examination': 'Εξέταση',
      'checkup': 'Τακτική Εξέταση',
      'dental': 'Οδοντιατρική Εξέταση',
      'grooming': 'Περιποίηση',
      'emergency': 'Έκτακτη Περίπτωση'
    };
    return typeMap[operationType] || operationType;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate microchip length
    if (!microchipNumber.trim()) {
      setError('Παρακαλώ εισάγετε έναν αριθμό μικροτσίπ');
      return;
    }
    
    if (microchipNumber.length !== 15) {
      setError('Ο αριθμός μικροτσίπ πρέπει να έχει ακριβώς 15 ψηφία');
      return;
    }
    
    setIsLoading(true);
    setSearchAttempted(false); // Reset to hide old results
    setError('');
    setPetData(null); // Clear previous pet data

    try {
      // First, try to fetch pet data by microchipId from pets table
      let petResponse = await fetch(`http://localhost:5000/pets?microchipId=${microchipNumber}`);
      if (!petResponse.ok) throw new Error('Failed to fetch pet');
      
      let pets = await petResponse.json();
      let pet = pets[0];
      
      // If not found, search again by microchipId (in case it's a lost pet)
      if (!pet) {
        const petAlertsResponse = await fetch(`http://localhost:5000/pets?microchipId=${microchipNumber}`);
        if (petAlertsResponse.ok) {
          const petAlerts = await petAlertsResponse.json();
          if (petAlerts.length > 0) {
            pet = petAlerts[0];
          }
        }
      }
      
      setIsLoading(false); // Stop loading first
      
      if (!pet) {
        setSearchAttempted(true); // Now show "not found"
        return;
      }

      // Fetch owner data
      let owner = null;
      if (pet.ownerId) {
        const ownerResponse = await fetch(`http://localhost:5000/users/${pet.ownerId}`);
        if (ownerResponse.ok) {
          owner = await ownerResponse.json();
        }
      }

      // Fetch all users to get vet names
      let allUsers = [];
      const usersResponse = await fetch(`http://localhost:5000/users`);
      if (usersResponse.ok) {
        allUsers = await usersResponse.json();
      }

      // Fetch medical procedures for this pet
      const proceduresResponse = await fetch(`http://localhost:5000/medicalProcedures?petId=${pet.id}`);
      let procedures = [];
      if (proceduresResponse.ok) {
        procedures = await proceduresResponse.json();
      }

      // Transform procedures to medical history format and map types
      const typeMap = {
        'Εμβολιασμός': 'vaccination',
        'vaccination': 'vaccination',
        'Χειρουργείο': 'surgery',
        'surgery': 'surgery',
        'Τακτική Εξέταση': 'examination',
        'Γενική Εξέταση': 'examination',
        'checkup': 'examination',
        'examination': 'examination',
        'Οδοντιατρική Εξέταση': 'examination',
        'Οδοντιατρική': 'examination',
        'dental': 'examination',
        'Θεραπεία': 'examination',
        'treatment': 'examination',
        'Επείγον Περιστατικό': 'examination',
        'emergency': 'examination',
        'Άλλο': 'examination',
        'other': 'examination'
      };

      const medicalHistory = procedures.map((proc) => {
        const vet = allUsers.find(u => u.id === proc.vetId || u.id == proc.vetId);
        const vetName = vet ? `${vet.name} ${vet.lastName || ''}`.trim() : 'Άγνωστος';
        const mappedType = typeMap[proc.type] || 'other';
        return {
          id: proc.id,
          type: proc.type || 'examination',
          mappedType: mappedType,
          title: getOperationTypeLabel(proc.type),
          description: proc.description || '-',
          date: formatDateForDisplay(proc.date),
          vet: vetName,
          status: 'Ολοκληρώθηκε'
        };
      });

      // Calculate statistics using mapped types
      const stats = {
        vaccinations: medicalHistory.filter(p => p.mappedType === 'vaccination').length,
        surgeries: medicalHistory.filter(p => p.mappedType === 'surgery').length,
        examinations: medicalHistory.filter(p => p.mappedType !== 'vaccination' && p.mappedType !== 'surgery').length
      };

      // Get pet type icon
      const petSpecies = pet.type || 'dog';
      const icon = petSpecies.toLowerCase().includes('cat') ? 'cat' : 'dog';

      // Build pet data object
      const transformedPetData = {
        name: pet.name,
        type: petSpecies === 'cat' ? 'Γάτα' : 'Σκύλος',
        breed: pet.breed,
        gender: pet.gender === 'male' ? 'Αρσενικό' : 'Θηλυκό',
        birthDate: formatDateForDisplay(pet.birthDate),
        microchip: pet.microchipId,
        afm: owner?.afm || pet.ownerAFM || '-',
        ownerName: owner ? `${owner.name} ${owner.lastName || ''}`.trim() : 'Άγνωστος',
        ownerPhone: owner?.phone || '-',
        icon: icon,
        image: pet.image || null, // Include pet image
        medicalHistory: medicalHistory,
        stats: stats
      };

      setPetData(transformedPetData);
      setSearchAttempted(true);

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.querySelector('.health-book__results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Error searching for pet:', err);
      setError('Σφάλμα κατά την αναζήτηση. Παρακαλώ δοκιμάστε ξανά.');
      setPetData(null);
      setIsLoading(false);
      setSearchAttempted(true);
    }
  };

  // Helper function to format dates
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '-';
    // Handle YYYY-MM-DD format
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    // Already in DD/MM/YYYY format
    return dateStr;
  };

  const handlePrint = () => {
    window.print();
  };

  const getPetIcon = (iconType) => {
    switch (iconType) {
      case 'dog':
        return <Dog size={40} />;
      case 'cat':
        return <Cat size={40} />;
      default:
        return <Dog size={40} />;
    }
  };

  const breadcrumbItems = [];

  return (
    <PageLayout variant="vet" title="Βιβλιάριο Υγείας" breadcrumbs={breadcrumbItems}>
      <div className="health-book">
        {/* Search Section */}
        <div className="health-book__search-section">
          <h2 className="health-book__search-title">Αναζήτηση Κατοικιδίου</h2>
          <p className="health-book__search-subtitle">
            Εισάγετε τον αριθμό μικροτσίπ για να δείτε το βιβλιάριο υγείας του κατοικιδίου
          </p>

          <form className="health-book__search-form" onSubmit={handleSearch}>
            <div className="health-book__search-input-wrapper">
              <Search className="health-book__search-icon" size={20} />
              <input
                type="text"
                className="health-book__search-input"
                placeholder="π.χ. 123456789012345"
                value={microchipNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 15) {
                    setMicrochipNumber(value);
                  }
                }}
                maxLength={15}
                required
              />
            </div>
            <button 
              type="submit" 
              className="health-book__search-btn"
              disabled={isLoading || !microchipNumber.trim() || microchipNumber.length !== 15}
            >
              {isLoading ? 'Αναζήτηση...' : 'Αναζήτηση'}
            </button>
          </form>

          {error && (
            <div className="health-book__error" style={{ 
              marginTop: '12px', 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c00', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {isLoading && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
            <p>Αναζήτηση κατοικιδίου...</p>
          </div>
        )}

        {!isLoading && searchAttempted && (
          <>
            {petData ? (
              <div className="health-book__results">
                <div className="health-book__content">
                  <div className="health-book__sidebar">
                    <div className="health-book__pet-card">
                      <div className="health-book__pet-icon">
                        {petData.image ? (
                          <img 
                            src={petData.image} 
                            alt={petData.name}
                            className="health-book__pet-image"
                          />
                        ) : (
                          getPetIcon(petData.icon)
                        )}
                      </div>
                      <h2 className="health-book__pet-name">{petData.name}</h2>
                      
                      <div className="health-book__pet-info">
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Είδος</span>
                          <span className="health-book__info-value">{petData.type}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Ράτσα</span>
                          <span className="health-book__info-value">{petData.breed}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Φύλο</span>
                          <span className="health-book__info-value">{petData.gender}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Ημερομηνία Γέννησης</span>
                          <span className="health-book__info-value">{petData.birthDate}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Αριθμός Μικροτσίπ</span>
                          <span className="health-book__info-value">{petData.microchip}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Ιδιοκτήτης</span>
                          <span className="health-book__info-value">{petData.ownerName}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">Τηλέφωνο</span>
                          <span className="health-book__info-value">{petData.ownerPhone}</span>
                        </div>
                        <div className="health-book__info-row">
                          <span className="health-book__info-label">ΑΦΜ Ιδιοκτήτη</span>
                          <span className="health-book__info-value">{petData.afm}</span>
                        </div>
                      </div>

                      <button className="health-book__download-btn" onClick={handlePrint}>
                        <Download size={18} />
                        Εκτύπωση Βιβλιαρίου
                      </button>
                    </div>
                  </div>

                  <div className="health-book__main">
                    {petData.medicalHistory.length > 0 && (
                      <>
                        <h2 className="health-book__section-title">Ιατρικό Ιστορικό</h2>

                        <div className="health-book__events">
                          {petData.medicalHistory.map((event) => (
                            <MedicalEventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </>
                    )}

                    {petData.medicalHistory.length === 0 && (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        <p>Δεν υπάρχει ιατρικό ιστορικό για αυτό το κατοικίδιο.</p>
                      </div>
                    )}

                    <h2 className="health-book__section-title">Στατιστικά</h2>
                    <div className="health-book__stats">
                      <StatCard type="vaccination" label="Εμβολιασμοί" value={petData.stats.vaccinations} />
                      <StatCard type="surgery" label="Χειρουργεία" value={petData.stats.surgeries} />
                      <StatCard type="examination" label="Εξετάσεις" value={petData.stats.examinations} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="health-book__not-found">
                <AlertCircle size={48} className="health-book__not-found-icon" />
                <h3 className="health-book__not-found-title">Δεν βρέθηκε κατοικίδιο</h3>
                <p className="health-book__not-found-text">
                  Δεν βρέθηκε κατοικίδιο με αυτόν τον αριθμό μικροτσίπ.
                </p>
                <p className="health-book__not-found-hint">
                  Παρακαλώ ελέγξτε τον αριθμό και δοκιμάστε ξανά.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default HealthBook;
