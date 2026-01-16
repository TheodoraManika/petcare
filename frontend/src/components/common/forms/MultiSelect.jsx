import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './MultiSelect.css';

const MultiSelect = ({ 
  label, 
  value = [], // Array of selected values
  onChange, 
  options, 
  placeholder = "Επιλέξτε...",
  required = false,
  name,
  disabled = false
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

  const handleToggle = (optionValue) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue) // Remove if already selected
      : [...value, optionValue]; // Add if not selected
    
    onChange(newValue);
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return options
      .filter(opt => value.includes(opt.value))
      .map(opt => opt.label);
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className={`multi-select ${disabled ? 'multi-select--disabled' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        className={`multi-select__trigger ${isOpen ? 'multi-select__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="multi-select__value-container">
          {selectedLabels.length === 0 ? (
            <span className="multi-select__placeholder">{placeholder}</span>
          ) : (
            <div className="multi-select__tags">
              {selectedLabels.map((label, index) => {
                const optionValue = options.find(opt => opt.label === label)?.value;
                return (
                  <span key={index} className="multi-select__tag">
                    {label}
                    {!disabled && (
                      <button
                        type="button"
                        className="multi-select__tag-remove"
                        onClick={(e) => handleRemove(optionValue, e)}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <ChevronDown 
          className={`multi-select__chevron ${isOpen ? 'multi-select__chevron--open' : ''}`} 
          size={16}
        />
      </button>

      {isOpen && !disabled && (
        <div className="multi-select__dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`multi-select__option ${value.includes(option.value) ? 'multi-select__option--selected' : ''}`}
              onClick={() => handleToggle(option.value)}
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                readOnly
                className="multi-select__checkbox"
              />
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={value.join(',')} 
        required={required && value.length === 0}
      />
    </div>
  );
};

export default MultiSelect;
