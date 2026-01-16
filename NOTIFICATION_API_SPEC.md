# Notification System API Specification

## Overview
Το notification system χρησιμοποιεί templates για να δημιουργεί δυναμικά μηνύματα. Κάθε notification πρέπει να περιέχει τα κατάλληλα δεδομένα ανάλογα με τον τύπο του.

## API Endpoint
```
GET /notifications?userId={userId}&userType={userType}
```

### Query Parameters
- `userId` (required): The ID of the user
- `userType` (required): Either "owner" or "vet"

## Notification Structure

### Base Notification Object
```json
{
  "id": number,
  "type": string,
  "title": string,
  "data": object,
  "date": string (ISO 8601 format),
  "read": boolean,
  "icon": string
}
```

---

## Owner Notification Types

### 1. Appointment Approved (`appointment_approved`)
**Trigger:** Όταν ο κτηνίατρος εγκρίνει ένα ραντεβού (status: pending → confirmed)

**Required Data:**
```json
{
  "type": "appointment_approved",
  "title": "Το ραντεβού σας εγκρίθηκε",
  "data": {
    "vetName": "Δρ. Πετρίδης",
    "appointmentDate": "15/01/2026",
    "appointmentTime": "10:00",
    "petName": "Μάξ"
  },
  "date": "2026-01-10T14:30:00Z",
  "read": false,
  "icon": "check"
}
```

**Generated Message:**
> "Το ραντεβού σας με τον {vetName} για τις {appointmentDate} στις {appointmentTime} για το κατοικίδιο {petName} εγκρίθηκε."

---

### 2. Appointment Cancelled (`appointment_cancelled`)
**Trigger:** Όταν ο κτηνίατρος ακυρώνει ένα ραντεβού (status: confirmed → cancelled)

**Required Data:**
```json
{
  "type": "appointment_cancelled",
  "title": "Το ραντεβού σας ακυρώθηκε",
  "data": {
    "vetName": "Δρ. Κωνσταντίνου",
    "appointmentDate": "12/01/2026",
    "appointmentTime": "14:00",
    "petName": "Λούκυ"
  },
  "date": "2026-01-09T16:20:00Z",
  "read": false,
  "icon": "cancel"
}
```

**Generated Message:**
> "Το ραντεβού σας με τον {vetName} για τις {appointmentDate} στις {appointmentTime} για το κατοικίδιο {petName} ακυρώθηκε από τον κτηνίατρο."

---

### 3. Found Pet Declaration (`found_pet`)
**Trigger:** Όταν κάποιος κάνει δήλωση εύρεσης για ένα χαμένο κατοικίδιο

**Required Data:**
```json
{
  "type": "found_pet",
  "title": "Δήλωση εύρεσης κατοικιδίου",
  "data": {
    "petName": "Μάξ",
    "finderName": "Μαρία Παπαδοπούλου",  // Optional
    "location": "Κέντρο Αθήνας"          // Optional
  },
  "date": "2026-01-08T11:15:00Z",
  "read": false,
  "icon": "pet"
}
```

**Generated Message (with finderName & location):**
> "{finderName} έκανε δήλωση εύρεσης για το κατοικίδιό σας \"{petName}\" στην περιοχή {location}."

**Generated Message (without finderName):**
> "Κάποιος έκανε δήλωση εύρεσης για το κατοικίδιό σας \"{petName}\"."

---

## Vet Notification Types

### 1. New Appointment Request (`new_appointment`)
**Trigger:** Όταν ένας ιδιοκτήτης κάνει αίτημα ραντεβού (status: pending)

**Required Data:**
```json
{
  "type": "new_appointment",
  "title": "Νέο αίτημα ραντεβού",
  "data": {
    "ownerName": "Μαρία Παπαδοπούλου",
    "appointmentDate": "15/01/2026",
    "appointmentTime": "10:00",
    "petName": "Μάξ"
  },
  "date": "2026-01-10T09:30:00Z",
  "read": false,
  "icon": "calendar"
}
```

**Generated Message:**
> "{ownerName} ζήτησε ραντεβού για τις {appointmentDate} στις {appointmentTime} για το κατοικίδιο {petName}. Εγκρίνετε ή ακυρώστε το αίτημα."

---

### 2. Appointment Cancelled by Owner (`appointment_cancelled_by_owner`)
**Trigger:** Όταν ένας ιδιοκτήτης ακυρώνει ένα ραντεβού

