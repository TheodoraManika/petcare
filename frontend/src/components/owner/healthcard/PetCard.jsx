import React from 'react';
import { Dog, Cat } from 'lucide-react';
import './PetCard.css';

const PetCard = ({ pet, onClick }) => {
  const getPetIcon = (iconType) => {
    switch (iconType) {
      case 'dog':
        return <Dog size={28} />;
      case 'cat':
        return <Cat size={28} />;
      default:
        return <Dog size={28} />;
    }
  };

  return (
    <div className="owner-pet-card" onClick={onClick}>
      <div className="owner-pet-card__icon">
        {getPetIcon(pet.icon)}
      </div>
      <h3 className="owner-pet-card__title">{pet.name}</h3>
      <p className="owner-pet-card__description">
        {pet.type} - {pet.breed}
      </p>
    </div>
  );
};

export default PetCard;
