import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Camera } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './LostPetDetails.css';

const LostPetDetails = () => {
  const { petId } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const petDetails = {
    id: 1,
    name: 'Μιχαλάκης',
    type: 'Σκύλος',
    breed: 'Golden Retriever',
    status: 'Χαμένο',
    statusColor: 'red',
    area: 'Κήπος Αθηνών, Παλαιά Συντακτική',
    dateReported: '05/11/2025',
    description: 'Golden Retriever, μεγάλου μεγέθους, με κόκκινο περιλώμιον',
    phone: '69XXXXXXXX',
    image: null,
  };

  const handleFoundReport = () => {
    navigate(ROUTES.citizen.foundPetForm);
  };

  return (
    <PageLayout 
      title={petDetails.name}
      breadcrumbs={[
        { label: 'Χαμένα Κατοικίδια', path: '/citizen/lost-pets' }
      ]}
    >
      <div className="lost-pet-details-page">

        {/* Pet Details Container */}
        <div className="pet-details-container">
          {/* Pet Image and Basic Info */}
          <div className="pet-image-section">
            <div className="pet-image-box">
              {petDetails.image ? (
                <img src={petDetails.image} alt={petDetails.name} />
              ) : (
                <div className="pet-image-placeholder">
                  <Camera size={64} />
                </div>
              )}
            </div>

            <div className="pet-basic-info">
              <h1 className="pet-name">{petDetails.name}</h1>
              <p className="pet-type">{petDetails.type} - {petDetails.breed}</p>
              <span className={`pet-status-badge status-${petDetails.statusColor}`}>
                {petDetails.status}
              </span>
            </div>
          </div>

          {/* Pet Details */}
          <div className="pet-details-section">
            {/* Location */}
            <div className="detail-group">
              <div className="detail-header">
                <MapPin size={20} className="detail-icon" />
                <h3 className="detail-title">Τοποθεσία Εύρεσης</h3>
              </div>
              <p className="detail-content">{petDetails.area}</p>
            </div>

            {/* Date */}
            <div className="detail-group">
              <h3 className="detail-title">Ημερομηνία Εύρεσης</h3>
              <p className="detail-content">{petDetails.dateReported}</p>
            </div>

            {/* Description */}
            <div className="detail-group">
              <h3 className="detail-title">Περιγραφή</h3>
              <p className="detail-content">{petDetails.description}</p>
            </div>

            {/* Contact */}
            <div className="detail-group">
              <div className="detail-header">
                <Phone size={20} className="detail-icon" />
                <h3 className="detail-title">Στοιχεία Επικοινωνίας</h3>
              </div>
              <p className="detail-content">{petDetails.phone}</p>
            </div>

            {/* Report Found Button */}
            <button className="report-found-button" onClick={handleFoundReport}>
              Το Βρήκα - Δήλωση Εύρεσης
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LostPetDetails;
