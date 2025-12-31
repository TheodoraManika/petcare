import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Plus } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import CustomSelect from '../../components/common/CustomSelect';
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
    startTime: '09:00',
    endTime: '17:00',
    status: 'vaccination'
  });

  const [errorMessage, setErrorMessage] = useState('');

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
    other: 'Όλες οι υπηρεσίες'
  };

  const statusColors = {
    vaccination: '#FCA47C',
    checkup: '#FCA47C',
    surgery: '#FCA47C',
    treatment: '#FCA47C',
    dental: '#FCA47C',
    other: '#FCA47C'
  };

  const handleAddSlot = () => {
    if (!newSlot.day) return;

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
      startTime: '09:00',
      endTime: '17:00',
      status: 'vaccination'
    });
  };

  const handleDeleteSlot = (day, index) => {
    setAvailabilityData(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
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
                placeholder="09:00"
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
                placeholder="17:00"
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
            disabled={!newSlot.day}
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
              const count = getSlotCount(day);
              
              return (
                <div key={day} className="availability__day-card">
                  <div className="availability__day-header">
                    <div className="availability__day-title">
                      <Calendar size={18} />
                      <span>{dayLabels[day]}</span>
                    </div>
                    {/* CHANGE TO BETTER NAME OR DELETE */}
                    <span className="availability__day-count">
                      {count} παραθύρο{count !== 1 ? '' : ''} 
                    </span>
                  </div>

                  <div className="availability__day-slots">
                    {slots.length === 0 ? (
                      <div className="availability__empty">
                        <div className="availability__empty-icon">
                          <Calendar size={32} />
                        </div>
                        <p className="availability__empty-text">
                          Δεν έχουν οριστεί διαθέσιμες ώρες
                        </p>
                      </div>
                    ) : (
                      slots.map((slot, index) => (
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
    </PageLayout>
  );
};

export default Availability;
