import React, { useState } from 'react';
import { Search, Download, Dog, Cat, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import MedicalEventCard from '../../components/owner/healthcard/MedicalEventCard';
import StatCard from '../../components/owner/healthcard/StatCard';
import { ROUTES } from '../../utils/constants';
import './HealthBook.css';

const HealthBook = () => {
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [petData, setPetData] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from API/database
  const mockPetsDatabase = {
    '123456789012345': {
      name: 'Μπάμπης',
      type: 'Σκύλος',
      breed: 'Golden Retriever',
      gender: 'Αρσενικό',
      birthDate: '15/4/2020',
      microchip: '123456789012345',
      afm: '123456789',
      ownerName: 'Γιώργος Παπαδόπουλος',
      ownerPhone: '6912345678',
      icon: 'dog',
      medicalHistory: [
        {
          id: 1,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Πενταπλός εμβολιασμός',
          date: '10/11/2024',
          vet: 'Δρ. Μαρία Γεωργίου',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 2,
          type: 'surgery',
          title: 'Χειρουργείο',
          description: 'Στείρωση',
          date: '5/6/2024',
          vet: 'Δρ. Μαρία Γεωργίου',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 3,
          type: 'examination',
          title: 'Εξέταση',
          description: 'Γενική εξέταση',
          date: '20/7/2024',
          vet: 'Δρ. Μαρία Γεωργίου',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 4,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Εμβόλιο λύσσας',
          date: '12/5/2024',
          vet: 'Δρ. Ελένη Νικολάου',
          status: 'Ολοκληρώθηκε',
        },
      ],
      stats: {
        vaccinations: 2,
        surgeries: 1,
        examinations: 1,
      },
    },
    '987654321098765': {
      name: 'Μίνι',
      type: 'Γάτα',
      breed: 'Περσική',
      gender: 'Θηλυκό',
      birthDate: '22/6/2021',
      microchip: '987654321098765',
      afm: '123456788',
      ownerName: 'Άννα Παπαδάκη',
      ownerPhone: '6987654321',
      icon: 'cat',
      medicalHistory: [
        {
          id: 1,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Τριπλός εμβολιασμός',
          date: '10/10/2024',
          vet: 'Δρ. Άννα Παπαδάκη',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 2,
          type: 'examination',
          title: 'Εξέταση',
          description: 'Οδοντιατρικός έλεγχος',
          date: '3/9/2024',
          vet: 'Δρ. Νίκος Ιωάννου',
          status: 'Ολοκληρώθηκε',
        },
      ],
      stats: {
        vaccinations: 1,
        surgeries: 0,
        examinations: 1,
      },
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchAttempted(true);

    // Simulate API call
    setTimeout(() => {
      const foundPet = mockPetsDatabase[microchipNumber];
      setPetData(foundPet || null);
      setIsLoading(false);
    }, 500);
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
                onChange={(e) => setMicrochipNumber(e.target.value)}
                maxLength={15}
                required
              />
            </div>
            <button 
              type="submit" 
              className="health-book__search-btn"
              disabled={isLoading || !microchipNumber.trim()}
            >
              {isLoading ? 'Αναζήτηση...' : 'Αναζήτηση'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {searchAttempted && !isLoading && (
          <>
            {petData ? (
              <div className="health-book__results">
                <div className="health-book__content">
                  <div className="health-book__sidebar">
                    <div className="health-book__pet-card">
                      <div className="health-book__pet-icon">{getPetIcon(petData.icon)}</div>
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
                    <h2 className="health-book__section-title">Ιατρικό Ιστορικό</h2>

                    <div className="health-book__events">
                      {petData.medicalHistory.map((event) => (
                        <MedicalEventCard key={event.id} event={event} />
                      ))}
                    </div>

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
