import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.css';

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Επιλέξτε...",
  required = false,
  name,
  variant = 'vet'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`custom-select custom-select--${variant}`} ref={dropdownRef}>
      <button
        type="button"
        className={`custom-select__trigger ${isOpen ? 'custom-select__trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`custom-select__value ${!value ? 'custom-select__value--placeholder' : ''}`}>
          {displayText}
        </span>
        <ChevronDown 
          className={`custom-select__chevron ${isOpen ? 'custom-select__chevron--open' : ''}`} 
          size={16}
        />
      </button>

      {isOpen && (
        <div className="custom-select__dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`custom-select__option ${value === option.value ? 'custom-select__option--selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={value || ''} 
        required={required}
      />
    </div>
  );
};

export default CustomSelect;
