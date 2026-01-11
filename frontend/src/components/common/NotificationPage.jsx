import React, { useState, useEffect } from 'react';
import { X, Bell, Check, XCircle, Calendar, PawPrint, Clock } from 'lucide-react';
import './NotificationPage.css';

const NotificationPage = ({ isOpen, onClose, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    // TODO: Replace with real API call
    // const response = await fetch(`http://localhost:5000/notifications?userId=${userId}&userType=${userType}`);
    // const data = await response.json();
    // setNotifications(data);
    
    // Mock notifications with proper template structure
    // Each notification should come from backend with this structure:
    const mockNotifications = userType === 'owner' ? [
      {
        id: 1,
        type: 'appointment_approved',
        title: 'Το ραντεβού σας εγκρίθηκε',
        // Backend should send: vetName, appointmentDate, appointmentTime, petName
        data: {
          vetName: 'Δρ. Πετρίδης',
          appointmentDate: '15/01/2026',
          appointmentTime: '10:00',
          petName: 'Μάξ'
        },
        date: '2026-01-10T14:30:00',
        read: false,
        icon: 'check'
      },
      {
        id: 2,
        type: 'appointment_cancelled',
        title: 'Το ραντεβού σας ακυρώθηκε',
        // Backend should send: vetName, appointmentDate, appointmentTime, petName
        data: {
          vetName: 'Δρ. Κωνσταντίνου',
          appointmentDate: '12/01/2026',
          appointmentTime: '14:00',
          petName: 'Λούκυ'
        },
        date: '2026-01-09T16:20:00',
        read: false,
        icon: 'cancel'
      },
      {
        id: 3,
        type: 'found_pet',
        title: 'Δήλωση εύρεσης κατοικιδίου',
        // Backend should send: petName, finderName (optional), location (optional)
        data: {
          petName: 'Μάξ',
          finderName: 'Μαρία Παπαδοπούλου',
          location: 'Κέντρο Αθήνας'
        },
        date: '2026-01-08T11:15:00',
        read: true,
        icon: 'pet'
      },
    ] : [
      {
        id: 1,
        type: 'new_appointment',
        title: 'Νέο αίτημα ραντεβού',
        // Backend should send: ownerName, appointmentDate, appointmentTime, petName
        data: {
          ownerName: 'Μαρία Παπαδοπούλου',
          appointmentDate: '15/01/2026',
          appointmentTime: '10:00',
          petName: 'Μάξ'
        },
        date: '2026-01-10T09:30:00',
        read: false,
        icon: 'calendar'
      },
      {
        id: 2,
        type: 'appointment_cancelled_by_owner',
        title: 'Ακύρωση ραντεβού',
        // Backend should send: ownerName, appointmentDate, appointmentTime, petName
        data: {
          ownerName: 'Νίκος Γεωργίου',
          appointmentDate: '14/01/2026',
          appointmentTime: '14:00',
          petName: 'Ρεξ'
        },
        date: '2026-01-09T18:45:00',
        read: false,
        icon: 'cancel'
      },
      {
        id: 3,
        type: 'new_appointment',
        title: 'Νέο αίτημα ραντεβού',
        // Backend should send: ownerName, appointmentDate, appointmentTime, petName
        data: {
          ownerName: 'Ελένη Νικολάου',
          appointmentDate: '16/01/2026',
          appointmentTime: '15:30',
          petName: 'Μπέλα'
        },
        date: '2026-01-08T12:20:00',
        read: true,
        icon: 'calendar'
      },
    ];

    setNotifications(mockNotifications);
  };

  // Generate message from template based on notification type and data
  const generateMessage = (type, data) => {
    switch (type) {
      // OWNER NOTIFICATION TEMPLATES
      case 'appointment_approved':
        return `Το ραντεβού σας με τον ${data.vetName} για τις ${data.appointmentDate} στις ${data.appointmentTime} για το κατοικίδιο ${data.petName} εγκρίθηκε. Μπορείτε να το δείτε στη σελίδα "Τα Ραντεβού μου".`;
      
      case 'appointment_cancelled':
        return `Το ραντεβού σας με τον ${data.vetName} για τις ${data.appointmentDate} στις ${data.appointmentTime} για το κατοικίδιο ${data.petName} ακυρώθηκε από τον κτηνίατρο. Μπορείτε να το δείτε στη σελίδα "Τα Ραντεβού μου".`;
      
      case 'found_pet':
        return data.finderName 
          ? `Ο/η ${data.finderName} έκανε δήλωση εύρεσης για το κατοικίδιό σας "${data.petName}"${data.location ? ` στην περιοχή ${data.location}` : ''}. Μπορείτε να δείτε τη δήλωση στη σελίδα "Ιστορικό Δηλώσεων -> Από άλλους".`
          : `Κάποιος έκανε δήλωση εύρεσης για το κατοικίδιό σας "${data.petName}"${data.location ? ` στην περιοχή ${data.location}` : ''}. Μπορείτε να δείτε τη δήλωση στη σελίδα "Ιστορικό Δηλώσεων -> Από άλλους".`;
      
      // VET NOTIFICATION TEMPLATES
      case 'new_appointment':
        return `${data.ownerName} ζήτησε ραντεβού για τις ${data.appointmentDate} στις ${data.appointmentTime} για το κατοικίδιο ${data.petName}. Εγκρίνετε ή ακυρώστε το αίτημα από τη σελίδα "Διαχείριση Ραντεβού".`;
      
      case 'appointment_cancelled_by_owner':
        return `${data.ownerName} ακύρωσε το ραντεβού για τις ${data.appointmentDate} στις ${data.appointmentTime} για το κατοικίδιο ${data.petName}. Μπορείτε να δείτε το ραντεβού στη σελίδα "Διαχείριση Ραντεβού".`;
      
      default:
        return 'Νέα ειδοποίηση';
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return <Check size={20} />;
      case 'cancel':
        return <XCircle size={20} />;
      case 'calendar':
        return <Calendar size={20} />;
      case 'pet':
        return <PawPrint size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getIconColor = (type) => {
    if (type.includes('approved') || type.includes('found')) return '#10b981';
    if (type.includes('cancelled')) return '#ef4444';
    if (type.includes('new')) return userType === 'owner' ? '#23CED9' : '#FCA47C';
    return '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Μόλις τώρα';
    if (diffMins < 60) return `Πριν ${diffMins} λεπτά`;
    if (diffHours < 24) return `Πριν ${diffHours} ${diffHours === 1 ? 'ώρα' : 'ώρες'}`;
    if (diffDays < 7) return `Πριν ${diffDays} ${diffDays === 1 ? 'μέρα' : 'μέρες'}`;
    
    return date.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // In real app, make API call to mark as read
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    // In real app, make API call to mark all as read
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    // In real app, make API call to delete notification
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="notification-page-overlay" onClick={onClose}>
      <div className="notification-page" onClick={(e) => e.stopPropagation()}>
        <div className="notification-page__header">
          <div className="notification-page__title-section">
            <Bell size={24} />
            <h2 className="notification-page__title">Ειδοποιήσεις</h2>
            {unreadCount > 0 && (
              <span className="notification-page__badge">{unreadCount}</span>
            )}
          </div>
          <button className="notification-page__close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="notification-page__filters">
          <button
            className={`notification-page__filter-btn ${filter === 'all' ? 'notification-page__filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Όλες ({notifications.length})
          </button>
          <button
            className={`notification-page__filter-btn ${filter === 'unread' ? 'notification-page__filter-btn--active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Μη αναγνωσμένες ({unreadCount})
          </button>
          <button
            className={`notification-page__filter-btn ${filter === 'read' ? 'notification-page__filter-btn--active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Αναγνωσμένες ({notifications.length - unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="notification-page__actions">
            <button
              className="notification-page__mark-all-btn"
              onClick={markAllAsRead}
            >
              <Check size={16} />
              Σημείωση όλων ως αναγνωσμένες
            </button>
          </div>
        )}

        <div className="notification-page__list">
          {filteredNotifications.length === 0 ? (
            <div className="notification-page__empty">
              <Bell size={48} />
              <p>Δεν υπάρχουν ειδοποιήσεις</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-page__item ${!notification.read ? 'notification-page__item--unread' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div
                  className="notification-page__icon"
                  style={{ backgroundColor: getIconColor(notification.type) + '20', color: getIconColor(notification.type) }}
                >
                  {getIcon(notification.icon)}
                </div>
                <div className="notification-page__content">
                  <div className="notification-page__header-row">
                    <h3 className="notification-page__item-title">{notification.title}</h3>
                    <button
                      className="notification-page__delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="notification-page__message">
                    {generateMessage(notification.type, notification.data)}
                  </p>
                  <div className="notification-page__footer">
                    <span className="notification-page__time">
                      <Clock size={14} />
                      {formatDate(notification.date)}
                    </span>
                    {!notification.read && (
                      <span className="notification-page__unread-dot"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
