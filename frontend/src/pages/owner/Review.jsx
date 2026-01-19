import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './Review.css';

const Review = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch appointment and vet data
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        
        // Fetch appointment details
        const aptResponse = await fetch(`http://localhost:5000/appointments/${appointmentId}`);
        if (!aptResponse.ok) throw new Error('Failed to fetch appointment');
        const apt = await aptResponse.json();
        
        // Fetch vet details
        let vetName = 'Άγνωστος';
        try {
          const vetResponse = await fetch(`http://localhost:5000/users/${apt.vetId}`);
          if (vetResponse.ok) {
            const vet = await vetResponse.json();
            vetName = `${vet.name} ${vet.lastName}`;
          }
        } catch (err) {
          console.error('Error fetching vet details:', err);
        }
        
        // Fetch pet details if needed
        let petName = apt.petName || 'Άγνωστο';
        try {
          if (apt.petId) {
            const petResponse = await fetch(`http://localhost:5000/pets/${apt.petId}`);
            if (petResponse.ok) {
              const pet = await petResponse.json();
              petName = pet.name || petName;
            }
          }
        } catch (err) {
          console.error('Error fetching pet details:', err);
        }
        
        setAppointment({
          id: apt.id,
          vet: vetName,
          vetId: apt.vetId,
          pet: petName,
          date: apt.date || new Date().toLocaleDateString('el-GR'),
          service: apt.serviceType || 'Υπηρεσία',
          ownerId: apt.ownerId
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching appointment data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return; // Button should be disabled, but double check
    }

    try {
      // Prepare review data
      const reviewData = {
        appointmentId,
        vetId: appointment.vetId,
        ownerId: appointment.ownerId,
        rating,
        comment,
        reviewedAt: new Date().toISOString()
      };

      // Submit review to backend
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Η αξιολόγηση υποβλήθηκε με επιτυχία!'
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.owner.appointments);
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setNotification({
        type: 'error',
        message: 'Σφάλμα κατά την υποβολή της αξιολόγησης. Παρακαλώ προσπαθήστε ξανά.'
      });
      
      // Clear error notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setNotification({
      type: 'cancelled',
      message: 'Η αξιολόγηση ακυρώθηκε'
    });

    // Redirect after showing notification
    setTimeout(() => {
      navigate(ROUTES.owner.appointments);
    }, 1500);
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <PageLayout variant="owner" title="Αξιολόγηση" breadcrumbs={[]}>
        <div className="owner-review">
          <div className="owner-review__content">
            <p>Φόρτωση δεδομένων αξιολόγησης...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !appointment) {
    return (
      <PageLayout variant="owner" title="Σφάλμα" breadcrumbs={[]}>
        <div className="owner-review">
          <div className="owner-review__content">
            <p style={{ color: '#d32f2f' }}>Σφάλμα: {error || 'Δεν ήταν δυνατή η φόρτωση των δεδομένων αξιολόγησης'}</p>
            <button 
              onClick={() => navigate(ROUTES.owner.appointments)}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Επιστροφή
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const breadcrumbItems = [
    { label: 'Ραντεβού', path: ROUTES.owner.appointments },
    { label: `Δρ. ${appointment.vet}`, path: ROUTES.owner.appointments }
  ];

  return (
    <PageLayout variant="owner" title="Αξιολόγηση" breadcrumbs={breadcrumbItems}>
      <div className="owner-review">

        <div className="owner-review__content">
          <h1 className="owner-review__title">Αξιολόγηση Κτηνιάτρου</h1>

          <div className="owner-review__appointment-card">
            <div className="owner-review__appointment-header">
              <span className="owner-review__label">Στοιχεία Ραντεβού</span>
            </div>
            <div className="owner-review__appointment-details">
              <div className="owner-review__appointment-row">
                <span className="owner-review__appointment-label">Κτηνίατρος</span>
                <span className="owner-review__appointment-value">Δρ. {appointment.vet}</span>
              </div>
              <div className="owner-review__appointment-row">
                <span className="owner-review__appointment-label">Κατοικίδιο</span>
                <span className="owner-review__appointment-value">{appointment.pet}</span>
              </div>
              <div className="owner-review__appointment-row">
                <span className="owner-review__appointment-label">Ημερομηνία</span>
                <span className="owner-review__appointment-value">{appointment.date}</span>
              </div>
              <div className="owner-review__appointment-row">
                <span className="owner-review__appointment-label">Υπηρεσία</span>
                <span className="owner-review__appointment-value">{appointment.service}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="owner-review__form">
            <div className="owner-review__field">
              <label className="owner-review__field-label">
                Βαθμολογία <span className="owner-review__required">*</span>
              </label>
              <div className="owner-review__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="owner-review__star"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      fill={star <= (hoveredRating || rating) ? '#fbbf24' : 'none'}
                      color={star <= (hoveredRating || rating) ? '#fbbf24' : '#d1d5db'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="owner-review__field">
              <label className="owner-review__field-label" htmlFor="comment">
                Σχόλιο
              </label>
              <textarea
                id="comment"
                className="owner-review__textarea"
                placeholder="Μοιραστείτε την εμπειρία σας με τον κτηνίατρο..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
              />
              <p className="owner-review__field-hint">
                Το σχόλιο σας θα βοηθήσει άλλους ιδιοκτήτες κατοικιδίων να επιλέξουν τον κατάλληλο κτηνίατρο
              </p>
            </div>

            <div className="owner-review__actions">
              <button
                type="button"
                className="owner-review__btn owner-review__btn--cancel"
                onClick={handleCancelClick}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="owner-review__btn owner-review__btn--submit"
                disabled={rating === 0}
                style={{
                  opacity: rating === 0 ? 0.5 : 1,
                  cursor: rating === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Υποβολή Αξιολόγησης
              </button>
            </div>
          </form>
        </div>

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε;"
          description="Η αξιολόγηση δεν θα αποθηκευτεί."
          cancelText="Όχι, επιστροφή"
          confirmText="Ναι, ακύρωση"
          onCancel={handleCancelModalClose}
          onConfirm={handleConfirmCancel}
          isDanger={true}
        />

        {/* Notification */}
        {notification && (
          <Notification
            isVisible={true}
            message={notification.message}
            type={notification.type}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Review;
