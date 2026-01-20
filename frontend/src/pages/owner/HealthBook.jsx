import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import PetCard from '../../components/owner/healthcard/PetCard';
import { ROUTES } from '../../utils/constants';
import './HealthBook.css';

const HealthBook = () => {
  const navigate = useNavigate();
  const [userPets, setUserPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current owner from localStorage
  useEffect(() => {
    const fetchOwnerPets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
          setError('Δεν έχετε συνδεθεί');
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(storedUser);

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

        // Fetch all pets from backend
        const response = await fetch('http://localhost:5000/pets');
        if (!response.ok) {
          throw new Error('Σφάλμα φόρτωσης κατοικιδίων');
        }

        const allPets = await response.json();

        // Filter pets that belong to this owner (use String comparison since IDs are strings)
        const ownerPets = allPets.filter(pet => String(pet.ownerId) === String(currentUser.id));

        // Transform pets for display
        const transformedPets = ownerPets.map(pet => ({
          id: pet.id,
          name: pet.name || 'Άγνωστο',
          type: translatePetType(pet.type) || 'Άγνωστο',
          breed: pet.breed || 'Άγνωστη φυλή',
          gender: pet.gender || '-',
          birthDate: pet.birthDate || '-',
          microchipId: pet.microchipId || '-',
          color: pet.color || '-',
          weight: pet.weight || '-',
          icon: pet.type === 'Σκύλος' ? 'dog' : pet.type === 'Γάτα' ? 'cat' : 'pet',
          // Pet is considered 'lost' when status is 'lost' AND petStatus is 1
          status: (pet.status === 'active' && pet.petStatus === 1) ? 'lost' : 'safe'
        }));

        setUserPets(transformedPets);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOwnerPets();
  }, []);

  const handlePetClick = (petId) => {
    navigate(`${ROUTES.owner.pets}/${petId}`);
  };

  const handleFound = (petId) => {
    setUserPets(currentPets =>
      currentPets.map(pet =>
        pet.id === petId ? { ...pet, status: 'safe' } : pet
      )
    );
  };

  const breadcrumbItems = [
  ];

  return (
    <PageLayout variant="owner" title="Τα Κατοικίδιά μου" breadcrumbs={breadcrumbItems}>
      <div className="owner-health-book">
        <div className="owner-health-book__header">
        </div>
        <h1 className="owner-health-book__title">Τα Κατοικίδιά μου</h1>
        <p className="owner-health-book__subtitle">
          Προβολή και εκτύπωση των στοιχείων των κατοικιδίων σας
        </p>

        <div className="owner-health-book__content">

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Φόρτωση κατοικιδίων...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#d32f2f' }}>
              <p>Σφάλμα: {error}</p>
            </div>
          ) : userPets.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Δεν έχετε καταχωρημένα κατοικίδια.</p>
            </div>
          ) : (
            <div className="owner-health-book__pets">
              {userPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onClick={() => handlePetClick(pet.id)}
                  onFound={() => handleFound(pet.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HealthBook;
