import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/global/layout/PageLayout';
import PetCard from '../../components/owner/healthcard/PetCard';
import { ROUTES } from '../../utils/constants';
import './HealthBook.css';

const HealthBook = () => {
  const navigate = useNavigate();

  // Mock pet data - in real app, this would come from API/database
  const userPets = [
    {
      id: 'pet1',
      name: 'Μπάμπης',
      type: 'Σκύλος',
      breed: 'Golden Retriever',
      icon: 'dog',
    },
    {
      id: 'pet2',
      name: 'Μίνι',
      type: 'Γάτα',
      breed: 'Περσική',
      icon: 'cat',
    },
  ];

  const handlePetClick = (petId) => {
    navigate(`${ROUTES.owner.pets}/${petId}`);
  };

  return (
    <PageLayout variant="owner">
      <div className="owner-health-book">
        <div className="owner-health-book__header">
        </div>

        <div className="owner-health-book__content">
          <h1 className="owner-health-book__title">Βιβλιάριο Υγείας Κατοικιδίων</h1>
          <p className="owner-health-book__subtitle">
            Προβολή και εκτύπωση των στοιχείων των κατοικιδίων σας
          </p>

          <div className="owner-health-book__pets">
            {userPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => handlePetClick(pet.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HealthBook;
