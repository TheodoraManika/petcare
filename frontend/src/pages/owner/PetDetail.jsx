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

        // Fetch owner data
        const ownerResponse = await fetch(`http://localhost:5000/users/${pet.ownerId}`);
        const owner = await ownerResponse.json();

        // Fetch medical acts for this pet
        const medicalResponse = await fetch(`http://localhost:5000/medicalActs?petId=${petId}`);
        const medicalActs = await medicalResponse.json();

        // Fetch life events for this pet
        const lifeEventsResponse = await fetch(`http://localhost:5000/lifeEvents?petId=${petId}`);
        const lifeEvents = await lifeEventsResponse.json();

        // Fetch vets for medical history (to map names)
        const vetsResponse = await fetch('http://localhost:5000/users');
        const allVets = await vetsResponse.json();

        // Transform medical acts
        const transformedMedicalActs = medicalActs.map(act => {
          const vet = allVets.find(v => Number(v.id) === Number(act.vetId));
          const typeMap = {
            'vaccination': 'Εμβολιασμός',
            'checkup': 'Εξέταση',
            'surgery': 'Χειρουργείο',
            'treatment': 'Θεραπεία',
            'dental': 'Οδοντιατρική',
            'emergency': 'Έκτακτη περίπτωση',
            'consultation': 'Συμβουλή',
            'grooming': 'Περιποίηση'
          };

          return {
            id: `act-${act.id}`,
            type: act.type,
            title: typeMap[act.type] || act.type,
            description: act.description || '-',
            date: act.date,
            vet: vet ? `Δρ. ${vet.name} ${vet.lastName}` : 'Άγνωστος κτηνίατρος',
            status: 'Ολοκληρώθηκε'
          };
        });

        // Transform life events
        const transformedLifeEvents = lifeEvents.map(event => {
          const vet = allVets.find(v => Number(v.id) === Number(event.vetId));
          const typeMap = {
            'adoption': 'Υιοθεσία',
            'transfer': 'Μεταβίβαση',
            'lost': 'Δήλωση Απώλειας',
            'found': 'Εύρεση',
            'foster': 'Αναδοχή'
          };

          return {
            id: `event-${event.id}`,
            type: event.type,
            title: typeMap[event.type] || event.type,
            description: event.details || '-',
            date: event.date,
            vet: vet ? `Δρ. ${vet.name} ${vet.lastName}` : 'Σύστημα', // Or owner for some events
            status: event.status === 'draft' ? 'Πρόχειρο' : 'Υποβλήθηκε'
          };
        });

        // Combine and sort by date descending
        const combinedHistory = [...transformedMedicalActs, ...transformedLifeEvents].sort((a, b) =>
          new Date(b.date) - new Date(a.date)
        );

        // Calculate statistics based on combined history
        const stats = {
          vaccinations: transformedMedicalActs.filter(h => h.type === 'vaccination').length,
          surgeries: transformedMedicalActs.filter(h => h.type === 'surgery').length,
          examinations: transformedMedicalActs.filter(h => h.type === 'checkup').length,
        };

        // Format pet data
        const formattedPet = {
          name: pet.name || 'Άγνωστο',
          type: pet.species || 'Άγνωστο',
          breed: pet.breed || '-',
          gender: pet.gender || '-',
          birthDate: pet.birthDate || '-',
          microchip: pet.microchipId || '-',
          color: pet.color || '-',
          weight: pet.weight || '-',
          afm: pet.ownerAFM || owner?.afm || '-',
          icon: pet.species === 'dog' ? 'dog' : pet.species === 'cat' ? 'cat' : 'pet',
          stats: stats,
          status: pet.status || 'safe'
        };

        setPetData(formattedPet);
        setMedicalHistory(combinedHistory);
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

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (petData && !isEditing) {
      setEditFormData({
        name: petData.name,
        breed: petData.breed,
        color: petData.color,
        weight: petData.weight,
        birthDate: petData.birthDate,
        microchip: petData.microchip,
        gender: petData.gender // assuming backend returns gender
      });
    }
  }, [petData, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data handled by useEffect dependency
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/pets/${petId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editFormData.name,
          breed: editFormData.breed,
          color: editFormData.color,
          weight: editFormData.weight,
          birthDate: editFormData.birthDate,
          microchipId: editFormData.microchip, // Mapping back to backend field name
          gender: editFormData.gender
        })
      });

      if (response.ok) {
        const updatedPet = await response.json();
        // Update local state
        setPetData(prev => ({
          ...prev,
          name: updatedPet.name,
          breed: updatedPet.breed,
          color: updatedPet.color,
          weight: updatedPet.weight,
          birthDate: updatedPet.birthDate,
          microchip: updatedPet.microchipId,
          gender: updatedPet.gender
        }));
        setIsEditing(false);
      } else {
        alert('Failed to update pet');
      }
    } catch (error) {
      console.error('Error updating pet:', error);
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
        <div className="owner-pet-detail__header" style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCancelEdit} style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ακύρωση</button>
              <button onClick={handleSaveEdit} style={{ padding: '8px 16px', background: '#23CDD9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Αποθήκευση</button>
            </div>
          ) : (
            <button onClick={handleEditToggle} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }}>
              Επεξεργασία
            </button>
          )}
        </div>

        <div className="owner-pet-detail__content">
          <div className="owner-pet-detail__sidebar">
            <div className="owner-pet-detail__pet-card">
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
                <div className="owner-pet-detail__pet-icon">{getPetIcon(pet.icon)}</div>
                {pet.status === 'lost' && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '10px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    Απώλεια
                  </span>
                )}
              </div>
              <h2 className="owner-pet-detail__pet-name">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleInputChange}
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', width: '100%' }}
                  />
                ) : (
                  pet.name
                )}
              </h2>

              <div className="owner-pet-detail__pet-info">
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Είδος</span>
                  <span className="owner-pet-detail__info-value">{pet.type}</span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Ράτσα</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="breed" value={editFormData.breed || ''} onChange={handleInputChange} /> : pet.breed}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Φύλο</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="gender" value={editFormData.gender || ''} onChange={handleInputChange} /> : pet.gender}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Ημερομηνία Γέννησης</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="birthDate" value={editFormData.birthDate || ''} onChange={handleInputChange} /> : pet.birthDate}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Αριθμός Μικροτσίπ</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="microchip" value={editFormData.microchip || ''} onChange={handleInputChange} /> : pet.microchip}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Χρώμα</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="color" value={editFormData.color || ''} onChange={handleInputChange} /> : pet.color}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">Βάρος (σε κιλά)</span>
                  <span className="owner-pet-detail__info-value">
                    {isEditing ? <input name="weight" value={editFormData.weight || ''} onChange={handleInputChange} /> : pet.weight}
                  </span>
                </div>
                <div className="owner-pet-detail__info-row">
                  <span className="owner-pet-detail__info-label">ΑΦΜ Ιδιοκτήτη</span>
                  <span className="owner-pet-detail__info-value">{pet.ownerAFM}</span>
                </div>
              </div>

              {!isEditing && (
                <button className="owner-pet-detail__download-btn" onClick={handlePrint}>
                  <Download size={18} />
                  Εκτύπωση Βιβλιαρίου
                </button>
              )}
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