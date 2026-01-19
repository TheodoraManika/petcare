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

  const handleFoundClick = async (e) => {
    e.stopPropagation();
    
    try {
      // First, fetch the complete pet data from backend
      const petResponse = await fetch(`http://localhost:5000/pets/${pet.id}`);
      if (!petResponse.ok) {
        throw new Error('Failed to fetch pet data');
      }
      const completePetData = await petResponse.json();

      // Save the complete pet data to lost_history
      const lostHistoryEntry = {
        ...completePetData,
        id: `history_${completePetData.id}_${Date.now()}`,
        petStatus: 2,
        foundDate: new Date().toISOString(),
        markedFoundAt: new Date().toISOString()
      };
      
      const historyResponse = await fetch(`http://localhost:5000/lost_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lostHistoryEntry),
      });

      if (!historyResponse.ok) {
        throw new Error('Failed to save to lost_history');
      }

      // Then update pet status
      const patchResponse = await fetch(`http://localhost:5000/pets/${pet.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petStatus: 0 }),
      });

      if (!patchResponse.ok) {
        throw new Error('Failed to update pet status');
      }

      // Call the parent callback
      onFound && onFound();
      alert('Το κατοικίδιό σας σημειώθηκε ως βρεθέν και η ιστορία αποθηκεύτηκε.');
    } catch (error) {
      console.error('Error marking pet as found:', error);
      alert('Σφάλμα κατά την ενημέρωση της κατάστασης. Παρακαλώ προσπαθήστε ξανά.');
    }
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
          <span className="owner-pet-card__status-badge">ΧΑΜΕΝΟ</span>
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
