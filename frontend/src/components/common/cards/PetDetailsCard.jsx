import React from 'react';
import { X } from 'lucide-react';
import './PetDetailsCard.css';

const PetDetailsCard = ({ petData, onClear, variant = 'citizen' }) => {
    if (!petData) return null;

    const isVet = variant === 'vet';
    const hasPetName = !!petData.petName;

    const isNotFound = !hasPetName;

    return (
        <div className={`pet-details-card ${isNotFound ? 'pet-details-card--not-found' : `pet-details-card--${variant}`}`}>
            <button
                type="button"
                className="pet-card__remove-btn"
                onClick={onClear}
                title="Αφαίρεση"
            >
                <X size={20} />
            </button>

            <div className="pet-card__container">
                <div className="pet-card__image">
                    {hasPetName ? (petData.species === 'cat' ? '🐈' : '🐕') : '🐕'}
                </div>

                <div className="pet-card__content">
                    <h3 className="pet-card__title">
                        {hasPetName ? 'Στοιχεία Κατοικιδίου' : 'Αριθμός Microchip'}
                    </h3>

                    <div className="pet-card__info-grid">
                        {hasPetName ? (
                            <>
                                <div className="pet-card__column">
                                    <div className="pet-card__row">
                                        <span className="pet-card__label">Όνομα</span>
                                        <span className="pet-card__value">{petData.petName}</span>
                                    </div>
                                    <div className="pet-card__row">
                                        <span className="pet-card__label">Είδος</span>
                                        <span className="pet-card__value">{petData.species}</span>
                                    </div>
                                    <div className="pet-card__row">
                                        <span className="pet-card__label">Ράτσα</span>
                                        <span className="pet-card__value">{petData.breed || '-'}</span>
                                    </div>
                                </div>

                                <div className="pet-card__column">
                                    {petData.microchip && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Microchip</span>
                                            <span className="pet-card__value">{petData.microchip}</span>
                                        </div>
                                    )}
                                    {petData.dateReported && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Ημ. Απώλειας</span>
                                            <span className="pet-card__value">{petData.dateReported}</span>
                                        </div>
                                    )}
                                    {petData.foundLocation && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Περιοχή</span>
                                            <span className="pet-card__value">{petData.foundLocation}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="pet-card__column">
                                <div className="pet-card__row">
                                    <span className="pet-card__label">Microchip</span>
                                    <span className="pet-card__value">{petData.microchip}</span>
                                </div>
                                <p className="pet-card__note">
                                    Δεν βρέθηκε καταχωρημένο κατοικίδιο με αυτόν τον αριθμό. Παρακαλώ συμπληρώστε τα στοιχεία του κατοικιδίου παρακάτω.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsCard;
