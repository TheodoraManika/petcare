import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, IdCard, Briefcase, GraduationCap, X, Hospital } from 'lucide-react';
import Avatar from '../common/Avatar';
import { ROUTES, formatDate } from '../../utils/constants';
import './VetProfile.css';

const VetProfileModal = ({ vet, isOpen, onClose, onBook }) => {
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
    if (!vet || !Array.isArray(vet.reviews)) return;
    setVisibleReviews(prev => Math.min(prev + 2, vet.reviews.length));
  };

  const reviewsList = Array.isArray(vet.reviews) ? vet.reviews : [];
  const displayedReviews = showAllReviews ? reviewsList : reviewsList.slice(0, visibleReviews);

  const displayName = vet.lastName ? `${vet.name} ${vet.lastName}` : vet.name;

  // Calculate average rating from reviews if not provided
  let averageRating = vet.rating || 0;
  if (!vet.rating && reviewsList.length > 0) {
    averageRating = reviewsList.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviewsList.length;
  }

  // Map database fields to component expectations
  const vetSpec = vet.specialty || vet.specialization || 'Γενικός Κτηνίατρος';
  const vetClinicName = vet.clinicName || 'Δεν διατίθεται';
  const vetClinicAddress = vet.clinicAddress || 'Δεν διατίθεται';
  const vetClinicCity = vet.clinicCity || '';
  const vetClinicPostalCode = vet.clinicPostalCode || '';
  const vetPhone = vet.phone || 'Δεν διατίθεται';
  const vetEmail = vet.email || 'Δεν διατίθεται';
  const vetEducation = vet.education || 'Δεν διατίθεται';
  const vetExperience = vet.experience || 'Δεν διατίθεται';
  const vetLicenseNumber = vet.licenseNumber || 'Δεν διατίθεται';
  const vetBiography = vet.biography || 'Κανένα βιογραφικό διαθέσιμο';

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
                name={displayName}
                size="xl"
              />
            </div>
            <div className="profile-identity">
              <h1 className="vet-name">{displayName}</h1>
              <p className="vet-specialty">{vetSpec}</p> {/* change to specialties */}
              <div className="rating-section">
                <Star className="star-icon" />
                <span className="rating-text">
                  {averageRating ? averageRating.toFixed(1) : 'N/A'} ({vet.reviewCount || reviewsList.length || 0} αξιολογήσεις)
                </span>
              </div>
            </div>
            <button
              className="book-appointment-btn"
              onClick={() => {
                if (isOwner) {
                  onClose();
                  if (onBook) {
                    onBook(vet);
                  } else {
                    navigate(ROUTES.owner.appointments, { state: { vet } });
                  }
                } else {
                  navigate(ROUTES.login, { state: { from: window.location.pathname } });
                }
              }}
            >
              Κλείστε Ραντεβού
            </button>
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
                <p className="detail-content">{vetClinicName}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <MapPin className="detail-icon" size={20} />
                  <h3>Διεύθυνση Ιατρείου</h3>
                </div>
                <p className="detail-content">{vetClinicAddress}</p>
                {vetClinicCity && <p className="detail-content">{vetClinicCity}</p>}
                {vetClinicPostalCode && <p className="detail-content">{vetClinicPostalCode}</p>}
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <Phone className="detail-icon" size={20} />
                  <h3>Στοιχεία Επικοινωνίας</h3>
                </div>
                <p className="detail-content">{vetPhone}</p>
                <p className="detail-content">{vetEmail}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <GraduationCap className="detail-icon" size={20} />
                  <h3>Εκπαίδευση</h3>
                </div>
                <p className="detail-content">{vetEducation}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <Briefcase className="detail-icon" size={20} />
                  <h3>Έτη Εμπειρίας</h3>
                </div>
                <p className="detail-content">{vetExperience}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <IdCard className="detail-icon" size={30} />
                  <h3>Αριθμός Άδειας Άσκησης Επαγγέλματος</h3>
                </div>
                <p className="detail-content">{vetLicenseNumber}</p>
              </div>

            </div>
          </div>

          {/* Biography Section */}
          <div className="biography-section">
            <h2 className="section-title">Βιογραφικό</h2>
            <p className="biography-content">{vetBiography}</p>
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
                    <div className="review-meta">
                      <span className="review-author">{review.ownerName || review.author || 'Anonymous'}</span>
                      {review.reviewedAt && (
                        <span className="review-date">
                          {formatDate(review.reviewedAt)}
                        </span>
                      )}
                    </div>
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