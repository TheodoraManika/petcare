import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Calendar, Plus, Minus, Check } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import Pagination from '../../components/common/Pagination';
import BookingForm from '../../components/owner/BookingForm';
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
  const prefilledVet = location.state?.vet || null;
  const [isBookingExpanded, setIsBookingExpanded] = useState(!!prefilledVet);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

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

  // Mock data - in real app, this would come from API/database
  const activeAppointments = [
    {
      id: 1,
      vet: 'Δρ. Μαρία Παπαδοπούλου',
      pet: 'Μπάμπης',
      date: '15/11/2025',
      time: '10:00 - 11:00',
      service: 'Εμβολιασμός',
      status: 'confirmed',
    },
    {
      id: 2,
      vet: 'Δρ. Γιώργος Ιωάννου',
      pet: 'Μίνι',
      date: '20/11/2025',
      time: '14:00 - 15:00',
      service: 'Γενική εξέταση',
      status: 'pending',
    },
  ];

  const historyAppointments = [
    {
      id: 3,
      vet: 'Δρ. Ελένη Γεωργίου',
      pet: 'Μπάμπης',
      date: '05/11/2025',
      time: '11:00 - 12:00',
      service: 'Εμβολιασμός',
      status: 'completed',
      canReview: true,
    },
    {
      id: 4,
      vet: 'Δρ. Μαρία Παπαδοπούλου',
      pet: 'Μίνι',
      date: '01/11/2025',
      time: '16:00 - 17:00',
      service: 'Στείρωση',
      status: 'cancelled',
      canReview: false,
      cancellationMessage: 'Το ραντεβού ακυρώθηκε και δεν μπορεί να τροποποιηθεί.',
    },
  ];

  const appointments = activeTab === 'active' ? activeAppointments : historyAppointments;
  
  // Pagination logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.owner.dashboard }
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
    console.log('Cancel appointment:', appointmentId);
    // In real app, this would call an API to cancel the appointment
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
                vet={prefilledVet}
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
            Ιστορικά ({historyAppointments.length})
          </button>
        </div>

        <div className="owner-appointments__content">
          {displayedAppointments.map((appointment) => (
            <div key={appointment.id} className="owner-appointments__card">
              <div className="owner-appointments__card-header">
                <div className="owner-appointments__card-title">
                  <h3>{appointment.vet}</h3>
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
                <button
                  className="owner-appointments__review-btn"
                  onClick={() => handleReview(appointment.id)}
                >
                  Αξιολόγηση
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
      </div>
    </PageLayout>
  );
};

export default Appointments;
