const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// Read current db.json
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// ======================== VETS SEEDING ========================
console.log('='.repeat(60));
console.log('POPULATING ENTIRE BACKEND DATABASE');
console.log('='.repeat(60));
console.log('\n📋 PHASE 1: Creating Vet Profiles with Availability\n');

const vetFirstNames = [
  'Παναγιώτης', 'Γεώργιος', 'Διαμαντής', 'Νικόλαος', 'Θωμάς',
  'Ιωάννης', 'Αναστάσιος', 'Δημήτριος', 'Κωνσταντίνος', 'Σωτήριος'
];

const vetLastNames = [
  'Παπαδόπουλος', 'Παπανδρέου', 'Στάμου', 'Νικολάου', 'Δημητριάδης',
  'Αναστασίου', 'Κωνσταντινίδης', 'Γεωργιάδης', 'Πετρίδης', 'Χαραλάμπους',
  'Σταθόπουλος', 'Ματθαίου', 'Λυδάκης', 'Σακελλαρίου', 'Βασιλείου'
];

const clinicNames = [
  'Κέντρο Κτηνιατρικής Φροντίδας', 'Ζωοϊατρική Κλινική Αθήνας', 'Pet Care Clinic',
  'Veterinary Hospital', 'Μεσογείων Vet', 'Αγάπη Pets', 'Happy Paws',
  'Vet Plus', 'Animal Care Center', 'Λάσκαρη Vet Clinic'
];

const specializations = [
  'Γενική Κτηνιατρική', 'Χειρουργική', 'Οδοντιατρική', 'Ορθοπεδική',
  'Δερματολογία', 'Καρδιολογία', 'Νευρολογία'
];

const vetCities = [
  'Αθήνα', 'Θεσσαλονίκη', 'Πάτρα', 'Λάρισα', 'Ρόδος',
  'Κέρκυρα', 'Λήμνος', 'Μύκονος', 'Σαντορίνη', 'Χανιά'
];

