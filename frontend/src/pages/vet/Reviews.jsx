import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES } from '../../utils/constants';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const reviewsPerPage = 4;

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || currentUser.id === undefined) {
        setLoading(false);
        return;
      }

      // Fetch reviews and users
      const [reviewsResponse, usersResponse] = await Promise.all([
        fetch(`http://localhost:5000/reviews?vetId=${currentUser.id}`),
        fetch('http://localhost:5000/users')
      ]);

      if (reviewsResponse.ok && usersResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        const usersData = await usersResponse.json();

        // Enrich reviews with owner names
        const enrichedReviews = reviewsData.map(review => {
          const owner = usersData.find(u => String(u.id) === String(review.ownerId));
          return {
            ...review,
            ownerName: owner ? `${owner.name} ${owner.lastName}` : 'Ανώνυμος',
            date: review.reviewedAt
          };
        });

        setReviews(enrichedReviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average rating with 2 decimal precision
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2)
    : 0;

  // Sort reviews by date (most recent first)
  const sortedReviews = [...reviews].sort((a, b) => {
    // Parse dates (format: YYYY-MM-DD)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      // Handle ISO format (2026-01-18T19:32:34.514Z)
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('el-GR');
    } catch {
      return '-';
    }
  };

  const breadcrumbItems = [];

  if (loading) {
    return (
      <PageLayout title="Αξιολογήσεις" breadcrumbs={breadcrumbItems}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Φόρτωση αξιολογήσεων...</p>
        </div>
      </PageLayout>
    );
  }

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
                <span className="review-card__name">{review.ownerName}</span>
                <div className="review-card__stars">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="review-card__date">{formatDate(review.date)}</div>
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
