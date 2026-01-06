import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Loader2, Search } from 'lucide-react';
import './LocationPicker.css';

/**
 * LocationPicker
 * Autocomplete search using OpenStreetMap Nominatim and optional map preview.
 *
 * Props:
 * - value: string (current input value)
 * - onChange: (value: string) => void
 * - onSelect: ({ label, lat, lon }) => void
 * - placeholder: string
 * - required: boolean
 * - variant: 'citizen' | 'owner' | 'vet'
 */
const LocationPicker = ({
  value,
  onChange,
  onSelect,
  placeholder = 'π.χ. Πλατεία Συντάγματος',
  required = false,
  variant = 'vet'
}) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selected, setSelected] = useState(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  // Keep internal state in sync with parent value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Debounced fetch to Nominatim
  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setError('');
      setShowMap(false);
      return undefined;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
          {
            method: 'GET',
            headers: {
              'Accept-Language': 'el,en',
              'User-Agent': 'petcare-frontend'
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const mapped = data.map((item) => ({
          label: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
        setSuggestions(mapped);
        setShowDropdown(true);
        setShowMap(mapped.length > 0);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Αποτυχία αναζήτησης τοποθεσίας');
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [query]);

  const mapUrl = useMemo(() => {
    const previewTarget = selected || suggestions[0];
    if (!previewTarget) return '';
    const lat = parseFloat(previewTarget.lat);
    const lon = parseFloat(previewTarget.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return '';
    const delta = 0.01;
    const bbox = `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
  }, [selected, suggestions]);

  const handleInputChange = (val) => {
    setQuery(val);
    onChange?.(val);
    setSelected(null);
    setShowDropdown(true);
    setShowMap(val.length >= 3);
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.label);
    setSelected(suggestion);
    onChange?.(suggestion.label);
    onSelect?.(suggestion);
    setShowDropdown(false);
    setShowMap(true);
  };

  return (
    <div className={`location-picker location-picker--${variant}`}>
      <div className="location-picker__input-wrapper">
        <Search className="location-picker__icon" size={18} />
        <input
          type="text"
          className="location-picker__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 3 && setShowDropdown(true)}
          required={required}
        />
        {loading && <Loader2 className="location-picker__spinner" size={18} />}
      </div>

      {error && <p className="location-picker__error">{error}</p>}

      {showDropdown && suggestions.length > 0 && (
        <div className="location-picker__dropdown">
          {suggestions.map((s, idx) => (
            <button
              type="button"
              key={`${s.lat}-${s.lon}-${idx}`}
              className="location-picker__option"
              onClick={() => handleSelect(s)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="location-picker__map-section">
        {showMap && mapUrl && (
          <div className="location-picker__map-wrapper">
            <iframe
              className="location-picker__map-iframe"
              src={mapUrl}
              title="Location map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <p className="location-picker__map-hint">
              Ο χάρτης κεντράρει το πρώτο διαθέσιμο αποτέλεσμα ή την επιλεγμένη τοποθεσία.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
