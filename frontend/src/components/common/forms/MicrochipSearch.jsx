import React, { useState, useEffect } from 'react';
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

    // Auto-search if initial value is provided and valid length
    useEffect(() => {
        if (initialValue && initialValue.length === 15) {
            handleSearch();
        }
    }, [initialValue]); // Only run when initialValue changes/mounts

    const handleSearch = async () => {
        if (!microchipInput.trim()) return;

        if (microchipInput.length !== 15) {
            setError('Ο αριθμός μικροτσίπ πρέπει να έχει ακριβώς 15 ψηφία');
            onSearchComplete({ found: false, pet: null, microchip: microchipInput });
            return;
        }

        setIsSearching(true);
        try {
            // Search in unified pets table by microchipId
            const response = await fetch(`http://localhost:5000/pets`);
            if (!response.ok) throw new Error('Failed to search');
            
            const allPets = await response.json();
            
            // Look for a pet matching microchipId
            let foundPet = allPets.find(pet => pet.microchipId === microchipInput);

            if (foundPet) {
                setError('');
                onSearchComplete({ found: true, pet: foundPet, microchip: foundPet.microchipId || microchipInput });
            } else {
                setError(''); // Clear error if valid length but not found (just fill field)
                onSearchComplete({ found: false, pet: null, microchip: microchipInput });
            }
        } catch (err) {
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
