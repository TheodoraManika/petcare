import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Plus } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/common/CustomSelect';
import ConfirmModal from '../../components/common/ConfirmModal';
import Notification from '../../components/common/Notification';
import { ROUTES } from '../../utils/constants';
import './Availability.css';

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

  const [newSlot, setNewSlot] = useState({
    day: '',
    startTime: '',
    endTime: '',
    status: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get current user
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Load availability from backend on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!currentUser) return;
      
      try {
        const response = await fetch('http://localhost:5000/availability');
        if (!response.ok) throw new Error('Failed to fetch availability');
        
        const availabilityRecords = await response.json();
        
        // Filter for current vet and organize by day
        const vetAvailability = availabilityRecords.filter(a => a.vetId === currentUser.id);
        
        const organized = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        };
        
        vetAvailability.forEach(record => {
          if (organized[record.day]) {
            organized[record.day].push({
              start: record.startTime,
              end: record.endTime,
              status: record.serviceType
            });
          }
        });
        
        setAvailabilityData(organized);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [currentUser]);

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

      // Update local state
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
      
      setSuccessMessage('Η ώρα προστέθηκε επιτυχώς!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding slot:', error);
      setErrorMessage(`Σφάλμα: ${error.message}`);
    }
  };

  const handleDeleteSlot = async (day, index) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        setErrorMessage('Παρακαλώ συνδεθείτε πρώτα');
        return;
      }

      const allAvailability = await fetch('http://localhost:5000/availability').then(r => r.json());
      const vetAvailability = allAvailability.filter(a => a.vetId === user.id);
      
      // Get the specific slot we want to delete
      const daySlots = vetAvailability.filter(a => a.day === day);
      const sortedSlots = daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      
      if (sortedSlots[index]) {
        const slotToDelete = sortedSlots[index];
        
        // Delete from backend
        const response = await fetch(`http://localhost:5000/availability/${slotToDelete.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete slot');

        // Update local state
        setAvailabilityData(prev => ({
          ...prev,
          [day]: prev[day].filter((_, i) => i !== index)
        }));

        setSuccessMessage('Η ώρα διαγράφηκε επιτυχώς!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      setErrorMessage('Σφάλμα κατά τη διαγραφή της ώρας');
    }
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

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.vet.dashboard }
  ];

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

          {successMessage && (
            <div className="availability__success">
              {successMessage}
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
