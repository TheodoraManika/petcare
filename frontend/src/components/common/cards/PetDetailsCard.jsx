import React from 'react';
import { X, Dog, Cat, Bird, PawPrint } from 'lucide-react';
import './PetDetailsCard.css';

const PetDetailsCard = ({ petData, onClear, variant = 'citizen' }) => {
    if (!petData) return null;

    const hasPetName = !!petData.name || !!petData.petName;
    const isNotFound = !hasPetName;

    const getPetIcon = (species) => {
        const type = species?.toLowerCase();
        if (type?.includes('dog') || type?.includes('σκύλος')) return <Dog size={50} color="#23CED9" />;
        if (type?.includes('cat') || type?.includes('γάτα')) return <Cat size={50} color="#23CED9" />;
        if (type?.includes('bird') || type?.includes('πτηνό')) return <Bird size={50} color="#23CED9" />;
        // Snake/Reptile fallback to PawPrint as specific icon might not exist
        return <PawPrint size={50} color="#23CED9" />;
    };

    // Support both old field names (petName, species, microchip) and new ones (name, type, microchipId)
    const petName = petData.name || petData.petName;
    const petSpecies = petData.type || petData.species;
    const petBreed = petData.breed;
    const petMicrochip = petData.microchipId || petData.microchip;
    const petColor = petData.color;
    const petWeight = petData.weight;
    const petGender = petData.gender;
    const petBirthDate = petData.birthDate;

    // Translation helpers
    const translateSpecies = (species) => {
        if (!species) return '-';
        const s = species.toLowerCase();
        if (s.includes('dog') || s.includes('σκύλος')) return 'Σκύλος';
        if (s.includes('cat') || s.includes('γάτα')) return 'Γάτα';
        if (s.includes('bird') || s.includes('πτηνό')) return 'Πτηνό';
        if (s.includes('reptile') || s.includes('ερπετό')) return 'Ερπετό';
        return species;
    };

    const translateGender = (gender) => {
        if (!gender) return '-';
        const g = gender.toLowerCase();
        if (g === 'male' || g === 'm') return 'Αρσενικό';
        if (g === 'female' || g === 'f') return 'Θηλυκό';
        return gender;
    };

    return (
        <div className={`pet-details-card ${isNotFound ? 'pet-details-card--not-found' : ''}`}>
            {onClear && (
                <button
                    type="button"
                    className="pet-card__remove-btn"
                    onClick={onClear}
                    title="Αφαίρεση"
                >
                    <X size={20} />
                </button>
            )}

            <div className="pet-card__container">
                <div className="pet-card__image">
                    {hasPetName ? getPetIcon(petSpecies) : <PawPrint size={50} color="#23CED9" />}
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
                                        <span className="pet-card__value">{petName}</span>
                                    </div>
                                    <div className="pet-card__row">
                                        <span className="pet-card__label">Είδος</span>
                                        <span className="pet-card__value">{translateSpecies(petSpecies)}</span>
                                    </div>
                                    <div className="pet-card__row">
                                        <span className="pet-card__label">Ράτσα</span>
                                        <span className="pet-card__value">{petBreed || '-'}</span>
                                    </div>
                                </div>

                                <div className="pet-card__column">
                                    {petColor && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Χρώμα</span>
                                            <span className="pet-card__value">{petColor}</span>
                                        </div>
                                    )}
                                    {petWeight && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Βάρος</span>
                                            <span className="pet-card__value">{petWeight} kg</span>
                                        </div>
                                    )}
                                    {petGender && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Φύλο</span>
                                            <span className="pet-card__value">{translateGender(petGender)}</span>
                                        </div>
                                    )}
                                    {petBirthDate && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Ημ/νία Γέννησης</span>
                                            <span className="pet-card__value">{petBirthDate}</span>
                                        </div>
                                    )}
                                    {petMicrochip && (
                                        <div className="pet-card__row">
                                            <span className="pet-card__label">Microchip</span>
                                            <span className="pet-card__value">{petMicrochip}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="pet-card__column">
                                <div className="pet-card__row">
                                    <span className="pet-card__label">Microchip</span>
                                    <span className="pet-card__value">{petMicrochip}</span>
                                </div>
                                <p className="pet-card__note">
                                    {petData.isFromLostPets
                                        ? 'Αυτό το κατοικίδιο είναι ήδη καταχωρημένο ως χαμένο.'
                                        : 'Δεν βρέθηκε καταχωρημένο κατοικίδιο με αυτόν τον αριθμό. Παρακαλώ συμπληρώστε τα στοιχεία του κατοικιδίου παρακάτω.'}
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
