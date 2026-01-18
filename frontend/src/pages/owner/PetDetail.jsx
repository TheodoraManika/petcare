import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Dog, Cat } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import MedicalEventCard from '../../components/owner/healthcard/MedicalEventCard';
import StatCard from '../../components/owner/healthcard/StatCard';
import { ROUTES } from '../../utils/constants';
import './PetDetail.css';

const PetDetail = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch pet data
        const petResponse = await fetch(`http://localhost:5000/pets/${petId}`);
        if (!petResponse.ok) {
          throw new Error('Το κατοικίδιο δεν βρέθηκε');
        }
        
        const pet = await petResponse.json();
        
        console.log('Pet data from API:', pet);
        console.log('ownerAFM value:', pet.ownerAFM);
        
        // Fetch owner data to get AFM
        const ownerResponse = await fetch(`http://localhost:5000/users/${pet.ownerId}`);
        const owner = await ownerResponse.json();
        
        // Function to translate gender to Greek
        const translateGender = (gender) => {
          const genderMap = {
            'male': 'Αρσενικό',
            'female': 'Θηλυκό',
            'Αρσενικό': 'Αρσενικό',
            'Θηλυκό': 'Θηλυκό'
          };
          return genderMap[gender] || gender;
        };
        
        // Function to translate pet type to Greek
        const translatePetType = (type) => {
          const typeMap = {
            'dog': 'Σκύλος',
            'cat': 'Γάτα',
            'Σκύλος': 'Σκύλος',
            'Γάτα': 'Γάτα'
          };
          return typeMap[type] || type;
        };
        
        // Fetch medical procedures for this pet
        const medicalResponse = await fetch('http://localhost:5000/medicalProcedures');
        const allProcedures = await medicalResponse.json();
        const petProcedures = allProcedures.filter(proc => String(proc.petId) === String(petId));
        
        // Fetch vets for medical history
        const vetsResponse = await fetch('http://localhost:5000/users');
        const allVets = await vetsResponse.json();
        
        // Transform medical procedures for display
        const transformedHistory = petProcedures.map(proc => {
          const vet = allVets.find(v => String(v.id) === String(proc.vetId));
          
          // Map Greek procedure types to internal type keys for icons and statistics
          const typeMap = {
            'Εμβολιασμός': 'vaccination',
            'vaccination': 'vaccination',
            'Τακτική Εξέταση': 'examination',
            'Γενική Εξέταση': 'examination',
            'checkup': 'examination',
            'Χειρουργείο': 'surgery',
            'surgery': 'surgery',
            'Θεραπεία': 'examination',
            'treatment': 'examination',
            'Οδοντιατρική Εξέταση': 'examination',
            'Οδοντιατρική': 'examination',
            'dental': 'examination',
            'Έκτακτη Περίπτωση': 'emergency',
            'Επείγον Περιστατικό': 'emergency',
            'emergency': 'emergency',
            'Συμβουλή': 'consultation',
            'Περιποίηση': 'grooming',
            'Άλλο': 'examination',
            'other': 'examination'
          };
          
          return {
            id: proc.id,
            type: typeMap[proc.type] || 'other',
            title: proc.type,
            description: proc.description || '-',
            date: proc.date,
            vet: vet ? `Δρ. ${vet.name} ${vet.lastName}` : 'Άγνωστος κτηνίατρος',
            status: 'Ολοκληρώθηκε'
          };
        });
        
        // Calculate statistics
        const stats = {
          vaccinations: transformedHistory.filter(h => h.type === 'vaccination').length,
          surgeries: transformedHistory.filter(h => h.type === 'surgery').length,
          examinations: transformedHistory.filter(h => h.type !== 'vaccination' && h.type !== 'surgery').length,
        };
        
        // Format pet data
        const formattedPet = {
          name: pet.name || 'Άγνωστο',
          type: translatePetType(pet.type) || 'Άγνωστο',
          breed: pet.breed || '-',
          gender: translateGender(pet.gender) || '-',
          birthDate: pet.birthDate || '-',
          microchip: pet.microchipId || '-',
          color: pet.color || '-',
          weight: pet.weight || '-',
          afm: owner?.afm || '-',
          icon: pet.type === 'Σκύλος' ? 'dog' : pet.type === 'Γάτα' ? 'cat' : 'pet',
          stats: stats
        };
        
        setPetData(formattedPet);
        setMedicalHistory(transformedHistory);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (petId) {
      fetchPetDetails();
    }
  }, [petId]);

  const breadcrumbItems = [
    { label: 'Τα Κατοικίδιά μου', path: ROUTES.owner.pets }
  ];

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

  if (loading) {
    return (
      <PageLayout variant="owner" title="Φόρτωση..." breadcrumbs={breadcrumbItems}>
        <div className="owner-pet-detail">
          <p>Φόρτωση στοιχείων κατοικιδίου...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !petData) {
    return (
      <PageLayout variant="owner" title="Σφάλμα" breadcrumbs={breadcrumbItems}>
        <div className="owner-pet-detail">
          <p style={{ color: '#d32f2f' }}>Σφάλμα: {error || 'Το κατοικίδιο δεν βρέθηκε'}</p>
          <button 
            onClick={() => navigate(ROUTES.owner.pets)}
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Επιστροφή
          </button>
        </div>
      </PageLayout>
    );
  }

  const pet = petData;

return (
    <PageLayout variant="owner" title={pet.name} breadcrumbs={breadcrumbItems}>
        <div className="owner-pet-detail">
            <div className="owner-pet-detail__header">
            </div>

            <div className="owner-pet-detail__content">
                <div className="owner-pet-detail__sidebar">
                    <div className="owner-pet-detail__pet-card">
                        <div className="owner-pet-detail__pet-icon">{getPetIcon(pet.icon)}</div>
                        <h2 className="owner-pet-detail__pet-name">{pet.name}</h2>
                        
                        <div className="owner-pet-detail__pet-info">
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Είδος</span>
                                <span className="owner-pet-detail__info-value">{pet.type}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Ράτσα</span>
                                <span className="owner-pet-detail__info-value">{pet.breed}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Φύλο</span>
                                <span className="owner-pet-detail__info-value">{pet.gender}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Ημερομηνία Γέννησης</span>
                                <span className="owner-pet-detail__info-value">{pet.birthDate}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Αριθμός Μικροτσίπ</span>
                                <span className="owner-pet-detail__info-value">{pet.microchip}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Χρώμα</span>
                                <span className="owner-pet-detail__info-value">{pet.color}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Βάρος (σε κιλά)</span>
                                <span className="owner-pet-detail__info-value">{pet.weight}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">ΑΦΜ Ιδιοκτήτη</span>
                                <span className="owner-pet-detail__info-value">{pet.afm}</span>
                            </div>
                        </div>

                        <button className="owner-pet-detail__download-btn" onClick={handlePrint}>
                            <Download size={18} />
                            Εκτύπωση Βιβλιαρίου
                        </button>
                    </div>
                </div>

                <div className="owner-pet-detail__main">
                    <h2 className="owner-pet-detail__section-title">Ιατρικό Ιστορικό</h2>

                    <div className="owner-pet-detail__events">
                        {medicalHistory.map((event) => (
                            <MedicalEventCard key={event.id} event={event} />
                        ))}
                    </div>

                    <h2 className="owner-pet-detail__section-title">Στατιστικά</h2>
                    <div className="owner-pet-detail__stats">
                        <StatCard type="vaccination" label="Εμβολιασμοί" value={pet.stats.vaccinations} />
                        <StatCard type="surgery" label="Χειρουργεία" value={pet.stats.surgeries} />
                        <StatCard type="examination" label="Εξετάσεις" value={pet.stats.examinations} />
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
);
};

export default PetDetail;