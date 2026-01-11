import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, IdCard, Briefcase, GraduationCap, X, Hospital } from 'lucide-react';
import Avatar from '../common/Avatar';
import { ROUTES } from '../../utils/constants';
import './VetProfile.css';

const VetProfileModal = ({ vet, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);

  if (!isOpen || !vet) return null;

  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null;
  const isOwner = currentUser && currentUser.userType === 'owner';

  const renderStars = (count) => {
    const max = 5;
    return Array.from({ length: max }).map((_, i) => (
      <Star key={i} size={16} className={i < count ? 'star-filled' : 'star-empty'} />
    ));
  };

  const handleLoadMore = () => {
    if (!vet || !vet.reviews) return;
    setVisibleReviews(prev => Math.min(prev + 2, vet.reviews.length));
  };

  const displayedReviews = showAllReviews ? (vet.reviews || []) : (vet.reviews || []).slice(0, visibleReviews);

  return (
    <div className="vet-profile-overlay" onClick={onClose}>
      <div className="vet-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="vet-profile-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-wrapper">
              <Avatar
                src={vet.avatar}
                name={vet.name}
                size="xl"
              />
            </div>
            <div className="profile-identity">
              <h1 className="vet-name">{vet.name} {vet.lastName}</h1>
              <p className="vet-specialty">{vet.specialty}</p> {/* change to specialties */}
              <div className="rating-section">
                <Star className="star-icon"/>
                <span className="rating-text">
                  {vet.rating ? vet.rating.toFixed(1) : 'N/A'} ({vet.reviewCount || 0} αξιολογήσεις)
                </span>
              </div>
            </div>
            {isOwner && (
              <button
                className="book-appointment-btn"
                onClick={() => {
                  onClose();
                  navigate(ROUTES.owner.appointments, { state: { vet } });
                }}
              >
                Κλείστε Ραντεβού
              </button>
            )}
          </div>
        </div>

        <div className="vet-profile-scroll-content">
          {/* Professional Details Section */}
          <div className="professional-details">
            <div className="details-grid">

              <div className="detail-item">
                <div className="detail-header">
                  <Hospital className="detail-icon" size={20} />
                  <h3>Όνομα Κλινικής/Ιατρείου</h3>
                </div>
                <p className="detail-content">{vet.clinicName}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <MapPin className="detail-icon" size={20} />
                  <h3>Διεύθυνση Ιατρείου</h3>
                </div>
                <p className="detail-content">{vet.clinicAddress}</p>
                <p className="detail-content">{vet.clinicCity}</p>
                <p className="detail-content">{vet.clinicPostalCode}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <Phone className="detail-icon" size={20} />
                  <h3>Στοιχεία Επικοινωνίας</h3>
                </div>
                <p className="detail-content">{vet.phone}</p>
                <p className="detail-content">{vet.email}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <GraduationCap className="detail-icon" size={20} />
                  <h3>Εκπαίδευση</h3>
                </div>
                <p className="detail-content">{vet.education || 'Δεν διατίθεται'}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <Briefcase className="detail-icon" size={20} />
                  <h3>Έτη Εμπειρίας</h3>
                </div>
                <p className="detail-content">{vet.experience || 'Δεν διατίθεται'}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <IdCard className="detail-icon" size={30} />
                  <h3>Αριθμός Άδειας Άσκησης Επαγγέλματος</h3>
                </div>
                <p className="detail-content">{vet.licenseNumber}</p>
              </div>

            </div>
          </div>

          {/* Biography Section */}
          <div className="biography-section">
            <h2 className="section-title">Βιογραφικό</h2>
            <p className="biography-content">{vet.biography}</p>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2 className="section-title">Κριτικές Πελατών</h2>
            <div className="reviews-list">
              {displayedReviews.map((review, idx) => (
                <div key={review.id || idx} className="review-card">
                  <div className="review-header">
                    <div className="review-stars">
                      {renderStars(review.rating || 0)}
                    </div>
                    <span className="review-author">{review.author}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
            {(!showAllReviews && vet.reviews && visibleReviews < vet.reviews.length) && (
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
    </div>
  );
};

export default VetProfileModal;