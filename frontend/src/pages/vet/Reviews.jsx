import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES } from '../../utils/constants';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Mock data - Replace with actual data from backend
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const response = await fetch(`http://localhost:5000/reviews?vetId=${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Sort reviews by date (most recent first)
  const sortedReviews = [...reviews].sort((a, b) => {
    // Parse dates (format: DD/MM/YYYY)
    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
    const [dayB, monthB, yearB] = b.date.split('/').map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    // Sort descending (most recent first)
    return dateB - dateA;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const breadcrumbItems = [];

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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="vet"
        />
      </div>
    </PageLayout>
  );
};

export default Reviews;
