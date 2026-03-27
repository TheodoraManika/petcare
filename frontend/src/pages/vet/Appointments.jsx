import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, List, ChevronLeft, ChevronRight, X, Check, Clock, ArrowLeft, UserRound, PawPrint, Stethoscope } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import Notification from '../../components/common/modals/Notification';
import CustomSelect from '../../components/common/forms/CustomSelect';
import { ROUTES, SERVICE_LABELS, formatDate } from '../../utils/constants';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'calendar'); // 'calendar' or 'list'
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(new Date()); // Current date
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'confirmed' | 'cancelled' }
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Fetch appointments from database
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch(`http://localhost:5000/appointments?vetId=${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await response.json();

        // Enrich appointments with pet and owner details
        const enrichedAppointments = await Promise.all(
          appointmentsData.map(async (apt) => {
            try {
              let petName = apt.petName;
              let species = apt.petSpecies;
              let breed = apt.petBreed;

              // Fetch pet details from pets collection using petId
              if (apt.petId) {
                try {
                  const petRes = await fetch(`http://localhost:5000/pets/${apt.petId}`);
                  if (petRes.ok) {
                    const petData = await petRes.json();
                    petName = petData.name || petName || '-';
                    species = petData.type || species || '-';
                    breed = petData.breed || breed || '-';
                  }
                } catch (err) {
                  console.error('Error fetching pet details:', err);
                }
              }

              // Fetch owner details if not already in appointment
              let ownerName = apt.ownerName;
              let ownerLastName = apt.ownerLastName;
              let phone = apt.ownerPhone || apt.phone;

              if (!ownerName || !phone) {
                try {
                  const ownerRes = await fetch(`http://localhost:5000/users/${apt.ownerId}`);
                  if (ownerRes.ok) {
                    const ownerData = await ownerRes.json();
                    ownerName = ownerName || ownerData.name || ownerData.username || '-';
                    ownerLastName = ownerData.lastName || '-';
                    phone = phone || ownerData.phone || '-';
                  }
                } catch (err) {
                  console.error('Error fetching owner details:', err);
                }
              }

              return {
                ...apt,
                petName: petName || '-',
                species: species || '-',
                breed: breed || '-',
                ownerName: ownerName || '-',
                ownerLastName: ownerLastName || '-',
                phone: phone || '-',
                notes: apt.notes || ''
              };
            } catch (err) {
              console.error('Error enriching appointment data:', err);
              return {
                ...apt,
                petName: apt.petName || '-',
                species: apt.petSpecies || '-',
                breed: apt.petBreed || '-',
                notes: apt.notes || ''
              };
            }
          })
        );

        setAppointments(enrichedAppointments);
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

  // Handle deep linking to specific appointment from notifications
  useEffect(() => {
    if (location.state?.appointmentId && !loading && appointments.length > 0) {
      const apt = appointments.find(a => String(a.id) === String(location.state.appointmentId));
      if (apt) {
        setSelectedAppointment(apt);
        // Clear the navigation state to prevent reopening
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, loading, appointments]);

  // Auto-update confirmed appointments to completed if their time has passed
  useEffect(() => {
    const updatePastAppointments = async () => {
      const now = new Date();

      setAppointments(prevAppointments => {
        const updated = prevAppointments.map(apt => {
          // Only update confirmed or pending appointments that aren't already completed/cancelled
          if (apt.status === 'completed' || apt.status === 'cancelled') return apt;

          // Parse appointment date - handle both formats: DD/MM/YYYY and YYYY-MM-DD
          let aptDate;
          if (apt.date.includes('/')) {
            // DD/MM/YYYY format
            const [day, month, year] = apt.date.split('/').map(Number);
            aptDate = new Date(year, month - 1, day);
          } else {
            // YYYY-MM-DD format
            aptDate = new Date(apt.date);
          }

          // Parse appointment end time
          let aptEndTime = null;
          if (apt.time && apt.time.includes('-')) {
            const endTimeStr = apt.time.split('-')[1].trim(); // Get "10:00" from "09:00 - 10:00"
            const [hours, minutes] = endTimeStr.split(':').map(Number);
            aptDate.setHours(hours, minutes, 0, 0);
            aptEndTime = aptDate;
          } else {
            // If no end time, assume appointment lasts 1 hour
            aptDate.setHours(23, 59, 59, 999); // End of day
            aptEndTime = aptDate;
          }

          // If appointment has passed (date + end time is in the past), mark as completed
          if (aptEndTime && aptEndTime < now) {
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

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: 'Εκκρεμές',
      confirmed: 'Επιβεβαιωμένο',
      completed: 'Ολοκληρωμένο',
      cancelled: 'Ακυρωμένο'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `appointments__status appointments__status--${status}`;
  };

  const filterAppointments = () => {
    const filtered = filterStatus === 'all'
      ? [...appointments]
      : appointments.filter(apt => apt.status === filterStatus);

    const getAppointmentStart = (apt) => {
      let dateObj;
      if (apt.date && apt.date.includes('/')) {
        const [day, month, year] = apt.date.split('/').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(apt.date);
      }

      const timeStr = apt.time?.split(' - ')[0] || '00:00';
      const [hours, minutes] = timeStr.split(':').map(Number);
      dateObj.setHours(hours || 0, minutes || 0, 0, 0);
      return dateObj;
    };

    return filtered.sort((a, b) => {
      const dateA = getAppointmentStart(a).getTime();
      const dateB = getAppointmentStart(b).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  // Pagination logic for list view
  const filteredListAppointments = filterAppointments();
  const totalPages = Math.ceil(filteredListAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAppointments = filteredListAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getWeekDays = () => {
    const days = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    // Convert date to YYYY-MM-DD format to match database storage
    const dateStr = date.toISOString().split('T')[0];
    const filteredAppointments = appointments.filter(apt => apt.date === dateStr);

    // Sort by time (earliest first)
    return filteredAppointments.sort((a, b) => {
      const timeA = a.time.split(':')[0]; // Get hour
      const timeB = b.time.split(':')[0];
      return parseInt(timeA) - parseInt(timeB);
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    const daysToSubtract = viewMode === 'day' ? 1 : 7;
    newDate.setDate(selectedDate.getDate() - daysToSubtract);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    const daysToAdd = viewMode === 'day' ? 1 : 7;
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  const handleConfirm = async (appointmentId) => {
    try {
      // Get appointment data
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      // Update in database
      const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      // Create notification for owner
      const notificationData = {
        userId: appointment.ownerId,
        userType: 'owner',
        type: 'appointment_approved',
        title: 'Το ραντεβού σας εγκρίθηκε',
        data: {
          vetName: `${appointment.vetName || 'Ο κτηνίατρος'}`,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          petName: appointment.petName,
          appointmentId: appointmentId
        },
        date: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString()
      };

      await fetch('http://localhost:5000/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      }).catch(err => console.error('Error creating notification:', err));

      // Trigger immediate notification badge update
      window.dispatchEvent(new Event('notificationCreated'));

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
        )
      );

      // Show confirmation notification
      setNotification('confirmed');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setNotification(null);
    }
  };

  const handleReject = (appointmentId) => {
    // Show confirmation modal instead of rejecting immediately
    setAppointmentToReject(appointmentId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    try {
      // Get appointment data
      const appointment = appointments.find(apt => apt.id === appointmentToReject);
      if (!appointment) return;

      // Update in database
      const response = await fetch(`http://localhost:5000/appointments/${appointmentToReject}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      // Create notification for owner
      const notificationData = {
        userId: appointment.ownerId,
        userType: 'owner',
        type: 'appointment_cancelled',
        title: 'Το ραντεβού σας ακυρώθηκε',
        data: {
          vetName: `${appointment.vetName || 'Ο κτηνίατρος'}`,
          appointmentDate: appointment.date,
          appointmentTime: appointment.time,
          petName: appointment.petName,
          appointmentId: appointmentToReject
        },
        date: new Date().toISOString(),
        read: false,
        createdAt: new Date().toISOString()
      };

      await fetch('http://localhost:5000/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      }).catch(err => console.error('Error creating notification:', err));

      // Trigger immediate notification badge update
      window.dispatchEvent(new Event('notificationCreated'));

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === appointmentToReject ? { ...apt, status: 'cancelled' } : apt
        )
      );

      // Show cancellation notification
      setNotification('cancelled');
      setTimeout(() => {
        setNotification(null);
      }, 5000);

      // Close modals and reset
      setShowRejectModal(false);
      setAppointmentToReject(null);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setNotification(null);
    }
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setAppointmentToReject(null);
    // Keep selectedAppointment modal open
  };

  const formatDateRange = () => {
    if (viewMode === 'day') {
      // Show only the selected date in day view
      return `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    }

    // Show week range in week view
    const weekDays = getWeekDays();
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.getDate()}/${firstDay.getMonth() + 1}/${firstDay.getFullYear()} - ${lastDay.getDate()}/${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`;
  };

  const getDayName = (date) => {
    const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
    return days[date.getDay()];
  };

  const getMonthName = (date) => {
    const months = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
      'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'];
    return months[date.getMonth()];
  };

  const breadcrumbItems = [];

  if (loading) {
    return (
      <PageLayout title="Διαχείριση Ραντεβού" breadcrumbs={breadcrumbItems}>
        <div className="appointments">
          <p>Φόρτωση ραντεβού...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Διαχείριση Ραντεβού" breadcrumbs={breadcrumbItems}>
        <div className="appointments">
          <p>Σφάλμα κατά τη φόρτωση: {error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Διαχείριση Ραντεβού" breadcrumbs={breadcrumbItems}>
      <div className="appointments">
        {/* Notification Banner */}
        <Notification
          isVisible={notification !== null}
          message={notification === 'confirmed'
            ? 'Το ραντεβού επιβεβαιώθηκε με επιτυχία! Ο ιδιοκτήτης έχει ενημερωθεί.'
            : 'Το ραντεβού ακυρώθηκε με επιτυχία! Ο ιδιοκτήτης έχει ενημερωθεί.'
          }
          type={notification === 'confirmed' ? 'success' : 'error'}
        />

        <div className="appointments__header">
          <h1 className="appointments__title">Τα Ραντεβού μου</h1>
          <p className="appointments__subtitle">Διαχείριση και παρακολούθηση ραντεβού</p>
        </div>

        {/* Tabs */}
        <div className="appointments__tabs">
          <button
            className={`appointments__tab ${activeTab === 'calendar' ? 'appointments__tab--active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={18} />
            Ημερολόγιο
          </button>
          <button
            className={`appointments__tab ${activeTab === 'list' ? 'appointments__tab--active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <List size={18} />
            Λίστα
          </button>
        </div>

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="appointments__calendar-view">
            {/* View Mode Toggle */}
            <div className="appointments__view-controls">
              <div className="appointments__view-buttons">
                <button
                  className={`appointments__view-btn ${viewMode === 'day' ? 'appointments__view-btn--active' : ''}`}
                  onClick={() => setViewMode('day')}
                >
                  Ημέρα
                </button>
                <button
                  className={`appointments__view-btn ${viewMode === 'week' ? 'appointments__view-btn--active' : ''}`}
                  onClick={() => setViewMode('week')}
                >
                  Εβδομάδα
                </button>
              </div>

              <div className="appointments__date-navigation">
                <button className="appointments__nav-btn" onClick={handlePreviousWeek}>
                  <ChevronLeft size={20} />
                </button>
                <span className="appointments__date-range">{formatDateRange()}</span>
                <button className="appointments__nav-btn" onClick={handleNextWeek}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Week Calendar */}
            {viewMode === 'week' && (
              <div className="appointments__week-calendar">
                {getWeekDays().map((day, index) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const currentDay = new Date(day);
                  currentDay.setHours(0, 0, 0, 0);

                  const isToday = currentDay.getTime() === today.getTime();
                  const isPast = currentDay < today;

                  return (
                    <div key={index} className="appointments__day-column">
                      <div className={`appointments__day-header ${isToday ? 'appointments__day-header--today' : ''} ${isPast ? 'appointments__day-header--past' : ''}`}>
                        <div className="appointments__day-name">{getDayName(day)}</div>
                        <div className="appointments__day-number">{day.getDate()}</div>
                      </div>

                      <div className="appointments__day-appointments">
                        {dayAppointments.length === 0 ? (
                          <div className="appointments__no-appointments">
                            Δεν υπάρχουν ραντεβού
                          </div>
                        ) : (
                          dayAppointments.map(apt => (
                            <div
                              key={apt.id}
                              className="appointments__calendar-card"
                              onClick={() => setSelectedAppointment(apt)}
                            >
                              <div className="appointments__card-time">
                                <Clock size={12} /> {apt.time}
                              </div>
                              <div className="appointments__card-pet">{apt.petName}</div>
                              <div className="appointments__card-service">{SERVICE_LABELS[apt.serviceType] || apt.serviceType}</div>
                              <div className={getStatusClass(apt.status)}>
                                {getStatusLabel(apt.status)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="appointments__day-view">
                <h3 className="appointments__day-title">
                  Ραντεβού για {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                </h3>
                <div className="appointments__day-cards">
                  {getAppointmentsForDate(selectedDate).map(apt => (
                    <div
                      key={apt.id}
                      className="appointments__day-card"
                    >
                      <div className="appointments__day-card-header">
                        <div className="appointments__day-card-owner">
                          <h4 className="appointments__day-card-name">{apt.ownerName} {apt.ownerLastName}</h4>
                          <p className="appointments__day-card-phone">Τηλέφωνο: {apt.phone}</p>
                        </div>
                        <div className="appointments__day-card-badge">
                          <div className={getStatusClass(apt.status)}>
                            {getStatusLabel(apt.status)}
                          </div>
                        </div>
                        <div className="appointments__day-card-actions">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                className="appointments__action-btn appointments__action-btn--reject"
                                onClick={() => handleReject(apt.id)}
                                title="Απόρριψη"
                              >
                                <X size={18} />
                              </button>
                              <button
                                className="appointments__action-btn appointments__action-btn--confirm"
                                onClick={() => handleConfirm(apt.id)}
                                title="Επιβεβαίωση"
                              >
                                <Check size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="appointments__day-card-body">
                        <div className="appointments__day-card-row">
                          <div className="appointments__day-card-field">
                            <span className="appointments__day-card-label">Όνομα Κατοικιδίου:</span>
                            <span>{apt.petName}</span>
                          </div>
                          <div className="appointments__day-card-field">
                            <span className="appointments__day-card-label">Είδος:</span>
                            <span>{apt.species}</span>
                          </div>
                          <div className="appointments__day-card-field">
                            <span className="appointments__day-card-label">Ράτσα:</span>
                            <span>{apt.breed}</span>
                          </div>
                        </div>
                      </div>

                      <div className="appointments__day-card-footer">
                        <div className="appointments__day-card-meta">
                          <div className="appointments__day-card-meta-item">
                            <span className="appointments__day-card-meta-label">Ώρα</span>
                            <span>{apt.time}</span>
                          </div>
                          <div className="appointments__day-card-meta-item">
                            <span className="appointments__day-card-meta-label">Υπηρεσία</span>
                            <span>{SERVICE_LABELS[apt.serviceType] || apt.serviceType}</span>
                          </div>
                          <div className="appointments__day-card-meta-item">
                            <span className="appointments__day-card-meta-label">Σημειώσεις</span>
                            <span>{apt.notes || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alert Banner */}
            <div className="appointments__alert">
              Πατήστε πάνω σε κάποιο ραντεβού για να δείτε τις λεπτομέρειές του, και να το εγκρίνετε ή απορρίψετε αν είναι εκκρεμές
            </div>
          </div>
        )}

        {/* List View */}
        {activeTab === 'list' && (
          <div className="appointments__list-view">
            {/* Filters */}
            <div className="appointments__filters">
              <div className="appointments__filters-left">
                <button
                  className={`appointments__filter ${filterStatus === 'all' ? 'appointments__filter--active' : ''}`}
                  onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
                >
                  Όλα
                </button>
                <button
                  className={`appointments__filter ${filterStatus === 'confirmed' ? 'appointments__filter--active' : ''}`}
                  onClick={() => { setFilterStatus('confirmed'); setCurrentPage(1); }}
                >
                  Επιβεβαιωμένα
                </button>
                <button
                  className={`appointments__filter ${filterStatus === 'pending' ? 'appointments__filter--active' : ''}`}
                  onClick={() => { setFilterStatus('pending'); setCurrentPage(1); }}
                >
                  Εκκρεμή
                </button>
                <button
                  className={`appointments__filter ${filterStatus === 'completed' ? 'appointments__filter--active' : ''}`}
                  onClick={() => { setFilterStatus('completed'); setCurrentPage(1); }}
                >
                  Ολοκληρωμένα
                </button>
                <button
                  className={`appointments__filter ${filterStatus === 'cancelled' ? 'appointments__filter--active' : ''}`}
                  onClick={() => { setFilterStatus('cancelled'); setCurrentPage(1); }}
                >
                  Ακυρωμένα
                </button>
              </div>
              <div className="appointments__filters-right">
                <span className="appointments__sort-label">Ταξινόμηση:</span>
                <div className="appointments__sort-control">
                  <CustomSelect
                    name="appointments-sort"
                    value={sortOrder}
                    onChange={(value) => { setSortOrder(value); setCurrentPage(1); }}
                    options={[
                      { value: 'desc', label: 'Πιο πρόσφατα' },
                      { value: 'asc', label: 'Παλαιότερα' }
                    ]}
                    variant="vet"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Cards */}
            <div className="appointments__list-cards">
              {displayedAppointments.map(apt => (
                <div key={apt.id} className="appointments__list-card appointments__list-card--with-actions">
                  <div className="appointments__list-card-header">
                    <div>
                      <h4 className="appointments__list-pet-name">{apt.ownerName} {apt.ownerLastName}</h4>
                      <p className="appointments__list-phone">Τηλέφωνο: {apt.phone}</p>
                    </div>
                    <div className="appointments__list-card-actions">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            className="appointments__action-btn appointments__action-btn--reject"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(apt.id);
                            }}
                            title="Απόρριψη"
                          >
                            <X size={18} />
                          </button>
                          <button
                            className="appointments__action-btn appointments__action-btn--confirm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirm(apt.id);
                            }}
                            title="Επιβεβαίωση"
                          >
                            <Check size={18} />
                          </button>
                        </>
                      )}
                      {apt.status !== 'pending' && (
                        <div className={getStatusClass(apt.status)}>
                          {getStatusLabel(apt.status)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="appointments__list-card-body">
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Όνομα Κατοικιδίου:</span>
                      <span>{apt.petName}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Είδος:</span>
                      <span>{apt.species}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Ράτσα:</span>
                      <span>{apt.breed}</span>
                    </div>
                  </div>

                  <div className="appointments__list-card-footer">
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Ημερομηνία:</span>
                      <span>{formatDate(apt.date)}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Ώρα:</span>
                      <span>{apt.time}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Υπηρεσία:</span>
                      <span>{SERVICE_LABELS[apt.serviceType] || apt.serviceType}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Σημειώσεις:</span>
                      <span>{apt.notes || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                variant="vet"
              />
            )}
          </div>
        )}

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <div className="appointments__modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="appointments__modal" onClick={(e) => e.stopPropagation()}>
              <div className="appointments__modal-header">
                <h3 className="appointments__modal-title">Λεπτομέρειες Ραντεβού</h3>
                <div className={getStatusClass(selectedAppointment.status)}>
                  {getStatusLabel(selectedAppointment.status)}
                </div>
              </div>

              <div className="appointments__modal-content">
                {/* Date and Time */}
                <div className="appointments__modal-datetime">
                  <div className="appointments__modal-date">
                    <Calendar size={16} color="#101828" />
                    <div>
                      <div>Ημερομηνία</div>
                      <div>{formatDate(selectedAppointment.date)}</div>
                    </div>
                  </div>
                  <div className="appointments__modal-time">
                    <Clock size={16} color="#101828" />
                    <div>
                      <div>Ώρα</div>
                      <div>{selectedAppointment.time}</div>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="appointments__modal-section">
                  <h4 className="appointments__modal-section-title"><UserRound size={16} color="#23CED9" /> Ιδιοκτήτης</h4>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Όνομα:</span>
                    <span>{selectedAppointment.ownerName}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Επίθετο:</span>
                    <span>{selectedAppointment.ownerLastName}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Τηλέφωνο:</span>
                    <span>{selectedAppointment.phone}</span>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="appointments__modal-section">
                  <h4 className="appointments__modal-section-title"><PawPrint size={16} color="#FCA47C" /> Κατοικίδιο</h4>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Όνομα:</span>
                    <span>{selectedAppointment.petName}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Είδος:</span>
                    <span>{selectedAppointment.species}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Ράτσα:</span>
                    <span>{selectedAppointment.breed}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="appointments__modal-section">
                  <h4 className="appointments__modal-section-title"><Stethoscope size={16} color="#F9D779" /> Υπηρεσία</h4>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Τύπος:</span>
                    <span>{SERVICE_LABELS[selectedAppointment.serviceType] || selectedAppointment.serviceType}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Σημειώσεις:</span>
                    <span>{selectedAppointment.notes || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="appointments__modal-actions">
                <button
                  className="appointments__modal-btn appointments__modal-btn--secondary"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <ArrowLeft size={18} />
                  Επιστροφή
                </button>
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      className="appointments__modal-btn appointments__modal-btn--reject"
                      onClick={() => {
                        handleReject(selectedAppointment.id);
                        // Don't close the modal - let the confirm modal appear on top
                      }}
                    >
                      <X size={18} />
                      Απόρριψη
                    </button>
                    <button
                      className="appointments__modal-btn appointments__modal-btn--confirm"
                      onClick={() => {
                        handleConfirm(selectedAppointment.id);
                        setSelectedAppointment(null);
                      }}
                    >
                      <Check size={18} />
                      Επιβεβαίωση
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="Είστε σίγουροι ότι θέλετε να απορρίψετε το ραντεβού;"
        description="Αυτή η ενέργεια δεν αναιρείται. Ο ιδιοκτήτης θα ενημερωθεί για την ακύρωση"
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, απόρριψη"
        onCancel={handleCancelReject}
        onConfirm={handleConfirmReject}
        isDanger={true}
      />
    </PageLayout>
  );
};

export default Appointments;