const serviceTypes = [
  'vaccination', 'checkup', 'surgery', 'treatment', 'dental',
  'emergency', 'consultation', 'grooming'
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function generatePhone() {
  return '69' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

function generateAFM() {
  return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

function generateLicenseNumber() {
  return 'UET-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

function generateTimeSlot() {
  const startHours = [8, 9, 10];
  const startHour = startHours[Math.floor(Math.random() * startHours.length)];
  const endHour = startHour + 4 + Math.floor(Math.random() * 4);
  return {
    start: `${String(startHour).padStart(2, '0')}:00`,
    end: `${String(Math.min(endHour, 21)).padStart(2, '0')}:00`
  };
}

function generateVetAvailability(vetId) {
  const availability = [];
  const selectedDays = [];
  
  while (selectedDays.length < Math.min(3 + Math.floor(Math.random() * 3), 6)) {
    const day = days[Math.floor(Math.random() * days.length)];
    if (!selectedDays.includes(day)) {
      selectedDays.push(day);
    }
  }

  selectedDays.forEach(day => {
    const hasMoreShifts = Math.random() > 0.6;
    
    const slot1 = generateTimeSlot();
    availability.push({
      id: `${vetId}-${day}-1`,
      vetId: vetId,
      day: day,
      startTime: slot1.start,
      endTime: slot1.end,
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      createdAt: new Date().toISOString()
    });

    if (hasMoreShifts) {
      const slot2 = generateTimeSlot();
      availability.push({
        id: `${vetId}-${day}-2`,
        vetId: vetId,
        day: day,
        startTime: slot2.start,
        endTime: slot2.end,
        serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        createdAt: new Date().toISOString()
      });
    }
  });

  return availability;
}

let nextVetId = Math.max(...db.users.filter(u => u.userType === 'vet').map(u => parseInt(u.id)), 3) + 1;
let nextAvailabilityId = Math.max(...db.availability.map(a => {
  const num = parseInt(a.id);
  return isNaN(num) ? 0 : num;
}), 0) + 1;

const numVets = 8;
let vetsCreated = 0;

for (let i = 0; i < numVets; i++) {
  const firstName = vetFirstNames[Math.floor(Math.random() * vetFirstNames.length)];
  const lastName = vetLastNames[Math.floor(Math.random() * vetLastNames.length)];
  const city = vetCities[Math.floor(Math.random() * vetCities.length)];
  const clinicName = clinicNames[Math.floor(Math.random() * clinicNames.length)];
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];

  const newVet = {
    id: String(nextVetId),
    email: `vet${nextVetId}@example.com`,
    password: 'password123',
    name: firstName,
    lastName: lastName,
    userType: 'vet',
    phone: generatePhone(),
    afm: generateAFM(),
    specialization: specialization,
    clinicName: clinicName,
    licenseNumber: generateLicenseNumber(),
    licenseType: 'Άδεια Ασκήσεως',
    clinicAddress: `${['Λεωφόρος', 'Οδός', 'Πλατεία'][Math.floor(Math.random() * 3)]} ${['Κύπρου', 'Θεσσαλονίκης', 'Πατησίων', 'Αμαλιάδος', 'Μαρνών'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 200) + 1}`,
    clinicCity: city,
    clinicPostalCode: String(Math.floor(Math.random() * 90000) + 10000),
    avatar: null,
    createdAt: new Date().toISOString()
  };

  db.users.push(newVet);
  vetsCreated++;

  const availabilitySlots = generateVetAvailability(nextVetId);
  db.availability.push(...availabilitySlots);

  console.log(`✓ ${firstName} ${lastName} (${specialization}) - ${availabilitySlots.length} availability slots`);

  nextVetId++;
}

// ======================== OWNERS SEEDING ========================
console.log('\n📋 PHASE 2: Creating Owner Profiles with Pets\n');

const ownerFirstNames = [
  'Μαρία', 'Ελένη', 'Αναστασία', 'Σοφία', 'Γεωργία',
  'Παναγιώτης', 'Αλέξανδρος', 'Δημήτριος', 'Κωνσταντίνος', 'Νικόλαος'
];

const ownerLastNames = [
  'Παπαδόπουλος', 'Παπανδρέου', 'Στάμου', 'Νικολάου', 'Δημητριάδης',
  'Αναστασίου', 'Κωνσταντινίδης', 'Γεωργιάδης', 'Πετρίδης', 'Χαραλάμπους'
];

const petNames = [
  'Μάξ', 'Σάσα', 'Μπέλα', 'Λούκι', 'Ζιγκ', 'Ρόκο', 'Σκάι', 'Ντόρα', 'Παλ', 'Μπάμπης',
  'Τόμας', 'Τζάρλι', 'Κόπι', 'Μίνι', 'Μούσκα', 'Τίνα', 'Σίμπα', 'Λέο'
];

const dogBreeds = [
  'Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Poodle',
  'Beagle', 'Dalmatian', 'Husky', 'Dachshund', 'Boxer'
];

const catBreeds = [
  'Persian', 'Siamese', 'Bengal', 'Maine Coon', 'Ragdoll',
  'British Shorthair', 'Scottish Fold', 'Sphynx', 'Abyssinian', 'Turkish Angora'
];

const petColors = [
  'Χρυσό', 'Μαύρο', 'Λευκό', 'Καφέ', 'Γκρι', 'Κόκκινο', 'Τρίχρωμο', 'Ασημί'
];

const ownerCities = [
  'Αθήνα', 'Θεσσαλονίκη', 'Πάτρα', 'Λάρισα', 'Ρόδος',
  'Κέρκυρα', 'Λήμνος', 'Μύκονος', 'Σαντορίνη', 'Χανιά'
];

const ownerStreets = [
  'Λεωφόρος Αλεξάνδρας', 'Οδός Πατησίων', 'Λεωφόρος Μαραθώνος', 'Οδός Σταδίου',
  'Λεωφόρος Κύπρου', 'Οδός Αμαλιάδος', 'Λεωφόρος Θεσσαλονίκης', 'Πλατεία Σύνταγματος'
];

function generatePetBirthDate() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024];
  const year = years[Math.floor(Math.random() * years.length)];
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateMicrochipId() {
  return Math.floor(Math.random() * 10000000000000000).toString().padStart(15, '0');
}

let nextOwnerId = Math.max(...db.users.filter(u => u.userType === 'owner').map(u => parseInt(u.id)), 0) + 1;
let nextPetId = Math.max(...db.pets.map(p => parseInt(p.id)), 0) + 1;
let vetIdList = db.users.filter(u => u.userType === 'vet').map(u => parseInt(u.id));

const numOwners = 6;
let ownersCreated = 0;
let petsCreated = 0;

for (let i = 0; i < numOwners; i++) {
  const firstName = ownerFirstNames[Math.floor(Math.random() * ownerFirstNames.length)];
  const lastName = ownerLastNames[Math.floor(Math.random() * ownerLastNames.length)];
  const city = ownerCities[Math.floor(Math.random() * ownerCities.length)];
  const street = ownerStreets[Math.floor(Math.random() * ownerStreets.length)];

  const newOwner = {
    id: String(nextOwnerId),
    email: `owner${nextOwnerId}@example.com`,
    password: 'password123',
    name: firstName,
    lastName: lastName,
    userType: 'owner',
    phone: generatePhone(),
    afm: generateAFM(),
    address: street,
    addressNumber: String(Math.floor(Math.random() * 200) + 1),
    city: city,
    postalCode: String(Math.floor(Math.random() * 90000) + 10000),
    avatar: null,
    createdAt: new Date().toISOString()
  };

  db.users.push(newOwner);
  ownersCreated++;

  const numPets = Math.floor(Math.random() * 3) + 1;

  for (let p = 0; p < numPets; p++) {
    const isCat = Math.random() > 0.6;
    const species = isCat ? 'cat' : 'dog';
    const breed = isCat 
      ? catBreeds[Math.floor(Math.random() * catBreeds.length)]
      : dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    
    const petName = petNames[Math.floor(Math.random() * petNames.length)];
    const weight = isCat 
      ? (Math.random() * 4 + 2).toFixed(1)
      : (Math.random() * 35 + 15).toFixed(1);

    const newPet = {
      id: String(nextPetId),
      ownerId: Number(nextOwnerId),
      name: petName,
      species: species,
      breed: breed,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      birthDate: generatePetBirthDate(),
      color: petColors[Math.floor(Math.random() * petColors.length)],
      weight: weight,
      microchipId: generateMicrochipId(),
      registeredByVetId: vetIdList[Math.floor(Math.random() * vetIdList.length)],
      createdAt: new Date().toISOString()
    };

    db.pets.push(newPet);
    petsCreated++;
    nextPetId++;
  }

  console.log(`✓ ${firstName} ${lastName} - ${numPets} pet(s)`);
  nextOwnerId++;
}

// ======================== MEDICAL HISTORY SEEDING ========================
console.log('\n📋 PHASE 3: Creating Medical History for All Pets\n');

const procedureTypes = [
  'vaccination', 'checkup', 'surgery', 'treatment', 'dental',
  'emergency', 'consultation', 'grooming'
];

const descriptions = {
  'vaccination': [
    'Πενταπλός εμβολιασμός', 'Εμβόλιο λύσσας', 'Εμβόλιο κατά της φόνης',
    'Τριπλός εμβολιασμός', 'Ετήσιος εμβολιασμός'
  ],
  'checkup': [
    'Γενική εξέταση υγείας', 'Ετήσιος κλινικός έλεγχος', 'Έλεγχος για ενδοπαράσιτα',
    'Έλεγχος καρδιάς', 'Έλεγχος αναπνοής', 'Γενικό τεστ αίματος'
  ],
  'surgery': [
    'Στείρωση', 'Ευνουχοποίηση', 'Αφαίρεση χοληδόχου κύστης',
    'Επιδιόρθωση δακτύλου', 'Αφαίρεση όγκου'
  ],
  'treatment': [
    'Θεραπεία λοίμωξης', 'Θεραπεία δερματικής νόσου', 'Θεραπεία γαστρεντερικής διαταραχής',
    'Θεραπεία ωτίτιδας', 'Φυσιοθεραπεία'
  ],
  'dental': [
    'Καθαρισμός δοντιών', 'Αφαίρεση δοντιού', 'Έλεγχος δοντιών',
    'Θεραπεία περιοδοντίας', 'Σκάλινγκ δοντιών'
  ],
  'emergency': [
    'Έκτακτη περίπτωση - κατάγματα', 'Έκτακτη περίπτωση - δηλητηρίαση',
    'Έκτακτη περίπτωση - αναφυλακτικό σοκ', 'Έκτακτη περίπτωση - τραυματισμός'
  ],
  'consultation': [
    'Συμβουλή διατροφής', 'Συμβουλή συμπεριφοράς', 'Συμβουλή υγιεινής',
    'Προ-χειρουργική συμβουλή', 'Τηλεφωνική συμβουλή'
  ],
  'grooming': [
    'Περιποίηση και κοπή τριχών', 'Καθαρισμός αυτιών', 'Κοπή νυχιών',
    'Καθαρισμός αναλ πόρων'
  ]
};

function generatePastDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 600) + 10;
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

let nextMedicalId = Math.max(
  ...db.medicalProcedures.map(m => parseInt(m.id) || 0),
  0
) + 1;

let totalMedicalEntries = 0;

db.pets.forEach(pet => {
  const numProcedures = Math.floor(Math.random() * 4) + 2;

  for (let i = 0; i < numProcedures; i++) {
    const procedureType = procedureTypes[Math.floor(Math.random() * procedureTypes.length)];
    const possibleDescriptions = descriptions[procedureType];
    const description = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
    const vetId = vetIdList[Math.floor(Math.random() * vetIdList.length)];

    const newProcedure = {
      id: String(nextMedicalId),
      petId: Number(pet.id),
      vetId: vetId,
      type: procedureType,
      date: generatePastDate(),
      description: description,
      createdAt: new Date().toISOString()
    };

    db.medicalProcedures.push(newProcedure);
    nextMedicalId++;
    totalMedicalEntries++;
  }
});

console.log(`✓ Created ${totalMedicalEntries} medical history entries`);

// ======================== WRITE TO DATABASE ========================
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ DATABASE SUCCESSFULLY POPULATED!');
console.log('='.repeat(60));
console.log(`\n📊 SUMMARY:`);
console.log(`   • Vets: ${vetsCreated} new (${db.users.filter(u => u.userType === 'vet').length} total)`);
console.log(`   • Owners: ${ownersCreated} new (${db.users.filter(u => u.userType === 'owner').length} total)`);
console.log(`   • Pets: ${petsCreated} new (${db.pets.length} total)`);
console.log(`   • Medical Procedures: ${totalMedicalEntries} new (${db.medicalProcedures.length} total)`);
console.log(`   • Availability Slots: ${db.availability.length} total`);
console.log('\n✨ You can now log in and test the system!\n');
