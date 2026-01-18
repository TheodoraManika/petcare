import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import './MicrochipSearch.css';

const MicrochipSearch = ({ onSearchComplete, variant = 'citizen', initialValue = '' }) => {
    const [microchipInput, setMicrochipInput] = useState(initialValue);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 15) {
            setMicrochipInput(value);
            if (error) setError('');
        }
    };

    const handleSearch = async () => {
        if (!microchipInput.trim()) return;

        if (microchipInput.length !== 15) {
            setError('Ο αριθμός μικροτσίπ πρέπει να έχει ακριβώς 15 ψηφία');
            onSearchComplete({ found: false, pet: null, microchip: microchipInput });
            return;
        }

        setIsSearching(true);
        try {
            // First, try to search in pets table
            let response = await fetch(`http://localhost:5000/pets?microchipId=${microchipInput}`);
            if (!response.ok) throw new Error('Failed to search');
            
            let pets = await response.json();
            let foundPet = pets.length > 0 ? pets[0] : null;

            // If not found in pets, search in lostPets table
            if (!foundPet) {
                const lostPetsResponse = await fetch(`http://localhost:5000/lostPets?microchip=${microchipInput}`);
                if (lostPetsResponse.ok) {
                    const lostPets = await lostPetsResponse.json();
                    if (lostPets.length > 0) {
                        const lostPetEntry = lostPets[0];
                        // Return the lost pet data with flag indicating it's from lostPets
                        foundPet = {
                            id: lostPetEntry.petId || lostPetEntry.id,
                            name: lostPetEntry.petName,
                            species: lostPetEntry.type,
                            breed: lostPetEntry.breed,
                            microchip: lostPetEntry.microchip,
                            color: lostPetEntry.color,
                            description: lostPetEntry.description,
                            isFromLostPets: true
                        };
                    }
                }
            }

            if (foundPet) {
                setError('');
                onSearchComplete({ found: true, pet: foundPet, microchip: foundPet.microchip || microchipInput });
            } else {
                setError(''); // Clear error if valid length but not found (just fill field)
                onSearchComplete({ found: false, pet: null, microchip: microchipInput });
            }
        } catch (err) {
            console.error('Error searching microchip:', err);
            setError('Σφάλμα κατά την αναζήτηση. Προσπαθήστε ξανά.');
            onSearchComplete({ found: false, pet: null, microchip: microchipInput });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    // Determine label text based on variant or keep it generic
    const labelText = variant === 'vet'
        ? 'Αναζήτηση με Microchip'
        : 'Αναζήτηση Βάσει Microchip (Προαιρετικό)';

    return (
        <div className={`microchip-search-section microchip-search--${variant}`}>
            <label className="microchip-search__label">
                <Search size={16} style={{ marginRight: '6px' }} />
                {labelText}
            </label>

            <div className="microchip-search__input-wrapper">
                <input
                    type="text"
                    value={microchipInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="π.χ. 123456789012345 (15 χαρακτήρες)"
                    className="microchip-search__input"
                    maxLength={15}
                    disabled={isSearching}
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="microchip-search__btn"
                    disabled={!microchipInput.trim() || isSearching}
                >
                    <Search size={18} />
                    {isSearching ? 'Αναζήτηση...' : 'Αναζήτηση'}
                </button>
            </div>

            {error && (
                <div className="microchip-search__error">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            <p className="microchip-search__hint">
                {variant === 'vet'
                    ? 'Εάν το κατοικίδιο έχει microchip, εισάγετε τον αριθμό (15 ψηφία) για αυτόματη συμπλήρωση των στοιχείων.'
                    : 'Εάν γνωρίζετε το microchip, κάντε αναζήτηση για αυτόματη συμπλήρωση των στοιχείων.'}
            </p>
        </div>
    );
};

export default MicrochipSearch;
