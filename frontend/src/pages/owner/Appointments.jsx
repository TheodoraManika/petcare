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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch appointments from database
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch(`http://localhost:5000/appointments?ownerId=${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        
        // Fetch vet details and pet details for each appointment
        const appointmentsWithDetails = await Promise.all(
          data.map(async (apt) => {
            let aptWithDetails = { ...apt };
            
            try {
              const vetResponse = await fetch(`http://localhost:5000/users/${apt.vetId}`);
              if (vetResponse.ok) {
                const vet = await vetResponse.json();
                aptWithDetails.vetName = `${vet.name} ${vet.lastName}`;
                aptWithDetails.clinicName = vet.clinicName || 'Κλινική';
                aptWithDetails.vetId = vet.id;
              }
            } catch (err) {
              console.error('Error fetching vet details:', err);
            }
            
            // Fetch pet details if petName is missing
            if (!apt.petName && apt.petId) {
              try {
                const petResponse = await fetch(`http://localhost:5000/pets/${apt.petId}`);
                if (petResponse.ok) {
                  const pet = await petResponse.json();
                  aptWithDetails.petName = pet.name || pet.petName || '';
                  aptWithDetails.petSpecies = pet.type || pet.petSpecies || '';
                }
              } catch (err) {
                console.error('Error fetching pet details:', err);
              }
            }
            
            // Add canReview flag for completed appointments
            aptWithDetails.canReview = apt.status === 'completed';
            
            return aptWithDetails;
          })
        );
        
        setAppointments(appointmentsWithDetails);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Auto-update confirmed/pending appointments to completed if their date has passed
  useEffect(() => {
    const updatePastAppointments = async () => {
      setAppointments(prevAppointments => {
        const updated = prevAppointments.map(apt => {
          // Only update confirmed or pending appointments
          if (apt.status === 'completed' || apt.status === 'cancelled') return apt;

          const aptDate = new Date(apt.date);
          const nowDateObj = new Date();
          nowDateObj.setHours(0, 0, 0, 0);
          aptDate.setHours(0, 0, 0, 0);

          // If appointment date is in the past, mark as completed
          if (aptDate < nowDateObj) {
            // Persist the status change to the backend
            fetch(`http://localhost:5000/appointments/${apt.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'completed' })
            }).catch(err => console.error('Error updating appointment status:', err));

            return { ...apt, status: 'completed' };
          }

          return apt;
        });

        return updated;
      });
    };

    // Run on component mount
    updatePastAppointments();

    // Run every minute to keep checking
    const interval = setInterval(updatePastAppointments, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleBookingSuccess = (message) => {
    setSuccessMessage(message);
    setIsBookingExpanded(false);
    // Refetch appointments after booking
    const fetchAppointments = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch(`http://localhost:5000/appointments?ownerId=${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        
        // Fetch vet details and pet details for each appointment
        const appointmentsWithDetails = await Promise.all(
          data.map(async (apt) => {
            let aptWithDetails = { ...apt };
            
            try {
              const vetResponse = await fetch(`http://localhost:5000/users/${apt.vetId}`);
              if (vetResponse.ok) {
                const vet = await vetResponse.json();
                aptWithDetails.vetName = `${vet.name} ${vet.lastName}`;
                aptWithDetails.clinicName = vet.clinicName || 'Κλινική';
                aptWithDetails.vetId = vet.id;
              }
            } catch (err) {
              console.error('Error fetching vet details:', err);
            }
            
            // Fetch pet details if petName is missing
            if (!apt.petName && apt.petId) {
              try {
                const petResponse = await fetch(`http://localhost:5000/pets/${apt.petId}`);
                if (petResponse.ok) {
                  const pet = await petResponse.json();
                  aptWithDetails.petName = pet.name || pet.petName || '';
                  aptWithDetails.petSpecies = pet.type || pet.petSpecies || '';
                }
              } catch (err) {
                console.error('Error fetching pet details:', err);
              }
            }
            
            // Add canReview flag for completed appointments
            aptWithDetails.canReview = apt.status === 'completed';
            
            return aptWithDetails;
          })
        );
        
        setAppointments(appointmentsWithDetails);
      } catch (err) {
        console.error('Error refetching appointments:', err);
      }
    };
    fetchAppointments();
  };

  const handleBookingClose = () => {
    setIsBookingExpanded(false);
  };

  // Separate appointments into active and history based on date and status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeAppointmentsData = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate >= today && apt.status !== 'cancelled';
  });

  const historyAppointmentsData = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate < today || apt.status === 'cancelled';
  });

  const displayAppointments = activeTab === 'active' ? activeAppointmentsData : historyAppointmentsData;

  // Pagination logic
  const totalPages = Math.ceil(displayAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAppointments = displayAppointments.slice(startIndex, startIndex + itemsPerPage);

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

  const handleConfirmCancel = async () => {
    try {
      // Get appointment data to get vet info
      const appointment = appointments.find(apt => apt.id === appointmentToCancel);
      
      // Update appointment status in database
      const response = await fetch(`http://localhost:5000/appointments/${appointmentToCancel}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        // Create notification for vet
        if (appointment) {
          const vetNotificationData = {
            userId: appointment.vetId,
            userType: 'vet',
            type: 'appointment_cancelled_by_owner',
            title: 'Ακύρωση ραντεβού',
            data: {
              ownerName: appointment.ownerName || 'Ο ιδιοκτήτης',
              appointmentDate: appointment.date,
              appointmentTime: appointment.time,
              petName: appointment.petName,
              appointmentId: appointmentToCancel
            },
            date: new Date().toISOString(),
            read: false,
            createdAt: new Date().toISOString()
          };

          await fetch('http://localhost:5000/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vetNotificationData)
          }).catch(err => console.error('Error creating vet notification:', err));

          // Trigger immediate notification badge update
          window.dispatchEvent(new Event('notificationCreated'));
        }

        // Refetch appointments
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const appointmentsResponse = await fetch(`http://localhost:5000/appointments?ownerId=${currentUser.id}`);
        const data = await appointmentsResponse.json();
        
        // Fetch vet details and pet details for each appointment
        const appointmentsWithDetails = await Promise.all(
          data.map(async (apt) => {
            let aptWithDetails = { ...apt };
            
            try {
              const vetResponse = await fetch(`http://localhost:5000/users/${apt.vetId}`);
              if (vetResponse.ok) {
                const vet = await vetResponse.json();
                aptWithDetails.vetName = `${vet.name} ${vet.lastName}`;
                aptWithDetails.clinicName = vet.clinicName || 'Κλινική';
              }
            } catch (err) {
              console.error('Error fetching vet details:', err);
            }
            
            // Fetch pet details if petName is missing
            if (!apt.petName && apt.petId) {
              try {
                const petResponse = await fetch(`http://localhost:5000/pets/${apt.petId}`);
                if (petResponse.ok) {
                  const pet = await petResponse.json();
                  aptWithDetails.petName = pet.name || pet.petName || '';
                  aptWithDetails.petSpecies = pet.type || pet.petSpecies || '';
                }
              } catch (err) {
                console.error('Error fetching pet details:', err);
              }
            }
            
            return aptWithDetails;
          })
        );
        
        setAppointments(appointmentsWithDetails);
        setNotification('cancel_success');
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
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

  if (loading) {
    return (
      <PageLayout variant="owner" title="Ραντεβού" breadcrumbs={breadcrumbItems}>
        <div className="owner-appointments">
          <p>Φόρτωση ραντεβού...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout variant="owner" title="Ραντεβού" breadcrumbs={breadcrumbItems}>
        <div className="owner-appointments">
          <p>Σφάλμα κατά τη φόρτωση: {error}</p>
        </div>
      </PageLayout>
    );
  }

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
            Ενεργά ({activeAppointmentsData.length})
          </button>
          <button
            className={`owner-appointments__tab ${activeTab === 'history' ? 'owner-appointments__tab--active' : ''}`}
            onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
          >
            Ιστορικό ({historyAppointmentsData.length})
          </button>
        </div>

        <div className="owner-appointments__content">
          {displayedAppointments.map((appointment) => (
            <div key={appointment.id} className="owner-appointments__card">
              <div className="owner-appointments__card-header">
                <div className="owner-appointments__card-title">

                  {getStatusBadge(appointment.status)}
                </div>
                {activeTab === 'active' && appointment.status !== 'cancelled' && (
                  <button
                    className="owner-appointments__cancel-btn"
                    onClick={() => handleCancel(appointment.id)}
                    title="Ακύρωση ραντεβού"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <p className="owner-appointments__pet">Κατοικίδιο: {appointment.petName} ({appointment.petSpecies})</p>

              <div className="owner-appointments__details">
                <div className="owner-appointments__detail">
                  <span className="owner-appointments__detail-label">Κτηνίατρος</span>
                  <span className="owner-appointments__detail-value">{appointment.vetName || '-'}</span>
                </div>
                <div className="owner-appointments__detail">
                  <span className="owner-appointments__detail-label">Κλινική</span>
                  <span className="owner-appointments__detail-value">{appointment.clinicName || '-'}</span>
                </div>
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
                  <span className="owner-appointments__detail-value">{appointment.serviceType}</span>
                </div>
                {appointment.notes && (
                  <div className="owner-appointments__detail">
                    <span className="owner-appointments__detail-label">Σημειώσεις</span>
                    <span className="owner-appointments__detail-value">{appointment.notes}</span>
                  </div>
                )}
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
