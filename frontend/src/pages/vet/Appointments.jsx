import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, List, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'list'
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 10, 25)); // Nov 25, 2025
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data
  const appointments = [
    {
      id: 1,
      petName: 'Μπάμπης',
      ownerName: 'Έλενα Γεωργίου',
      phone: '6912345678',
      species: 'Σκύλος',
      breed: 'Golden Retriever',
      date: '25/11/2025',
      time: '10:00 - 11:00',
      serviceType: 'Εμβολιασμός',
      status: 'pending',
      notes: 'Πρώτος εμβολιασμός'
    },
    {
      id: 2,
      petName: 'Μιχ',
      ownerName: 'Μαρία Παπαδοπούλου',
      phone: '6983696023',
      species: 'Γάτα',
      breed: 'Bombay',
      date: '25/11/2025',
      time: '16:00 - 17:00',
      serviceType: 'Εξέταση',
      status: 'confirmed',
      notes: '-'
    },
    {
      id: 3,
      petName: 'Μπάμπης',
      ownerName: 'Έλενα Γεωργίου',
      phone: '6912345678',
      species: 'Σκύλος',
      breed: 'Golden Retriever',
      date: '25/11/2025',
      time: '14:00',
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
      date: '08/11/2025',
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
      breed: 'Ασιάς',
      date: '01/11/2025',
      time: '16:00 - 17:00',
      serviceType: 'Στείρωση',
      status: 'completed',
      notes: '-'
    },
    {
      id: 6,
      petName: 'Μιν',
      ownerName: 'Παντελής Ιωάννου',
      phone: '6947505623',
      species: 'Σκύλος',
      breed: 'Μπουλντόγκ',
      date: '26/11/2025',
      time: '11:00',
      serviceType: 'Εκκριμές',
      status: 'pending',
      notes: ''
    },
    {
      id: 7,
      petName: 'Λούις',
      ownerName: 'Λούις',
      phone: '',
      species: 'Σκύλος',
      breed: '',
      date: '27/11/2025',
      time: '09:30',
      serviceType: 'Επιβεβαιωμένο',
      status: 'confirmed',
      notes: ''
    },
    {
      id: 8,
      petName: 'Μαξ',
      ownerName: 'Μαξ Κανελλάς',
      phone: '',
      species: '',
      breed: '',
      date: '28/11/2025',
      time: '10:30',
      serviceType: 'Επιβεβαιωμένο',
      status: 'confirmed',
      notes: ''
    },
    {
      id: 9,
      petName: 'Μιτλλά Εκάνη',
      ownerName: '',
      phone: '',
      species: '',
      breed: '',
      date: '29/11/2025',
      time: '13:00',
      serviceType: 'Εκκριμές',
      status: 'pending',
      notes: ''
    },
    {
      id: 10,
      petName: 'Φίφη',
      ownerName: 'Φίφη Εμμανουήλ',
      phone: '',
      species: '',
      breed: '',
      date: '27/11/2025',
      time: '15:00',
      serviceType: 'Εκκριμές',
      status: 'pending',
      notes: ''
    },
    {
      id: 11,
      petName: 'Τσάρλυ',
      ownerName: '',
      phone: '',
      species: '',
      breed: '',
      date: '29/11/2025',
      time: '16:00',
      serviceType: 'Επιβεβαιωμένο',
      status: 'confirmed',
      notes: ''
    }
  ];

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
    if (filterStatus === 'all') return appointments;
    return appointments.filter(apt => apt.status === filterStatus);
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
    return appointments.filter(apt => apt.date === dateStr);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleConfirm = (appointmentId) => {
    console.log('Confirm appointment:', appointmentId);
    // Update appointment status to confirmed
  };

  const handleReject = (appointmentId) => {
    console.log('Reject appointment:', appointmentId);
    // Update appointment status to cancelled
  };

  const formatDateRange = () => {
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

  return (
    <PageLayout>
      <div className="appointments">
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
                  📅 Ημέρα
                </button>
                <button
                  className={`appointments__view-btn ${viewMode === 'week' ? 'appointments__view-btn--active' : ''}`}
                  onClick={() => setViewMode('week')}
                >
                  📅 Εβδομάδα
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
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={index} className="appointments__day-column">
                      <div className={`appointments__day-header ${isToday ? 'appointments__day-header--today' : ''}`}>
                        <div className="appointments__day-name">{getDayName(day).substring(0, 3)}</div>
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
                                🕐 {apt.time}
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
                      className="appointments__list-card"
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      <div className="appointments__list-card-header">
                        <div>
                          <h4 className="appointments__list-pet-name">{apt.petName}</h4>
                          <p className="appointments__list-phone">Τηλέφωνο: {apt.phone}</p>
                        </div>
                        <div className={getStatusClass(apt.status)}>
                          {getStatusLabel(apt.status)}
                        </div>
                      </div>

                      <div className="appointments__list-card-body">
                        <div className="appointments__list-info">
                          <span className="appointments__list-label">Κατοικίδio:</span>
                          <span>{apt.species}</span>
                        </div>
                        <div className="appointments__list-info">
                          <span className="appointments__list-label">Είδος:</span>
                          <span>{apt.breed}</span>
                        </div>
                        <div className="appointments__list-info">
                          <span className="appointments__list-label">Ράτσα:</span>
                          <span>{apt.breed}</span>
                        </div>
                      </div>

                      <div className="appointments__list-card-footer">
                        <div className="appointments__list-meta">
                          <span>Ώρα: {apt.time}</span>
                          <span>Υπηρεσία: {apt.serviceType}</span>
                          <span>Σημειώσεις: {apt.notes || '-'}</span>
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
                onClick={() => setFilterStatus('all')}
              >
                Όλα
              </button>
              <button
                className={`appointments__filter ${filterStatus === 'confirmed' ? 'appointments__filter--active' : ''}`}
                onClick={() => setFilterStatus('confirmed')}
              >
                Επιβεβαιωμένα
              </button>
              <button
                className={`appointments__filter ${filterStatus === 'pending' ? 'appointments__filter--active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Εκκρεμή
              </button>
              <button
                className={`appointments__filter ${filterStatus === 'completed' ? 'appointments__filter--active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Ολοκληρωμένα
              </button>
              <button
                className={`appointments__filter ${filterStatus === 'cancelled' ? 'appointments__filter--active' : ''}`}
                onClick={() => setFilterStatus('cancelled')}
              >
                Ακυρωμένα
              </button>
            </div>

            {/* Appointment Cards */}
            <div className="appointments__list-cards">
              {filterAppointments().map(apt => (
                <div key={apt.id} className="appointments__list-card appointments__list-card--with-actions">
                  <div className="appointments__list-card-header">
                    <div>
                      <h4 className="appointments__list-pet-name">{apt.petName}</h4>
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
                      <span className="appointments__list-label">Κατοικίδio:</span>
                      <span>{apt.species}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Είδος:</span>
                      <span>{apt.breed}</span>
                    </div>
                    <div className="appointments__list-info">
                      <span className="appointments__list-label">Ράτσα:</span>
                      <span>{apt.breed}</span>
                    </div>
                  </div>

                  <div className="appointments__list-card-footer">
                    <div className="appointments__list-meta">
                      <span>Ώρα: {apt.time}</span>
                      <span>Υπηρεσία: {apt.serviceType}</span>
                      <span>Σημειώσεις: {apt.notes || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    📅 Ημερομηνία<br />
                    {selectedAppointment.date}
                  </div>
                  <div className="appointments__modal-time">
                    🕐 Ώρα<br />
                    {selectedAppointment.time}
                  </div>
                </div>

                {/* Pet Info */}
                <div className="appointments__modal-section">
                  <h4 className="appointments__modal-section-title">🐾 Κατοικίδιο</h4>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Όνομα:</span>
                    <span>{selectedAppointment.petName}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Τηλέφωνο:</span>
                    <span>{selectedAppointment.phone}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Κατοικίδιο:</span>
                    <span>{selectedAppointment.species}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Είδος:</span>
                    <span>{selectedAppointment.breed}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Ράτσα:</span>
                    <span>{selectedAppointment.breed}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="appointments__modal-section">
                  <h4 className="appointments__modal-section-title">📋 Υπηρεσία</h4>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Τύπος:</span>
                    <span>{selectedAppointment.serviceType}</span>
                  </div>
                  <div className="appointments__modal-info">
                    <span className="appointments__modal-label">Σημειώσεις:</span>
                    <span>{selectedAppointment.notes || 'Πρώτος εμβολιασμός'}</span>
                  </div>
                </div>
              </div>

              <div className="appointments__modal-actions">
                <button
                  className="appointments__modal-btn appointments__modal-btn--secondary"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Ακύρωση
                </button>
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      className="appointments__modal-btn appointments__modal-btn--reject"
                      onClick={() => {
                        handleReject(selectedAppointment.id);
                        setSelectedAppointment(null);
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
    </PageLayout>
  );
};

export default Appointments;
