import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DatePicker.css';

const DatePicker = ({ value, onChange, name, variant = 'vet', maxDate = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pickerRef = useRef(null);

  const months = [
    'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
    'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
  ];

  const daysOfWeek = ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'];

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    
    // Check if date is after maxDate
    if (maxDate) {
      const maxDateTime = new Date(maxDate);
      maxDateTime.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > maxDateTime) {
        return; // Don't allow selection of dates after maxDate
      }
    }
    
    const formattedDate = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
    onChange({
      target: {
        name,
        value: formattedDate,
      }
    });
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    // Parse maxDate if provided
    let maxDateTime = null;
    if (maxDate) {
      maxDateTime = new Date(maxDate);
      maxDateTime.setHours(0, 0, 0, 0);
    }

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="datepicker__day datepicker__day--empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isSelected = value && value.startsWith(day.toString().padStart(2, '0') + '/' + (currentMonth + 1).toString().padStart(2, '0'));
      
      // Check if this day is after maxDate
      let isDisabled = false;
      if (maxDateTime) {
        const dayDate = new Date(currentYear, currentMonth, day);
        dayDate.setHours(0, 0, 0, 0);
        isDisabled = dayDate > maxDateTime;
      }

      days.push(
        <button
          key={day}
          type="button"
          className={`datepicker__day ${isToday ? 'datepicker__day--today' : ''} ${isSelected ? 'datepicker__day--selected' : ''} ${isDisabled ? 'datepicker__day--disabled' : ''}`}
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`datepicker datepicker--${variant}`} ref={pickerRef}>
      <input
        type="text"
        name={name}
        className="datepicker__input"
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="ΗΗ/ΜΜ/ΕΕΕΕ"
        readOnly
      />
      
      {isOpen && (
        <div className="datepicker__calendar">
          <div className="datepicker__header">
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="datepicker__current-month">
              {months[currentMonth]} {currentYear}
            </div>
            <button
              type="button"
              className="datepicker__nav-btn"
              onClick={handleNextMonth}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="datepicker__weekdays">
            {daysOfWeek.map((day) => (
              <div key={day} className="datepicker__weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="datepicker__days">
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
