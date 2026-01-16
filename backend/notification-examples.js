/**
 * Example Usage of Notification System
 * This file shows how to use the notification helpers in your backend endpoints
 */

const {
  createAppointmentApprovedNotification,
  createAppointmentCancelledNotification,
  createFoundPetNotification,
  createNewAppointmentNotification,
  createAppointmentCancelledByOwnerNotification,
} = require('./notification-helpers');

// Example 1: Vet approves appointment
// POST /appointments/:id/approve
async function approveAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    
    // Get appointment
    const appointment = await db.appointments.findById(appointmentId);
    
    // Update status
    appointment.status = 'confirmed';
    await appointment.save();
    
    // Get related data
    const vet = await db.users.findById(appointment.vetId);
    const pet = await db.pets.findById(appointment.petId);
    
    // Create notification for owner
    const notification = createAppointmentApprovedNotification(
      appointment.ownerId,
      appointment,
      vet,
      pet
    );
    
    // Save notification to database
    await db.notifications.create(notification);
    
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 2: Vet cancels appointment
// POST /appointments/:id/cancel
async function cancelAppointmentByVet(req, res) {
  try {
    const appointmentId = req.params.id;
    
    // Get appointment
    const appointment = await db.appointments.findById(appointmentId);
    
    // Update status
    appointment.status = 'cancelled';
    appointment.cancelledBy = 'vet';
    await appointment.save();
    
    // Get related data
    const vet = await db.users.findById(appointment.vetId);
    const pet = await db.pets.findById(appointment.petId);
    
    // Create notification for owner
    const notification = createAppointmentCancelledNotification(
      appointment.ownerId,
      appointment,
      vet,
      pet
    );
    
    await db.notifications.create(notification);
    
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 3: Owner creates appointment request
// POST /appointments
async function createAppointment(req, res) {
  try {
    const { vetId, petId, date, time, reason } = req.body;
    const ownerId = req.user.id; // From authentication middleware
    
    // Create appointment
    const appointment = await db.appointments.create({
      vetId,
      ownerId,
      petId,
      date,
      time,
      reason,
      status: 'pending',
    });
    
    // Get related data
    const owner = await db.users.findById(ownerId);
    const pet = await db.pets.findById(petId);
    
    // Create notification for vet
    const notification = createNewAppointmentNotification(
      vetId,
      appointment,
      owner,
      pet
    );
    
    await db.notifications.create(notification);
    
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 4: Owner cancels appointment
// POST /appointments/:id/cancel-by-owner
async function cancelAppointmentByOwner(req, res) {
  try {
    const appointmentId = req.params.id;
    const ownerId = req.user.id;
    
    // Get appointment
    const appointment = await db.appointments.findById(appointmentId);
    
    // Verify ownership
    if (appointment.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Update status
    appointment.status = 'cancelled';
    appointment.cancelledBy = 'owner';
    await appointment.save();
    
    // Get related data
    const owner = await db.users.findById(ownerId);
    const pet = await db.pets.findById(appointment.petId);
    
    // Create notification for vet
    const notification = createAppointmentCancelledByOwnerNotification(
      appointment.vetId,
      appointment,
      owner,
      pet
    );
    
    await db.notifications.create(notification);
    
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 5: Found pet declaration
// POST /found-pets
async function declarePetFound(req, res) {
  try {
    const { petId, finderName, location, description } = req.body;
    
    // Create found pet declaration
    const foundPet = await db.foundPets.create({
      petId,
      finderName,
      location,
      description,
      date: new Date(),
    });
    
    // Get pet and owner
    const pet = await db.pets.findById(petId);
    
    if (pet && pet.isLost) {
      // Create notification for owner
      const notification = createFoundPetNotification(
        pet.ownerId,
        pet,
        finderName,
        location
      );
      
      await db.notifications.create(notification);
    }
    
    res.json({ success: true, foundPet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 6: Get user notifications
// GET /notifications
async function getUserNotifications(req, res) {
  try {
    const userId = req.query.userId || req.user.id;
    const userType = req.query.userType || req.user.userType;
    
    const notifications = await db.notifications
      .find({ userId, userType })
      .sort({ date: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 7: Mark notification as read
// PATCH /notifications/:id/read
async function markNotificationAsRead(req, res) {
  try {
    const notificationId = req.params.id;
    
    const notification = await db.notifications.findById(notificationId);
    notification.read = true;
    await notification.save();
    
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 8: Mark all notifications as read
// PATCH /notifications/mark-all-read
async function markAllNotificationsAsRead(req, res) {
  try {
    const userId = req.query.userId || req.user.id;
    
    await db.notifications.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 9: Delete notification
// DELETE /notifications/:id
async function deleteNotification(req, res) {
  try {
    const notificationId = req.params.id;
    
    await db.notifications.findByIdAndDelete(notificationId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Example 10: Get unread notification count
// GET /notifications/unread-count
async function getUnreadCount(req, res) {
  try {
    const userId = req.query.userId || req.user.id;
    
    const count = await db.notifications.countDocuments({
      userId,
      read: false,
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Export all example functions
module.exports = {
  approveAppointment,
  cancelAppointmentByVet,
  createAppointment,
  cancelAppointmentByOwner,
  declarePetFound,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
};
