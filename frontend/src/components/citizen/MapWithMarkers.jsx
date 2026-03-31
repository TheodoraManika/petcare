import React from 'react';
import { Star, MapPin, Stethoscope } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Avatar from '../common/Avatar';
import './MapWithMarkers.css';

// Create custom SVG markers
const createCustomMarker = (color) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 8 12 24 12 24s12-16 12-24c0-6.63-5.37-12-12-12z" 
            fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `;

  const icon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
    className: 'custom-marker'
  });

  return icon;
};

const cyanMarker = createCustomMarker('#23CED9');
const orangeMarker = createCustomMarker('#FCA47C');

/**
 * MapWithMarkers Component
 * Reusable Leaflet map with clickable markers
 * 
 * Props:
 * - center: [lat, lon] - Map center coordinates
 * - zoom: number - Initial zoom level
 * - markers: array - Array of marker objects with id, lat, lon, name, specialty, area, rating, etc.
 * - selectedId: string/number - ID of currently selected marker
 * - onMarkerClick: (marker) => void - Callback when marker is clicked
 * - popupContent: (marker) => React.Node - Custom popup content function
 * - currentUser: object - Current logged-in user { type: 'owner'|'vet'|'citizen' }
 * - onViewProfile: (marker) => void - Callback when View Profile clicked
 * - onCloseAppointment: (marker) => void - Callback when Close Appointment clicked
 */
const MapWithMarkers = ({
  center = [37.9838, 23.7275],
  zoom = 12,
  markers = [],
  selectedId = null,
  onMarkerClick = () => { },
  popupContent = null,
  height = '600px',
  currentUser = null,
  onViewProfile = () => { },
  onCloseAppointment = () => { }
}) => {
  const defaultPopupContent = (marker) => (
    <div className="popup-content">
      <div className="popup-container">
        <div className="popup-avatar">
          <Avatar
            src={marker.avatar}
            name={marker.name}
            lastName={marker.lastName || marker.surname}
            size="xl"
            shape="square"
          />
        </div>
        <div className="popup-info">
          <h4 className="popup-name">{marker.name} {marker.lastName || marker.surname}</h4>
          {marker.specialty && <p className="popup-specialty">{marker.specialty}</p>}
          {marker.area && (
            <p className="popup-location">
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {marker.area}
            </p>
          )}
          {marker.rating && (
            <div className="popup-rating">
              <Star size={14} fill="#FCA47C" color="#FCA47C" />
              <span>{typeof marker.rating === 'number' ? marker.rating.toFixed(1) : marker.rating}</span>
            </div>
          )}
        </div>
      </div>
      <div className="popup-buttons">
        <button className="popup-profile-btn" onClick={() => onViewProfile(marker)}>
          Προβολή Προφίλ
        </button>
        <button className="popup-close-appointment-btn" onClick={() => onCloseAppointment(marker)}>
          Κλείστε Ραντεβού
        </button>
      </div>
    </div>
  );

  const renderPopupContent = popupContent || defaultPopupContent;

  return (
    <div className="map-with-markers" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lon]}
            icon={selectedId === marker.id ? orangeMarker : cyanMarker}
            eventHandlers={{
              click: () => onMarkerClick(marker)
            }}
          >
            <Popup className="map-popup">
              {renderPopupContent(marker)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWithMarkers;
