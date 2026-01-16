import React from 'react';
import { Dog, Cat, CheckCircle } from 'lucide-react';
import './PetCard.css';

const PetCard = ({ pet, onClick, onFound }) => {
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

  const handleFoundClick = (e) => {
    e.stopPropagation();
    onFound && onFound();
  };

  return (
    <div
      className={`owner-pet-card ${pet.status === 'lost' ? 'owner-pet-card--lost' : ''}`}
      onClick={onClick}
    >
      <div className="owner-pet-card__header">
        <div className="owner-pet-card__icon">
          {getPetIcon(pet.icon)}
        </div>
        {pet.status === 'lost' && (
          <span className="owner-pet-card__status-badge">Απώλεια</span>
        )}
      </div>

      <h3 className="owner-pet-card__title">{pet.name}</h3>
      <p className="owner-pet-card__description">
        {pet.type} - {pet.breed}
      </p>

      {pet.status === 'lost' && (
        <button
          className="owner-pet-card__found-btn"
          onClick={handleFoundClick}
        >
          <CheckCircle size={16} />
          Βρέθηκε
        </button>
      )}
    </div>
  );
};


export default PetCard;
