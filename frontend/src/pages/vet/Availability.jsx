import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Plus } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import CustomSelect from '../../components/common/forms/CustomSelect';
import ConfirmModal from '../../components/common/modals/ConfirmModal';
import Notification from '../../components/common/modals/Notification';
import { ROUTES } from '../../utils/constants';
import './Availability.css';

const Availability = () => {
  const [availabilityData, setAvailabilityData] = useState({
    monday: [{ start: '09:00', end: '13:00', status: 'checkup' }],
    tuesday: [],
    wednesday: [{ start: '10:00', end: '17:00', status: 'surgery' }],
    thursday: [
      { start: '09:00', end: '13:00', status: 'vaccination' },
      { start: '17:00', end: '21:00', status: 'treatment' }
    ],
    friday: [],
    saturday: [],
    sunday: []
  });

  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
    status: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState({ day: '', index: -1 });
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

  const handleAddSlot = () => {
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

    setAvailabilityData(prev => ({
      ...prev,
      [newSlot.day]: [
        ...(prev[newSlot.day] || []),
        {
          start: newSlot.startTime,
          end: newSlot.endTime,
          status: newSlot.status
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
  };

  const handleDeleteSlot = (day, index) => {
    // Show confirmation modal instead of deleting immediately
    setSlotToDelete({ day, index });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
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
              const count = getSlotCount(day);
              
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
      </div>

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
        message="Η διαθέσιμη ώρα ραντεβού διαγράφτηκε με επιτυχία!"
        type="error"
      />
    </PageLayout>
  );
};

export default Availability;
