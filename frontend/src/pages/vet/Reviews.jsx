import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './Reviews.css';

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Mock data - Replace with actual data from backend
  const reviews = [
    {
      id: 1,
      name: 'Μαρία Κ.',
      date: '05/11/2025',
      rating: 5,
      comment: 'Εξαιρετική επαγγελματίας! Έδωσε μεγάλη προσοχή στο κατοικίδιό μου.'
    },
    {
      id: 2,
      name: 'Γεώργιος Π.',
      date: '01/11/2025',
      rating: 4,
      comment: 'Πολύ καλή κτηνίατρος, με μεγάλη εμπειρία. Συνιστώ ανεπιφύλακτα!'
    },
    {
      id: 3,
      name: 'Ελένη Λ.',
      date: '28/10/2025',
      rating: 5,
      comment: 'Άριστη εξυπηρέτηση και πολύ προσεγμένη δουλειά. Ευχαριστώ!'
    },
    {
      id: 4,
      name: 'Νίκος Α.',
      date: '20/10/2025',
      rating: 5,
      comment: 'Πολύ καλή συνεργασία, η γάτα μου έγινε καλά χάρη στη βοήθεια σας!'
    },
  ];

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'review-card__star--filled' : 'review-card__star--empty'}
        fill={index < rating ? '#FFA500' : 'none'}
        stroke={index < rating ? '#FFA500' : '#d1d5db'}
      />
    ));
  };

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

  return (
    <PageLayout title="Αξιολογήσεις" breadcrumbs={breadcrumbItems}>
      <div className="reviews">
        <div className="reviews__header">
          <h1 className="reviews__title">Αξιολογήσεις Πελατών</h1>
          <p className="reviews__subtitle">Προβολή των αξιολογήσεων που έχετε λάβει</p>
        </div>

        {/* Average Rating Card */}
        <div className="reviews__average">
          <Star size={32} className="reviews__average-icon" fill="#FFA500" stroke="#FFA500" />
          <span className="reviews__average-rating">{averageRating}</span>
          <p className="reviews__average-text">Μέσος Όρος από {reviews.length} αξιολογήσεις</p>
        </div>

        {/* Reviews List */}
        <div className="reviews__list">
          {currentReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__name">{review.name}</span>
                <div className="review-card__stars">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-card__date">{review.date}</div>
              <p className="review-card__comment">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="reviews__pagination">
          <button
            className="reviews__pagination-btn reviews__pagination-btn--prev"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            <span>Προηγούμενη</span>
          </button>
          <span className="reviews__pagination-info">
            Σελίδα {currentPage} από {totalPages}
          </span>
          <button
            className="reviews__pagination-btn reviews__pagination-btn--next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <span>Επόμενη</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reviews;
