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
    <PageLayout 
      variant="citizen"
      title={vetData.name}
      breadcrumbs={[
        { label: 'Κτηνίατροι', path: '/citizen/search-map' }
      ]}
    >
      <div className="vet-profile-container">
        <div className="vet-profile-card">
          {/* Header Section */}
          <div className="profile-header">
          <div className="profile-header-content">
            <img 
              src={vetData.profileImage} 
              alt={vetData.name}
              className="profile-image"
            />
            <div className="profile-identity">
              <h1 className="vet-name">{vetData.name}</h1>
              <p className="vet-specialty">{vetData.specialty}</p>
              <div className="rating-section">
                <div className="stars">
                  {renderStars(Math.floor(vetData.rating))}
                </div>
                <span className="rating-text">
                  {vetData.rating} ({vetData.reviewCount} αξιολογήσεις)
                </span>
              </div>
            </div>
            {isOwner && (
              <button className="book-appointment-btn">
                Κλείστε Ραντεβού
              </button>
            )}
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="professional-details">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-header">
                <MapPin className="detail-icon" size={20} />
                <h3>Διεύθυνση Ιατρείου</h3>
              </div>
              <p className="detail-content">{vetData.address}</p>
              <p className="detail-content">{vetData.phone}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <Briefcase className="detail-icon" size={20} />
                <h3>Εμπειρία</h3>
              </div>
              <p className="detail-content">{vetData.experience}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <GraduationCap className="detail-icon" size={20} />
                <h3>Εκπαίδευση</h3>
              </div>
              <p className="detail-content">{vetData.education}</p>
            </div>

            <div className="detail-item">
              <div className="detail-header">
                <Clock className="detail-icon" size={20} />
                <h3>Ωράριο</h3>
              </div>
              <p className="detail-content">{vetData.hours.weekdays}</p>
              <p className="detail-content">{vetData.hours.saturday}</p>
              <p className="detail-content">{vetData.hours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="biography-section">
          <h2 className="section-title">Βιογραφικό</h2>
          <p className="biography-content">{vetData.biography}</p>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="section-title">Κριτικές Πελατών</h2>
          <div className="reviews-list">
            {vetData.reviews.slice(0, visibleReviews).map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>
                  <span className="review-author">{review.author}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
          {visibleReviews < vetData.reviews.length && (
            <button 
              className="load-more-btn"
              onClick={handleLoadMore}
            >
              Φόρτωση περισσότερων
            </button>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetProfile;