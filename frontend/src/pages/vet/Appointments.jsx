import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List, ChevronLeft, ChevronRight, X, Check, Clock, ArrowLeft, UserRound, PawPrint, Stethoscope } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'list'
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(new Date()); // Current date
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'confirmed' | 'cancelled' }
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      petName: 'Μπάμπης',
      ownerName: 'Έλενα Γεωργίου',
      phone: '6912345678',
      species: 'Σκύλος',
      breed: 'Golden Retriever',
      date: '05/01/2026',
      time: '10:00 - 11:00',
      serviceType: 'Εμβολιασμός',
      status: 'pending',
      notes: 'Πρώτος εμβολιασμός'
    },
    {
      id: 2,
      petName: 'Λούνα',
      ownerName: 'Μαρία Παπαδοπούλου',
      phone: '6983696023',
      species: 'Γάτα',
      breed: 'Bombay',
      date: '06/01/2026',
      time: '16:00 - 17:00',
      serviceType: 'Εξέταση',
      status: 'confirmed',
      notes: '-'
    },
    {
      id: 3,
      petName: 'Ρόκκι',
      ownerName: 'Μαρία Αντωνίου',
      phone: '6910559295',
      species: 'Σκύλος',
      breed: 'Golden Retriever',
      date: '06/01/2026',
      time: '14:00 - 15:00',
      serviceType: 'Εμβολιασμός',
      status: 'pending',
      notes: ''
    },
    {
      id: 4,
      petName: 'Ρεξ',
      ownerName: 'Γιώργος Νικολόπουλος',
      phone: '6927406934',
      species: 'Σκύλος',
      breed: 'Τσοπανόσκυλο',
      date: '07/01/2026',
      time: '16:00 - 17:00',
      serviceType: 'Στείρωση',
      status: 'cancelled',
      notes: '-'
    },
    {
      id: 5,
      petName: 'Cookie',
      ownerName: 'Νικόλας Ανδρέου',
      phone: '6928503684',
      species: 'Γάτα',
      breed: 'Ασίας',
      date: '07/01/2026',
      time: '16:00 - 17:00',
      serviceType: 'Στείρωση',
      status: 'pending',
      notes: '-'
    },
    {
      id: 6,
      petName: 'Μάντοξ',
      ownerName: 'Παντελής Ιωάννου',
      phone: '6947505623',
      species: 'Σκύλος',
      breed: 'Μπουλντόγκ',
      date: '08/01/2026',
      time: '11:00 - 12:00',
      serviceType: 'Χειρουργείο',
      status: 'pending',
      notes: ''
    },
    {
      id: 7,
      petName: 'Λούις',
      ownerName: 'Άγγελος Κωνσταντίνου',
      phone: '6910396110',
      species: 'Σκύλος',
      breed: 'Μεγάλος Δανός',
      date: '09/01/2026',
      time: '09:30 - 10:30',
      serviceType: 'Γενική Εξέταση',
      status: 'confirmed',
      notes: ''
    },
    {
      id: 8,
      petName: 'Μαξίν',
      ownerName: 'Νικόλας Ανδρέου',
      phone: '6928503684',
      species: 'Γάτα',
      breed: 'Σιαμέζα',
      date: '10/01/2026',
      time: '10:30 - 11:30',
      serviceType: 'Θεραπεία',
      status: 'confirmed',
      notes: '3ο μέρος της θεραπείας'
    },
    {
      id: 9,
      petName: 'Μίνι',
      ownerName: 'Βασιλική Παναγιωτοπούλου',
      phone: '6950774027',
      species: 'Σκύλος',
      breed: 'Τσιουάουα',
      date: '11/01/2026',
      time: '13:00 - 14:00',
      serviceType: 'Οδοντιατρική',
      status: 'pending',
      notes: ''
    },
    {
      id: 10,
      petName: 'Φίφη',
      ownerName: 'Κατερίνα Εμμανουήλ',
      phone: '6947505623',
      species: 'Σκύλος',
      breed: 'Λαμπραντόρ',
      date: '10/01/2026',
      time: '15:00 - 16:00',
      serviceType: 'Γενική Εξέταση',
      status: 'pending',
      notes: ''
    },
    {
      id: 11,
      petName: 'Τσάρλυ',
      ownerName: 'Παναγίωτης Κωνσταντίνου',
      phone: '6947503957',
      species: 'Σκύλος',
      breed: 'Ροτβάιλερ',
      date: '05/01/2026',
      time: '16:00 - 17:00',
      serviceType: 'Εμβολιασμός',
      status: 'confirmed',
      notes: 'Εμβόλιο κατά της λύσσας'
    },
    {
      id: 12,
      petName: 'Μάγια',
      ownerName: 'Κάτια Σωτηρίου',
      phone: '6947229947',
      species: 'Σκύλος',
      breed: 'Poodle',
      date: '05/01/2026',
      time: '12:00 - 13:00',
      serviceType: 'Εμβολιασμός',
      status: 'confirmed',
      notes: 'Εμβόλιο κατά της λύσσας'
    }
  ]);

  // Auto-update confirmed appointments to completed if their time has passed
  useEffect(() => {
    const updatePastAppointments = () => {
      const now = new Date();
      const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setAppointments(prevAppointments =>
        prevAppointments.map(apt => {
          // Only update confirmed appointments
          if (apt.status !== 'confirmed') return apt;

          const aptDate = apt.date;
          const aptEndTime = apt.time.split(' - ')[1]; // Get end time (e.g., "11:00")

          // Parse date components
          const [aptDay, aptMonth, aptYear] = aptDate.split('/').map(Number);
          const aptDateObj = new Date(aptYear, aptMonth - 1, aptDay);
          const nowDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          // If appointment date is in the past, mark as completed
          if (aptDateObj < nowDateObj) {
            return { ...apt, status: 'completed' };
          }

          // If appointment date is today, check if end time has passed
          if (aptDate === currentDate && aptEndTime < currentTime) {
            return { ...apt, status: 'completed' };
          }

          return apt;
        })
      );
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
    let filtered = filterStatus === 'all' ? appointments : appointments.filter(apt => apt.status === filterStatus);
    
    // Sort by date and time (earliest first)
    return filtered.sort((a, b) => {
      // Parse dates (format: DD/MM/YYYY)
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      // Compare dates
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      
      // If dates are the same, compare by start time
      const timeA = a.time.split(' - ')[0]; // Get start time (e.g., "10:00")
      const timeB = b.time.split(' - ')[0];
      
      return timeA.localeCompare(timeB);
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
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const filteredAppointments = appointments.filter(apt => apt.date === dateStr);
    
    // Sort by time (earliest first)
    return filteredAppointments.sort((a, b) => {
      const timeA = a.time.split(' - ')[0]; // Get start time (e.g., "10:00")
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
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

  const handleConfirm = (appointmentId) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
      )
    );
    
    // Show confirmation notification
    setNotification('confirmed');
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide after 5 seconds
  };

  const handleReject = (appointmentId) => {
    // Show confirmation modal instead of rejecting immediately
    setAppointmentToReject(appointmentId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    // Show confirmation modal instead of rejecting immediately
    setAppointmentToReject(appointmentId);
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentToReject ? { ...apt, status: 'cancelled' } : apt
        apt.id === appointmentToReject ? { ...apt, status: 'cancelled' } : apt
      )
    );
    
    // Show cancellation notification
    setNotification('cancelled');
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide after 5 seconds

    // Close modals and reset
    setShowRejectModal(false);
    setAppointmentToReject(null);
    setSelectedAppointment(null); // Also close the detail modal
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

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

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
                              <div className="appointments__card-service">{apt.serviceType}</div>
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
                          <h4 className="appointments__day-card-name">{apt.ownerName}</h4>
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
                            <span>{apt.serviceType}</span>
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

            {/* Appointment Cards */}
            <div className="appointments__list-cards">
              {displayedAppointments.map(apt => (
                <div key={apt.id} className="appointments__list-card appointments__list-card--with-actions">
                  <div className="appointments__list-card-header">
                    <div>
                      <h4 className="appointments__list-pet-name">{apt.ownerName}</h4>
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
                      <span>{apt.date}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Ώρα:</span>
                      <span>{apt.time}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Υπηρεσία:</span>
                      <span>{apt.serviceType}</span>
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
                      <div>{selectedAppointment.date}</div>
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
                    <span>{selectedAppointment.serviceType}</span>
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
