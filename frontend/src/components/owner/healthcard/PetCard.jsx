import React from 'react';
import { Dog, Cat } from 'lucide-react';
import './PetCard.css';

const PetCard = ({ pet, onClick }) => {
  const getPetIcon = (iconType) => {
    switch (iconType) {
      case 'dog':
        return <Dog size={32} />;
      case 'cat':
        return <Cat size={32} />;
      default:
        return <Dog size={32} />;
    }
  };

  return (
    <div className="owner-pet-card" onClick={onClick}>
      <div className="owner-pet-card__avatar">
        <span className="owner-pet-card__icon">{getPetIcon(pet.icon)}</span>
      </div>
      <div className="owner-pet-card__info">
        <h3 className="owner-pet-card__name">{pet.name}</h3>
        <p className="owner-pet-card__details">
          {pet.type} - {pet.breed}
        </p>
      </div>
    </div>
  );
};

export default PetCard;
