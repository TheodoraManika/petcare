import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Plus, CalendarOff } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import DatePicker from '../../components/common/forms/DatePicker';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './Availability.css';

// Helper to parse DD/MM/YYYY dates that new Date() might fail on
const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(dateStr); // Fallback if not DD/MM/YYYY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed months
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

const Availability = () => {
  const [availabilityData, setAvailabilityData] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const [daysOffData, setDaysOffData] = useState([]);
  const [newDayOff, setNewDayOff] = useState('');
  const [newDayOffEnd, setNewDayOffEnd] = useState('');

  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
    status: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState({ day: '', index: -1 });
  const [showDeleteDayOffModal, setShowDeleteDayOffModal] = useState(false);
  const [dayOffToDelete, setDayOffToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const dayLabels = {
    monday: 'Δευτέρα',
    tuesday: 'Τρίτη',
    wednesday: 'Τετάρτη',
    thursday: 'Πέμπτη',
    friday: 'Παρασκευή',
    saturday: 'Σάββατο',
    sunday: 'Κυριακή'
  };

  const statusLabels = {
    vaccination: 'Εμβολιασμός',
    checkup: 'Γενική Εξέταση',
    surgery: 'Χειρουργείο',
    treatment: 'Θεραπεία',
    dental: 'Οδοντιατρική',
    ophthalmology: 'Οφθαλμολογική',
    cardiology: 'Καρδιολογική',
    dermatology: 'Δερματολογική',
    other: 'Όλες οι υπηρεσίες'
  };

  const statusColors = {
    vaccination: '#FCA47C',
    checkup: '#FCA47C',
    surgery: '#FCA47C',
    treatment: '#FCA47C',
    dental: '#FCA47C',
    ophthalmology: '#FCA47C',
    cardiology: '#FCA47C',
    dermatology: '#FCA47C',
    other: '#FCA47C'
  };

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Load availability from database on component mount
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          setErrorMessage('Παρακαλώ συνδεθείτε πρώτα');
          return;
        }

        const response = await fetch(`http://localhost:5000/availability?vetId=${user.id}`);
        if (!response.ok) {
          console.warn('Failed to load availability');
          return;
        }

        const data = await response.json();

        // Transform flat array to nested structure by day
        const groupedByDay = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        };

        data.forEach(slot => {
          if (groupedByDay[slot.day]) {
            groupedByDay[slot.day].push({
              start: slot.startTime,
              end: slot.endTime,
              status: slot.serviceType || 'other',
              id: slot.id // Store the ID for deletion
            });
          }
        });

        setAvailabilityData(groupedByDay);
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
    loadDaysOff();
  }, []);

  const loadDaysOff = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const response = await fetch(`http://localhost:5000/daysOff?vetId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Sort by date ascending
        setDaysOffData(data.sort((a, b) => parseDateString(a.date) - parseDateString(b.date)));
      }
    } catch (error) {
      console.error('Error loading days off:', error);
    }
  };

  const handleAddDayOff = async () => {
    if (!newDayOff) return;

    const user = getCurrentUser();
    if (!user) return;

    // Check if end date is before start date
    if (newDayOffEnd && parseDateString(newDayOffEnd) < parseDateString(newDayOff)) {
      setErrorMessage('Η ημερομηνία λήξης δεν μπορεί να είναι πριν την ημερομηνία έναρξης');
      return;
    }

    // Check if duplicate (only for single dates for now, could be improved)
    if (!newDayOffEnd && daysOffData.some(d => d.date === newDayOff && !d.endDate)) {
      setErrorMessage('Αυτή η ημερομηνία έχει ήδη προστεθεί');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/daysOff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vetId: user.id,
          date: newDayOff,
          endDate: newDayOffEnd || null,
          createdAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const created = await response.json();
        setDaysOffData(prev => [...prev, created].sort((a, b) => parseDateString(a.date) - parseDateString(b.date)));
        setNewDayOff('');
        setNewDayOffEnd('');
        setNotification('success-dayoff');
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      console.error('Error adding day off:', error);
    }
  };

  const handleDeleteDayOff = (dayOff) => {
    setDayOffToDelete(dayOff);
    setShowDeleteDayOffModal(true);
  };

  const handleConfirmDeleteDayOff = async () => {
    if (!dayOffToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/daysOff/${dayOffToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDaysOffData(prev => prev.filter(d => d.id !== dayOffToDelete.id));
        setShowDeleteDayOffModal(false);
        setDayOffToDelete(null);
        setNotification('deleted-dayoff');
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting day off:', error);
    }
  };

  const handleAddSlot = async () => {
    const user = getCurrentUser();

    if (!user) {
      setErrorMessage('Παρακαλώ συνδεθείτε πρώτα');
      return;
    }

    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.status) {
      setErrorMessage('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    // Convert times to minutes for comparison
    const startMinutes = parseInt(newSlot.startTime.split(':')[0]) * 60 + parseInt(newSlot.startTime.split(':')[1]);
    const endMinutes = parseInt(newSlot.endTime.split(':')[0]) * 60 + parseInt(newSlot.endTime.split(':')[1]);

    // Validate that end time is after start time
    if (endMinutes <= startMinutes) {
      setErrorMessage('Η ώρα λήξης πρέπει να είναι μεταγενέστερη της ώρας έναρξης');
      return;
    }

    // Clear error message
    setErrorMessage('');

    try {
      // Save to backend immediately
      const newRecord = {
        vetId: user.id,
        day: newSlot.day,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        serviceType: newSlot.status,
        createdAt: new Date().toISOString()
      };

      console.log('Saving availability:', newRecord);

      const response = await fetch('http://localhost:5000/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save slot: ${response.status} - ${errorText}`);
      }

      // Get the created record with its ID
      const createdSlot = await response.json();

      // Update local state with the new slot including its ID
      setAvailabilityData(prev => ({
        ...prev,
        [newSlot.day]: [
          ...(prev[newSlot.day] || []),
          {
            start: newSlot.startTime,
            end: newSlot.endTime,
            status: newSlot.status,
            id: createdSlot.id // Include the ID from the database
          }
        ]
      }));

      // Reset form
      setNewSlot({
        day: '',
        startTime: '',
        endTime: '',
        status: ''
      });

      // Show success notification
      setNotification('success');

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error adding slot:', error);
      setErrorMessage(`Σφάλμα: ${error.message}`);
    }
  };

  const handleDeleteSlot = (day, index) => {
    // Show confirmation modal instead of deleting immediately
    setSlotToDelete({ day, index });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('Παρακαλώ συνδεθείτε πρώτα');
        return;
      }

      const slot = availabilityData[slotToDelete.day][slotToDelete.index];

      // If slot has an ID, delete from database
      if (slot.id) {
        const response = await fetch(`http://localhost:5000/availability/${slot.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to delete availability from database');
        }
      }

      // Update local state
      setAvailabilityData(prev => ({
        ...prev,
        [slotToDelete.day]: prev[slotToDelete.day].filter((_, i) => i !== slotToDelete.index)
      }));

      // Close modal and reset
      setShowDeleteModal(false);
      setSlotToDelete({ day: '', index: -1 });

      // Show notification
      setNotification('deleted');

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error deleting availability:', error);
      setErrorMessage(`Σφάλμα κατά τη διαγραφή: ${error.message}`);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSlotToDelete({ day: '', index: -1 });
  };

  const handleSelectChange = (name, value) => {
    setNewSlot(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error message when user changes any field
    setErrorMessage('');
  };

  const getSlotCount = (day) => {
    const slots = availabilityData[day];
    return slots.length;
  };

  const breadcrumbItems = [];

  return (
    <PageLayout title="Διαθεσιμότητα" breadcrumbs={breadcrumbItems}>
      <div className="availability">
        <div className="availability__header">
          <h1 className="availability__title">Διαχείριση Διαθεσιμότητας</h1>
          <p className="availability__subtitle">
            Ορίστε τις ημέρες και ώρες που δέχεστε ραντεβού
          </p>
        </div>

        {/* Add New Slot Form */}
        <div className="availability__add-form">
          <h2 className="availability__form-title">Προσθήκη Διαθεσιμότητας Ραντεβού</h2>

          <div className="availability__form-row">
            <div className="availability__form-field">
              <label className="availability__form-label">Ημέρα</label>
              <CustomSelect
                name="day"
                value={newSlot.day}
                onChange={(value) => handleSelectChange('day', value)}
                options={[
                  { value: 'monday', label: 'Δευτέρα' },
                  { value: 'tuesday', label: 'Τρίτη' },
                  { value: 'wednesday', label: 'Τετάρτη' },
                  { value: 'thursday', label: 'Πέμπτη' },
                  { value: 'friday', label: 'Παρασκευή' },
                  { value: 'saturday', label: 'Σάββατο' },
                  { value: 'sunday', label: 'Κυριακή' }
                ]}
                placeholder="Επιλέξτε ημέρα"
              />
            </div>

            <div className="availability__form-field">
              <label className="availability__form-label">Ώρα Έναρξης</label>
              <CustomSelect
                name="startTime"
                value={newSlot.startTime}
                onChange={(value) => handleSelectChange('startTime', value)}
                options={[
                  { value: '08:00', label: '08:00' },
                  { value: '09:00', label: '09:00' },
                  { value: '10:00', label: '10:00' },
                  { value: '11:00', label: '11:00' },
                  { value: '12:00', label: '12:00' },
                  { value: '13:00', label: '13:00' },
                  { value: '14:00', label: '14:00' },
                  { value: '15:00', label: '15:00' },
                  { value: '16:00', label: '16:00' },
                  { value: '17:00', label: '17:00' },
                  { value: '18:00', label: '18:00' },
                  { value: '19:00', label: '19:00' },
                  { value: '20:00', label: '20:00' },
                  { value: '21:00', label: '21:00' }
                ]}
                placeholder="Επιλέξτε ώρα"
              />
            </div>

            <div className="availability__form-field">
              <label className="availability__form-label">Ώρα Λήξης</label>
              <CustomSelect
                name="endTime"
                value={newSlot.endTime}
                onChange={(value) => handleSelectChange('endTime', value)}
                options={[
                  { value: '09:00', label: '09:00' },
                  { value: '10:00', label: '10:00' },
                  { value: '11:00', label: '11:00' },
                  { value: '12:00', label: '12:00' },
                  { value: '13:00', label: '13:00' },
                  { value: '14:00', label: '14:00' },
                  { value: '15:00', label: '15:00' },
                  { value: '16:00', label: '16:00' },
                  { value: '17:00', label: '17:00' },
                  { value: '18:00', label: '18:00' },
                  { value: '19:00', label: '19:00' },
                  { value: '20:00', label: '20:00' },
                  { value: '21:00', label: '21:00' },
                  { value: '22:00', label: '22:00' }
                ]}
                placeholder="Επιλέξτε ώρα"
              />
            </div>

            <div className="availability__form-field">
              <label className="availability__form-label">Υπηρεσία</label>
              <CustomSelect
                name="status"
                value={newSlot.status}
                onChange={(value) => handleSelectChange('status', value)}
                options={[
                  { value: 'vaccination', label: 'Εμβολιασμός' },
                  { value: 'checkup', label: 'Γενική Εξέταση' },
                  { value: 'surgery', label: 'Χειρουργείο' },
                  { value: 'treatment', label: 'Θεραπεία' },
                  { value: 'dental', label: 'Οδοντιατρική' },
                  { value: 'ophthalmology', label: 'Οφθαλμολογική' },
                  { value: 'cardiology', label: 'Καρδιολογική' },
                  { value: 'dermatology', label: 'Δερματολογική' },
                  { value: 'other', label: 'Όλες οι υπηρεσίες' }
                ]}
                placeholder="Επιλέξτε υπηρεσία"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="availability__error">
              {errorMessage}
            </div>
          )}

          <button
            className="availability__add-btn"
            onClick={handleAddSlot}
            disabled={!newSlot.day || !newSlot.startTime || !newSlot.endTime || !newSlot.status}
          >
            <Plus size={18} />
            Προσθήκη
          </button>
        </div>

        {/* Weekly Schedule */}
        <div className="availability__schedule">
          <h2 className="availability__schedule-title">Εβδομαδιαίο Πρόγραμμα</h2>

          <div className="availability__grid">
            {Object.keys(dayLabels).map(day => {
              const slots = availabilityData[day];
              // Sort slots by start time
              const sortedSlots = [...slots].sort((a, b) => {
                return a.start.localeCompare(b.start);
              });

              return (
                <div key={day} className="availability__day-card">
                  <div className="availability__day-header">
                    <div className="availability__day-title">
                      <Calendar size={18} />
                      <span>{dayLabels[day]}</span>
                    </div>
                  </div>

                  <div className="availability__day-slots">
                    {sortedSlots.length === 0 ? (
                      <div className="availability__empty">
                        <div className="availability__empty-icon">
                          <Calendar size={32} />
                        </div>
                        <p className="availability__empty-text">
                          Δεν έχουν οριστεί διαθέσιμες ώρες
                        </p>
                      </div>
                    ) : (
                      sortedSlots.map((slot, index) => (
                        <div key={index} className="availability__slot">
                          <div className="availability__slot-time">
                            <Clock size={16} />
                            <span>{slot.start} - {slot.end}</span>
                          </div>
                          <div className="availability__slot-actions">
                            <span
                              className="availability__slot-status"
                              style={{ backgroundColor: statusColors[slot.status] }}
                            >
                              {statusLabels[slot.status]}
                            </span>
                            <button
                              className="availability__slot-delete"
                              onClick={() => handleDeleteSlot(day, index)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Days Off Section */}
        <div className="availability__days-off">
          <h2 className="availability__schedule-title">Εξαιρέσεις (Ρεπό / Άδειες)</h2>
          <div className="availability__days-off-form">
            <div className="availability__form-row">
              <div className="availability__form-field">
                <label className="availability__form-label">Από</label>
                <DatePicker
                  name="dayOff"
                  value={newDayOff}
                  onChange={(e) => {
                    setNewDayOff(e.target.value);
                    setErrorMessage('');
                  }}
                  variant="vet"
                  minDate={new Date()}
                />
              </div>
              <div className="availability__form-field">
                <label className="availability__form-label">Έως (Προαιρετικό)</label>
                <DatePicker
                  name="dayOffEnd"
                  value={newDayOffEnd}
                  onChange={(e) => {
                    setNewDayOffEnd(e.target.value);
                    setErrorMessage('');
                  }}
                  variant="vet"
                  minDate={newDayOff ? new Date(newDayOff) : new Date()}
                />
              </div>
            </div>
            <button
              className="availability__add-day-off-btn availability__add-day-off-btn--orange"
              onClick={handleAddDayOff}
              disabled={!newDayOff}
            >
              <Plus size={18} />
              Προσθήκη Εξαίρεσης
            </button>
          </div>

          {/* Live Preview */}
          {newDayOff && (
            <div className="availability__day-off-preview availability__day-off-item--orange" style={{ marginBottom: '20px', borderStyle: 'dashed' }}>
              <div className="availability__day-off-info">
                <CalendarOff size={18} />
                <span style={{ fontWeight: 600 }}>
                  Προεπισκόπηση: {parseDateString(newDayOff).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {newDayOffEnd && ` - ${parseDateString(newDayOffEnd).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                </span>
              </div>
            </div>
          )}

          <div className="availability__days-off-list">
            {daysOffData.length === 0 ? (
              <div className="availability__empty">
                <p className="availability__empty-text">Δεν έχουν οριστεί εξαιρέσεις</p>
              </div>
            ) : (
              <div className="availability__day-off-items">
                {daysOffData.map((dayOff) => {
                  const startDate = parseDateString(dayOff.date);
                  const endDate = dayOff.endDate ? parseDateString(dayOff.endDate) : null;

                  const isValidStart = startDate && !isNaN(startDate.getTime());
                  const isValidEnd = endDate && !isNaN(endDate.getTime());

                  const formatDate = (date) => {
                    return date.toLocaleDateString('el-GR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                  };

                  return (
                    <div key={dayOff.id} className="availability__day-off-item availability__day-off-item--orange">
                      <div className="availability__day-off-info">
                        <CalendarOff size={18} />
                        <span>
                          {!isValidStart ? 'Μη έγκυρη ημερομηνία' : (
                            isValidEnd ? `${formatDate(startDate)} - ${formatDate(endDate)}` : formatDate(startDate)
                          )}
                        </span>
                      </div>
                      <button
                        className="availability__slot-delete availability__slot-delete--orange"
                        onClick={() => handleDeleteDayOff(dayOff)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Days Off Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteDayOffModal}
        title="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εξαίρεση;"
        description="Ο κτηνίατρος θα ξαναγίνει διαθέσιμος βάσει του εβδομαδιαίου προγράμματος."
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, διαγραφή"
        onCancel={() => setShowDeleteDayOffModal(false)}
        onConfirm={handleConfirmDeleteDayOff}
        isDanger={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Είστε σίγουροι ότι θέλετε να διαγράψετε τη διαθέσιμη ώρα ραντεβού;"
        description="Αυτή η ενέργεια δεν αναιρείται."
        cancelText="Όχι, επιστροφή"
        confirmText="Ναι, απόρριψη"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDanger={true}
      />

      {/* Notification */}
      <Notification
        isVisible={notification !== null}
        message={
          notification === 'success'
            ? 'Η ώρα προστέθηκε επιτυχώς!'
            : notification === 'success-dayoff'
              ? 'Η εξαίρεση προστέθηκε επιτυχώς!'
              : notification === 'deleted'
                ? 'Η διαθέσιμη ώρα ραντεβού διαγράφτηκε με επιτυχία!'
                : notification === 'deleted-dayoff'
                  ? 'Η εξαίρεση διαγράφτηκε με επιτυχία!'
                  : 'Ενημέρωση διαθεσιμότητας'
        }
        type={notification === 'success' ? 'success' : 'error'}
      />
    </PageLayout>
  );
};

export default Availability;
