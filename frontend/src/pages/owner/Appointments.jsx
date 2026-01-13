import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Calendar, Plus, Minus, Check, RotateCcw } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import BookingForm from '../../components/owner/BookingForm';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Appointments state
  const [activeTab, setActiveTab] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Booking form expanded state

  const locationStateVet = location.state?.vet || null;
  const [bookingVet, setBookingVet] = useState(locationStateVet);
  const [isBookingExpanded, setIsBookingExpanded] = useState(!!locationStateVet);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [notification, setNotification] = useState(null);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBookingSuccess = (message) => {
    setSuccessMessage(message);
    setIsBookingExpanded(false);
  };

  const handleBookingClose = () => {
    setIsBookingExpanded(false);
  };

  // State
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) return;
        const currentUser = JSON.parse(storedUser);

        // Fetch appointments with expanded pet and vet info
        // We fetching all and filtering clientside because json-server relationship filtering is limited
        const response = await fetch('http://localhost:5000/appointments?_expand=pet&_expand=vet');

        if (response.ok) {
          const allAppointments = await response.json();

          // Filter for appointments belonging to this owner's pets
          const ownerAppointments = allAppointments.filter(apt =>
            apt.pet && apt.pet.ownerId === currentUser.id
          );

          const active = [];
          const history = [];
          const now = new Date();

          ownerAppointments.forEach(apt => {
            const aptDate = new Date(apt.date); // Assuming ISO or parseable format. If DD/MM/YYYY, needs parsing
            // Parse DD/MM/YYYY
            const [day, month, year] = apt.date.includes('/') ? apt.date.split('/') : [0, 0, 0];
            const isPast = apt.date.includes('/')
              ? new Date(year, month - 1, day) < new Date(now.getFullYear(), now.getMonth(), now.getDate())
              : new Date(apt.date) < now;

            const formattedApt = {
              id: apt.id,
              vet: `Δρ. ${apt.vet?.name || ''} ${apt.vet?.lastName || ''}`,
              pet: apt.pet?.name || 'Άγνωστο',
              date: apt.date,
              time: apt.time,
              service: apt.reason || apt.service || 'Επίσκεψη', // 'reason' is in db.json, 'service' in mock
              status: apt.status,
              vetInfo: apt.vet,
              canReview: apt.status === 'completed',
              cancellationMessage: apt.cancellationMessage
            };

            if (apt.status === 'completed' || apt.status === 'cancelled' || isPast) {
              if (isPast && apt.status === 'confirmed') formattedApt.status = 'completed'; // Auto-complete
              history.push(formattedApt);
            } else {
              active.push(formattedApt);
            }
          });

          setActiveAppointments(active);
          setHistoryAppointments(history);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [successMessage]); // Refetch when booking success message appears

  const appointments = activeTab === 'active' ? activeAppointments : historyAppointments;

  // Pagination logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Επιβεβαιωμένο', class: 'confirmed' },
      pending: { label: 'Εκκρεμές', class: 'pending' },
      completed: { label: 'Ολοκληρωμένο', class: 'completed' },
      cancelled: { label: 'Ακυρωμένο', class: 'cancelled' },
    };

    const config = statusConfig[status];
    return (
      <span className={`owner-appointments__status owner-appointments__status--${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleReview = (appointmentId) => {
    navigate(`${ROUTES.owner.appointments}/${appointmentId}/review`);
  };

  const handleCancel = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // Find the appointment to cancel
    const appointmentToMove = activeAppointments.find(app => app.id === appointmentToCancel);

    if (appointmentToMove) {
      // Update the appointment status and add cancellation message
      const cancelledAppointment = {
        ...appointmentToMove,
        status: 'cancelled',
        canReview: false,
        cancellationMessage: 'Το ραντεβού ακυρώθηκε και δεν μπορεί να τροποποιηθεί.'
      };

      // Remove from active appointments
      setActiveAppointments(prev => prev.filter(app => app.id !== appointmentToCancel));

      // Add to history appointments
      setHistoryAppointments(prev => [cancelledAppointment, ...prev]);
    }

    setShowCancelModal(false);
    setAppointmentToCancel(null);

    // Show notification
    setNotification('cancelled');

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  };

  const handleRebook = (appointment) => {
    if (appointment.vetInfo) {
      setBookingVet(appointment.vetInfo);
      setIsBookingExpanded(true);
      // Scroll to booking form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn("No vet info available for rebooking");
      // Fallback: just open the form without vet
      setBookingVet(null);
      setIsBookingExpanded(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PageLayout variant="owner" title="Ραντεβού" breadcrumbs={breadcrumbItems}>
      <div className="owner-appointments">
        <div className="owner-appointments__header">
          <h1 className="owner-appointments__title">Τα Ραντεβού μου</h1>
          <p className="owner-appointments__subtitle">Διαχείριση και παρακολούθηση ραντεβού</p>
        </div>

        {successMessage && (
          <div className="owner-appointments__success">
            <Check size={18} />
            {successMessage}
          </div>
        )}

        {/* Booking Form Section */}
        <div className="owner-appointments__booking-section">
          <div
            className="owner-appointments__booking-header"
            onClick={() => setIsBookingExpanded(!isBookingExpanded)}
          >
            <div className="owner-appointments__booking-title">
              <Calendar size={20} />
              <h2>Κλείσιμο Νέου Ραντεβού</h2>
            </div>
            <button className="owner-appointments__expand-btn">
              {isBookingExpanded ? <Minus size={20} /> : <Plus size={20} />}
            </button>
          </div>

          {isBookingExpanded && (
            <div className="owner-appointments__booking-content">
              <BookingForm
                vet={bookingVet}
                onClose={handleBookingClose}
                onSuccess={handleBookingSuccess}
                inline={false}
                showVetSearch={true}
              />
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="owner-appointments__tabs">
          <button
            className={`owner-appointments__tab ${activeTab === 'active' ? 'owner-appointments__tab--active' : ''}`}
            onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
          >
            Ενεργά ({activeAppointments.length})
          </button>
          <button
            className={`owner-appointments__tab ${activeTab === 'history' ? 'owner-appointments__tab--active' : ''}`}
            onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
          >
            Ιστορικό ({historyAppointments.length})
          </button>
        </div>

        <div className="owner-appointments__content">
          {displayedAppointments.map((appointment) => (
            <div key={appointment.id} className="owner-appointments__card">
              <div className="owner-appointments__card-header">
                <div className="owner-appointments__card-title">

                  {getStatusBadge(appointment.status)}
                </div>
                {activeTab === 'active' && (
                  <button
                    className="owner-appointments__cancel-btn"
                    onClick={() => handleCancel(appointment.id)}
                    title="Ακύρωση ραντεβού"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <p className="owner-appointments__pet">Κατοικίδιο: {appointment.pet}</p>

              <div className="owner-appointments__details">
                <div className="owner-appointments__detail">
                  <span className="owner-appointments__detail-label">Ημερομηνία</span>
                  <span className="owner-appointments__detail-value">{appointment.date}</span>
                </div>
                <div className="owner-appointments__detail">
                  <span className="owner-appointments__detail-label">Ώρα</span>
                  <span className="owner-appointments__detail-value">{appointment.time}</span>
                </div>
                <div className="owner-appointments__detail">
                  <span className="owner-appointments__detail-label">Υπηρεσία</span>
                  <span className="owner-appointments__detail-value">{appointment.service}</span>
                </div>
              </div>

              {appointment.status === 'pending' && (
                <div className="owner-appointments__warning">
                  Αναμονή επιβεβαίωσης από τον κτηνίατρο. Θα ενημερωθείτε σύντομα.
                </div>
              )}

              {appointment.status === 'cancelled' && appointment.cancellationMessage && (
                <div className="owner-appointments__error">
                  <X size={16} /> {appointment.cancellationMessage}
                </div>
              )}

              {appointment.canReview && (
                <div className="owner-appointments__actions-row">
                  <button
                    className="owner-appointments__review-btn"
                    onClick={() => handleReview(appointment.id)}
                  >
                    Αξιολόγηση
                  </button>
                  <button
                    className="owner-appointments__rebook-btn"
                    onClick={() => handleRebook(appointment)}
                  >
                    <RotateCcw size={16} />
                    Ξανακλείστε Ραντεβού
                  </button>
                </div>
              )}

              {!appointment.canReview && (activeTab === 'history') && (
                <button
                  className="owner-appointments__rebook-btn owner-appointments__rebook-btn--full"
                  onClick={() => handleRebook(appointment)}
                >
                  <RotateCcw size={16} />
                  Ξανακλείστε Ραντεβού
                </button>
              )}
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="owner"
        />

        {/* Cancel Confirmation Modal */}
        <ConfirmModal
          isOpen={showCancelModal}
          title="Είστε σίγουροι ότι θέλετε να ακυρώσετε αυτό το ραντεβού;"
          description="Αυτή η ενέργεια δεν αναιρείται."
          cancelText="Όχι, επιστροφή"
          confirmText="Ναι, ακύρωση"
          onCancel={handleCancelCancel}
          onConfirm={handleConfirmCancel}
          isDanger={true}
        />

        {/* Notification */}
        <Notification
          isVisible={notification !== null}
          message="Το ραντεβού ακυρώθηκε με επιτυχία!"
          type="error"
        />
      </div>
    </PageLayout>
  );
};

export default Appointments;
