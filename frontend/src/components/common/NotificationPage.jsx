import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, Check, XCircle, Calendar, PawPrint, Clock } from 'lucide-react';
import { ROUTES, formatDate as formatDateUtil } from '../../utils/constants';
import './NotificationPage.css';

const NotificationPage = ({ isOpen, onClose, userType }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) return;

      const response = await fetch(`http://localhost:5000/notifications?userId=${currentUser.id}&userType=${currentUser.userType}`);
      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
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

      case 'lost_pet':
        return `Ο/η ${data.vetName} έκανε δήλωση απώλειας για το κατοικίδιό σας "${data.petName}"${data.location ? ` στην περιοχή ${data.location}` : ''}${data.date ? ` την ${data.date}` : ''}. Το κατοικίδιό σας έχει πλέον την κατάσταση "Χαμένο".`;

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
    if (type.includes('approved') || type.includes('found')) return '#A1CCA6';
    if (type.includes('cancelled') || type.includes('lost')) return '#ef4444';
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

    return formatDateUtil(dateString);
  };

  const markAsRead = async (id) => {
    try {
      // Update in database
      const response = await fetch(`http://localhost:5000/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
        // Refresh navbar badge
        window.dispatchEvent(new Event('notificationCreated'));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update all unread notifications
      const unreadNotifications = notifications.filter(n => !n.read);

      for (const notif of unreadNotifications) {
        await fetch(`http://localhost:5000/notifications/${notif.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true })
        });
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      // Refresh navbar badge
      window.dispatchEvent(new Event('notificationCreated'));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Delete from database
      const response = await fetch(`http://localhost:5000/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notif) => {
    // Mark as read if unread
    if (!notif.read) {
      await markAsRead(notif.id);
    }

    // Determine navigation path and state
    let path = '';
    let state = {};

    switch (notif.type) {
      case 'appointment_approved':
        path = ROUTES.owner.appointments;
        state = { activeTab: 'active', appointmentId: notif.data?.appointmentId };
        break;
      case 'appointment_cancelled':
        path = ROUTES.owner.appointments;
        state = { activeTab: 'history', appointmentId: notif.data?.appointmentId };
        break;
      case 'found_pet':
        // If we have a relatedId (declaration id in pets/Found_pet), we can try to go to the detail page
        if (notif.relatedId || notif.data?.petId) {
          path = `${ROUTES.owner.lostHistory}/${notif.relatedId || notif.data.petId}`;
        } else {
          path = ROUTES.owner.lostHistory;
          state = { activeTab: 'others' };
        }
        break;
      case 'lost_pet':
        path = ROUTES.owner.lostHistory;
        state = { activeTab: 'mine', petId: notif.data?.petId };
        break;
      case 'new_appointment':
      case 'appointment_cancelled_by_owner':
        path = ROUTES.vet.appointments;
        state = { activeTab: 'calendar', appointmentId: notif.data?.appointmentId };
        break;
      default:
        // Default behavior: just stay on page or go to dashboard
        break;
    }

    if (path) {
      navigate(path, { state });
      onClose();
    }
  };

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
                onClick={() => handleNotificationClick(notification)}
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
