import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
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
        
        // Fetch all pets from backend
        const response = await fetch('http://localhost:5000/pets');
        if (!response.ok) {
          throw new Error('Σφάλμα φόρτωσης κατοικιδίων');
        }
        
        const allPets = await response.json();
        
        // Filter pets that belong to this owner
        const ownerPets = allPets.filter(pet => Number(pet.ownerId) === Number(currentUser.id));
        
        // Transform pets for display
        const transformedPets = ownerPets.map(pet => ({
          id: pet.id,
          name: pet.name || 'Άγνωστο',
          type: pet.species || 'Άγνωστο',
          breed: pet.breed || 'Άγνωστη φυλή',
          gender: pet.gender || '-',
          birthDate: pet.birthDate || '-',
          microchipId: pet.microchipId || '-',
          color: pet.color || '-',
          weight: pet.weight || '-',
          icon: pet.species === 'dog' ? 'dog' : pet.species === 'cat' ? 'cat' : 'pet'
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

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.owner.dashboard }
  ];

  return (
    <PageLayout variant="owner" title="Βιβλιάριο Υγείας" breadcrumbs={breadcrumbItems}>
      <div className="owner-health-book">
        <div className="owner-health-book__header">
        </div>

        <div className="owner-health-book__content">
          <h1 className="owner-health-book__title">Βιβλιάριο Υγείας Κατοικιδίων</h1>
          <p className="owner-health-book__subtitle">
            Προβολή και εκτύπωση των στοιχείων των κατοικιδίων σας
          </p>

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