**Required Data:**
```json
{
  "type": "appointment_cancelled_by_owner",
  "title": "Ακύρωση ραντεβού",
  "data": {
    "ownerName": "Νίκος Γεωργίου",
    "appointmentDate": "14/01/2026",
    "appointmentTime": "14:00",
    "petName": "Ρεξ"
  },
  "date": "2026-01-09T18:45:00Z",
  "read": false,
  "icon": "cancel"
}
```

**Generated Message:**
> "{ownerName} ακύρωσε το ραντεβού για τις {appointmentDate} στις {appointmentTime} για το κατοικίδιο {petName}."

---

## Backend Implementation Guide

### When to Create Notifications

#### For Owners:
1. **appointment_approved**: Στο endpoint που ο vet εγκρίνει ραντεβού
   - Endpoint: `PATCH /appointments/:id/approve`
   - Όταν: `status` changes from `pending` to `confirmed`

2. **appointment_cancelled**: Στο endpoint που ο vet ακυρώνει ραντεβού
   - Endpoint: `PATCH /appointments/:id/cancel`
   - Όταν: `status` changes to `cancelled` by vet

3. **found_pet**: Στο endpoint δήλωσης εύρεσης
   - Endpoint: `POST /found-pets`
   - Όταν: Νέα δήλωση εύρεσης που ταιριάζει με χαμένο κατοικίδιο

#### For Vets:
1. **new_appointment**: Στο endpoint δημιουργίας ραντεβού
   - Endpoint: `POST /appointments`
   - Όταν: Νέο αίτημα ραντεβού δημιουργείται

2. **appointment_cancelled_by_owner**: Στο endpoint ακύρωσης από owner
   - Endpoint: `PATCH /appointments/:id/cancel`
   - Όταν: Owner ακυρώνει ραντεβού

### Example Backend Implementation (Node.js/Express)

```javascript
// Create notification helper function
async function createNotification(userId, userType, notificationType, data) {
  const notification = {
    userId,
    userType,
    type: notificationType,
    title: getNotificationTitle(notificationType),
    data,
    date: new Date().toISOString(),
    read: false,
    icon: getNotificationIcon(notificationType)
  };
  
  await db.notifications.create(notification);
}

// Example: When vet approves appointment
router.patch('/appointments/:id/approve', async (req, res) => {
  const appointment = await db.appointments.findById(req.params.id);
  
  // Update appointment status
  appointment.status = 'confirmed';
  await appointment.save();
  
  // Get related data
  const vet = await db.users.findById(appointment.vetId);
  const pet = await db.pets.findById(appointment.petId);
  
  // Create notification for owner
  await createNotification(
    appointment.ownerId,
    'owner',
    'appointment_approved',
    {
      vetName: vet.name,
      appointmentDate: formatDate(appointment.date),
      appointmentTime: formatTime(appointment.time),
      petName: pet.name
    }
  );
  
  res.json({ success: true, appointment });
});
```

### Database Schema Suggestion

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('owner', 'vet')),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  icon VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, user_type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_date ON notifications(date DESC);
```

## Testing

### Test Data Examples

```javascript
// Test notification for owner (appointment approved)
{
  "userId": 1,
  "userType": "owner",
  "type": "appointment_approved",
  "title": "Το ραντεβού σας εγκρίθηκε",
  "data": {
    "vetName": "Δρ. Πετρίδης",
    "appointmentDate": "15/01/2026",
    "appointmentTime": "10:00",
    "petName": "Μάξ"
  },
  "date": "2026-01-10T14:30:00Z",
  "read": false,
  "icon": "check"
}

// Test notification for vet (new appointment)
{
  "userId": 2,
  "userType": "vet",
  "type": "new_appointment",
  "title": "Νέο αίτημα ραντεβού",
  "data": {
    "ownerName": "Μαρία Παπαδοπούλου",
    "appointmentDate": "15/01/2026",
    "appointmentTime": "10:00",
    "petName": "Μάξ"
  },
  "date": "2026-01-10T09:30:00Z",
  "read": false,
  "icon": "calendar"
}
```

## Additional Endpoints Needed

### Mark Notification as Read
```
PATCH /notifications/:id/read
```

### Mark All Notifications as Read
```
PATCH /notifications/mark-all-read?userId={userId}
```

### Delete Notification
```
DELETE /notifications/:id
```

### Get Unread Count
```
GET /notifications/unread-count?userId={userId}
```

Response:
```json
{
  "count": 5
}
```
