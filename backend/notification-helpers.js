/**
 * Notification Helper Functions
 * These functions help create properly formatted notifications for the frontend
 */

// Notification type constants
const NOTIFICATION_TYPES = {
  // Owner notifications
  APPOINTMENT_APPROVED: 'appointment_approved',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  FOUND_PET: 'found_pet',
  
  // Vet notifications
  NEW_APPOINTMENT: 'new_appointment',
  APPOINTMENT_CANCELLED_BY_OWNER: 'appointment_cancelled_by_owner',
};

// Icon mapping
const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.APPOINTMENT_APPROVED]: 'check',
  [NOTIFICATION_TYPES.APPOINTMENT_CANCELLED]: 'cancel',
  [NOTIFICATION_TYPES.FOUND_PET]: 'pet',
  [NOTIFICATION_TYPES.NEW_APPOINTMENT]: 'calendar',
  [NOTIFICATION_TYPES.APPOINTMENT_CANCELLED_BY_OWNER]: 'cancel',
};

// Title mapping
const NOTIFICATION_TITLES = {
  [NOTIFICATION_TYPES.APPOINTMENT_APPROVED]: 'Το ραντεβού σας εγκρίθηκε',
  [NOTIFICATION_TYPES.APPOINTMENT_CANCELLED]: 'Το ραντεβού σας ακυρώθηκε',
  [NOTIFICATION_TYPES.FOUND_PET]: 'Δήλωση εύρεσης κατοικιδίου',
  [NOTIFICATION_TYPES.NEW_APPOINTMENT]: 'Νέο αίτημα ραντεβού',
  [NOTIFICATION_TYPES.APPOINTMENT_CANCELLED_BY_OWNER]: 'Ακύρωση ραντεβού',
};

/**
 * Format date to DD/MM/YYYY
 */
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format time to HH:MM
 */
function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Create a notification object
 * @param {number} userId - The user ID to send notification to
 * @param {string} userType - Either 'owner' or 'vet'
 * @param {string} type - Notification type (use NOTIFICATION_TYPES constants)
 * @param {object} data - Data object with notification details
 * @returns {object} Notification object ready to be saved to database
 */
function createNotification(userId, userType, type, data) {
  return {
    userId,
    userType,
    type,
    title: NOTIFICATION_TITLES[type],
    data,
    date: new Date().toISOString(),
    read: false,
    icon: NOTIFICATION_ICONS[type],
  };
}

/**
 * Create appointment approved notification
 * @param {number} ownerId - Owner user ID
 * @param {object} appointment - Appointment object
 * @param {object} vet - Vet user object
 * @param {object} pet - Pet object
 */
function createAppointmentApprovedNotification(ownerId, appointment, vet, pet) {
  return createNotification(
    ownerId,
    'owner',
    NOTIFICATION_TYPES.APPOINTMENT_APPROVED,
    {
      vetName: vet.name,
      appointmentDate: formatDate(appointment.date),
      appointmentTime: formatTime(appointment.date),
      petName: pet.name,
    }
  );
}

/**
 * Create appointment cancelled notification (by vet)
 * @param {number} ownerId - Owner user ID
 * @param {object} appointment - Appointment object
 * @param {object} vet - Vet user object
 * @param {object} pet - Pet object
 */
function createAppointmentCancelledNotification(ownerId, appointment, vet, pet) {
  return createNotification(
    ownerId,
    'owner',
    NOTIFICATION_TYPES.APPOINTMENT_CANCELLED,
    {
      vetName: vet.name,
      appointmentDate: formatDate(appointment.date),
      appointmentTime: formatTime(appointment.date),
      petName: pet.name,
    }
  );
}

/**
 * Create found pet notification
 * @param {number} ownerId - Owner user ID
 * @param {object} pet - Pet object
 * @param {string} finderName - Name of person who found the pet (optional)
 * @param {string} location - Location where pet was found (optional)
 */
function createFoundPetNotification(ownerId, pet, finderName = null, location = null) {
  const data = {
    petName: pet.name,
  };
  
  if (finderName) data.finderName = finderName;
  if (location) data.location = location;
  
  return createNotification(
    ownerId,
    'owner',
    NOTIFICATION_TYPES.FOUND_PET,
    data
  );
}

/**
 * Create new appointment request notification
 * @param {number} vetId - Vet user ID
 * @param {object} appointment - Appointment object
 * @param {object} owner - Owner user object
 * @param {object} pet - Pet object
 */
function createNewAppointmentNotification(vetId, appointment, owner, pet) {
  return createNotification(
    vetId,
    'vet',
    NOTIFICATION_TYPES.NEW_APPOINTMENT,
    {
      ownerName: owner.name,
      appointmentDate: formatDate(appointment.date),
      appointmentTime: formatTime(appointment.date),
      petName: pet.name,
    }
  );
}

/**
 * Create appointment cancelled by owner notification
 * @param {number} vetId - Vet user ID
 * @param {object} appointment - Appointment object
 * @param {object} owner - Owner user object
 * @param {object} pet - Pet object
 */
function createAppointmentCancelledByOwnerNotification(vetId, appointment, owner, pet) {
  return createNotification(
    vetId,
    'vet',
    NOTIFICATION_TYPES.APPOINTMENT_CANCELLED_BY_OWNER,
    {
      ownerName: owner.name,
      appointmentDate: formatDate(appointment.date),
      appointmentTime: formatTime(appointment.date),
      petName: pet.name,
    }
  );
}

// Export everything
module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_ICONS,
  NOTIFICATION_TITLES,
  formatDate,
  formatTime,
  createNotification,
  createAppointmentApprovedNotification,
  createAppointmentCancelledNotification,
  createFoundPetNotification,
  createNewAppointmentNotification,
  createAppointmentCancelledByOwnerNotification,
};
