const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// Minimal database with only original test data
const minimalDb = {
  "users": [
    {
      "id": "1",
      "email": "owner@example.com",
      "password": "password123",
      "name": "Γιάννης",
      "lastName": "Παπαδόπουλος",
      "userType": "owner",
      "phone": "6912345678",
      "afm": "123456789",
      "address": "Λεωφόρος Αλεξάνδρας",
      "addressNumber": "42",
      "city": "Αθήνα",
      "postalCode": "11521",
      "avatar": null,
      "createdAt": "2025-01-05T00:00:00Z"
    },
    {
      "id": "2",
      "email": "vet@example.com",
      "password": "password123",
      "name": "Μαρία",
      "lastName": "Κατσαρίνη",
      "userType": "vet",
      "phone": "6987654321",
      "afm": "987654321",
      "specialization": "Γενική Κτηνιατρική",
      "clinicName": "Αθήνα Vet Care",
      "licenseNumber": "UET-12345",
      "licenseType": "Άδεια Ασκήσεως",
      "clinicAddress": "Πατριάρχου Γρηγορίου 26",
      "clinicCity": "Αθήνα",
      "clinicPostalCode": "15125",
      "avatar": null,
      "createdAt": "2025-01-05T00:00:00Z"
    },
    {
      "id": "3",
      "email": "vet2@example.com",
      "password": "password123",
      "name": "Κώστας",
      "lastName": "Δημόπουλος",
      "userType": "vet",
      "phone": "6945123456",
      "afm": "555555555",
      "specialization": "Χειρουργική",
      "clinicName": "Θεσσαλονίκη Pet Hospital",
      "licenseNumber": "UET-54321",
      "licenseType": "Άδεια Ασκήσεως",
      "clinicAddress": "Αγία Σοφία 100",
      "clinicCity": "Θεσσαλονίκη",
      "clinicPostalCode": "54622",
      "avatar": null,
      "createdAt": "2025-01-05T00:00:00Z"
    }
  ],
  "pets": [
    {
      "id": "1",
      "ownerId": 1,
      "name": "Μάξ",
      "species": "dog",
      "breed": "Golden Retriever",
      "gender": "male",
      "birthDate": "2022-01-15",
      "color": "Χρυσό",
      "weight": "30",
      "microchipId": "123456789012345",
      "registeredByVetId": 2,
      "createdAt": "2025-01-05T00:00:00Z"
    },
    {
      "id": "2",
      "ownerId": 1,
      "name": "Μίσα",
      "species": "cat",
      "breed": "Persian",
      "gender": "female",
      "birthDate": "2023-05-20",
      "color": "Λευκό",
      "weight": "4.5",
      "microchipId": "987654321098765",
      "registeredByVetId": 2,
      "createdAt": "2025-01-05T00:00:00Z"
    }
  ],
  "lostPets": [],
  "foundPets": [],
  "medicalProcedures": [],
  "availability": [],
  "appointments": []
};

console.log('='.repeat(60));
console.log('RESETTING DATABASE');
console.log('='.repeat(60));
console.log('\n⚠️  WARNING: This will delete all seeded data!\n');

// Get current stats before reset
const currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log('📊 CURRENT DATABASE STATE:');
console.log(`   • Users: ${currentDb.users.length}`);
console.log(`   • Pets: ${currentDb.pets.length}`);
console.log(`   • Medical Procedures: ${currentDb.medicalProcedures.length}`);
console.log(`   • Lost Pets: ${currentDb.lostPets.length}`);
console.log(`   • Found Pets: ${currentDb.foundPets.length}`);
console.log(`   • Availability Slots: ${currentDb.availability.length}`);
console.log(`   • Appointments: ${currentDb.appointments.length}`);

// Write minimal database
fs.writeFileSync(dbPath, JSON.stringify(minimalDb, null, 2));

console.log('\n📊 DATABASE RESET TO MINIMAL STATE:');
console.log(`   • Users: 3 (1 owner + 2 vets)`);
console.log(`   • Pets: 2 (owner's test pets)`);
console.log(`   • Medical Procedures: 0`);
console.log(`   • Lost Pets: 0`);
console.log(`   • Found Pets: 0`);
console.log(`   • Availability Slots: 0`);
console.log(`   • Appointments: 0`);

console.log('\n' + '='.repeat(60));
console.log('✅ DATABASE RESET SUCCESSFUL!');
console.log('='.repeat(60));

console.log('\n✨ Test Accounts Available:');
console.log(`   Owner: owner@example.com / password123`);
console.log(`   Vet 1: vet@example.com / password123`);
console.log(`   Vet 2: vet2@example.com / password123\n`);
