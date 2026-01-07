import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './VetProfile.css';

const VetProfile = () => {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vet data from backend
  useEffect(() => {
    const fetchVet = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5000/users/${vetId}`);
        if (!response.ok) {
          throw new Error('Ο κτηνίατρος δεν βρέθηκε');
        }
        
        const vetData = await response.json();
        
        // Fetch availability for this vet
        const availabilityResponse = await fetch('http://localhost:5000/availability');
        const availabilityRecords = await availabilityResponse.json();
        const vetAvailability = availabilityRecords.filter(a => Number(a.vetId) === Number(vetId));
        
        // Format the vet data with defaults
        const formattedVet = {
          id: vetData.id,
          name: vetData.name || 'Άγνωστος',
          lastName: vetData.lastName || '',
          specialty: vetData.specialization || 'Γενικός Κτηνίατρος',
          rating: 4.5 + (Math.random() * 0.4), // Random rating for now
          reviewCount: Math.floor(Math.random() * 200) + 20,
          avatar: vetData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150',
          address: `${vetData.clinicAddress || ''}, ${vetData.clinicCity || ''}`,
          phone: vetData.phone || 'Δεν διατίθεται',
          email: vetData.email || 'Δεν διατίθεται',
          clinicName: vetData.clinicName || 'Κλινική',
          workingHours: 'Ελέγξτε τη διαθεσιμότητα',
          availability: vetAvailability,
          specializations: [vetData.specialization || 'Γενική Κτηνιατρική'],
          biography: `Άδεια Ασκήσεως: ${vetData.licenseNumber || 'Δεν διατίθεται'}`,
          reviews: [] // Mock reviews - can be enhanced later
        };
        
        setVet(formattedVet);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vet:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (vetId) {
      fetchVet();
    }
  }, [vetId]);

  if (loading) {
    return (
      <PageLayout title="Φόρτωση...">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Φόρτωση δεδομένων κτηνιάτρου...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !vet) {
    return (
      <PageLayout title="Σφάλμα">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#d32f2f' }}>Σφάλμα: {error || 'Ο κτηνίατρος δεν βρέθηκε'}</p>
          <button 
            onClick={() => navigate(ROUTES.citizen.searchMap)}
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Επιστροφή στην Αναζήτηση
          </button>
        </div>
      </PageLayout>
    );
  }

  const displayedReviews = showAllReviews ? vet.reviews : vet.reviews.slice(0, 2);

  const breadcrumbItems = [
    { label: 'Αναζήτηση Κτηνιάτρων', path: ROUTES.citizen.searchMap },
  ];

  return (
    <PageLayout title={`Δρ. ${vet.name}`} breadcrumbs={breadcrumbItems}>
      <div className="vet-profile">
        {/* Main Content */}
        <div className="vet-profile-container">
          {/* Header Section */}
          <div className="vet-header">
            <div className="vet-avatar">
              <img src={vet.avatar} alt={vet.name} />
            </div>
            <div className="vet-header-info">
              <h1 className="vet-name">Δρ. {vet.name}</h1>
              <p className="vet-specialty">{vet.specialty}</p>
              <div className="vet-rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(vet.rating) ? '#FCA47C' : '#e5e7eb'}
                      color={i < Math.floor(vet.rating) ? '#FCA47C' : '#e5e7eb'}
                    />
                  ))}
                </div>
                <span className="rating-value">{vet.rating}</span>
                <span className="rating-count">({vet.reviewCount} αξιολογήσεις)</span>
              </div>
            </div>

          </div>

          <div className="vet-profile-content">
            {/* Contact Information */}
            <div className="info-section">
              <h2 className="section-title">Δεδομένων Επαφής</h2>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Διεύθυνση</p>
                    <p className="contact-value">{vet.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Phone size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Τηλέφωνο</p>
                    <p className="contact-value">{vet.phone}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <Clock size={20} className="contact-icon" />
                  <div>
                    <p className="contact-label">Ώρες Λειτουργίας</p>
                    <p className="contact-value">{vet.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="info-section">
              <h2 className="section-title">Ειδικότητες</h2>
              <div className="specializations">
                {vet.specializations.map((spec, idx) => (
                  <span key={idx} className="specialization-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="info-section">
              <h2 className="section-title">Βιογραφία</h2>
              <p className="biography-text">{vet.biography}</p>
            </div>

            {/* Reviews */}
            <div className="info-section">
              <h2 className="section-title">Αξιολογήσεις Πελατών</h2>
              <div className="reviews-list">
                {displayedReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <h4 className="review-author">{review.author}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? '#FCA47C' : '#e5e7eb'}
                              color={i < review.rating ? '#FCA47C' : '#e5e7eb'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
              {vet.reviews.length > 2 && (
                <button
                  className="load-more-btn"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? 'Απόκρυψη' : 'Φόρτωση περισσοτέρων'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetProfile;
