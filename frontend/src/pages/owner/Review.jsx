import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './Review.css';

const Review = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  // Mock appointment data - in real app, this would come from API
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`);
        if (response.ok) {
          const data = await response.json();
          // Transform to match local state needs if necessary, or use directly
          setAppointment({
            id: data.id,
            vet: data.vetName,
            vetId: data.vetId,
            pet: data.petName,
            date: data.date,
            service: data.serviceType
          });
        }
      } catch (err) {
        console.error("Error fetching appointment:", err);
      }
    };
    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  if (!appointment) return <div style={{ padding: '2rem' }}>Φόρτωση...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Παρακαλώ επιλέξτε βαθμολογία');
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const reviewData = {
        appointmentId,
        vetId: appointment?.vetId || 1, // Fallback if mock
        vetName: appointment.vet,
        ownerId: currentUser.id,
        ownerName: currentUser.name || currentUser.username,
        rating,
        comment,
        date: new Date().toLocaleDateString('el-GR'), // Format DD/MM/YYYY locally or ISO
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      console.log('Review submitted successfully');
      // Redirect back to appointments
      navigate(ROUTES.owner.appointments);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Σφάλμα κατά την υποβολή της αξιολόγησης.');
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.owner.appointments);
  };

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
                Το σχόλιο σας θα βοηθήσει άλλους ιδιοκτήτες κατοικιδίων
              </p>
            </div>

            <div className="owner-review__actions">
              <button
                type="button"
                className="owner-review__btn owner-review__btn--cancel"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="owner-review__btn owner-review__btn--submit"
              >
                ✓ Υποβολή Αξιολόγησης
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Review;
