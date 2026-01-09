import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Briefcase, GraduationCap, X } from 'lucide-react';
import Avatar from '../../components/common/Avatar';
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
              <h1 className="vet-name">{vet.name}</h1>
              <p className="vet-specialty">{vet.specialty}</p>
              <div className="rating-section">
                <div className="stars">
                  {renderStars(Math.floor(vet.rating || 0))}
                </div>
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
                  <MapPin className="detail-icon" size={20} />
                  <h3>Διεύθυνση Ιατρείου</h3>
                </div>
                <p className="detail-content">{vet.address}</p>
                <p className="detail-content">{vet.phone}</p>
              </div>

              <div className="detail-item">
                <div className="detail-header">
                  <Briefcase className="detail-icon" size={20} />
                  <h3>Εμπειρία</h3>
                </div>
                <p className="detail-content">{vet.experience || 'Δεν διατίθεται'}</p>
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
                  <Clock className="detail-icon" size={20} />
                  <h3>Ωράριο</h3>
                </div>
                <p className="detail-content">{vet.workingHours || 'Ελέγξτε τη διαθεσιμότητα'}</p>
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