const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

// Read current db.json
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Clear existing data to start fresh (optional - comment out to preserve)
db.users = db.users.filter(u => u.id === '1'); // Keep only admin
db.pets = [];
db.medicalProcedures = [];
db.appointments = [];
db.availability = [];
db.lostPets = [];

console.log('='.repeat(70));
console.log('🏥 PETCARE DATABASE SEEDING - COMPREHENSIVE DATA GENERATION');
console.log('='.repeat(70));

// ======================== GREEK DATA ========================
const greekCities = {
  'Αθήνα': { postalCodeStart: 10100, clinics: ['Αγαμέμνονος 15', 'Πατησίων 120', 'Αλεξάνδρας 45', 'Μαραθώνος 88'] },
  'Θεσσαλονίκη': { postalCodeStart: 54100, clinics: ['Τσιμισκή 50', 'Εγνατίας 200', 'Φιλικής Εταιρίας 25'] },
  'Πάτρα': { postalCodeStart: 26100, clinics: ['Γεωργίου Παπανδρέου 30', 'Αγίου Ανδρέα 18'] },
  'Λάρισα': { postalCodeStart: 38100, clinics: ['Φαρσάλου 45', 'Πάπα 12'] },
  'Ρόδος': { postalCodeStart: 85100, clinics: ['Πλατεία Ιπποκράτους 5'] },
  'Χανιά': { postalCodeStart: 73100, clinics: ['Ταχυδρομική 40'] },
  'Μύκονος': { postalCodeStart: 84600, clinics: ['Ενοπλων Δυνάμεων 8'] },
  'Ηράκλειο': { postalCodeStart: 71100, clinics: ['Ανδρέα Παπανδρέου 60'] }
};

const vetFirstNames = [
  'Γιάννης', 'Παναγιώτης', 'Αλέξανδρος', 'Δημήτριος', 'Νικόλαος',
  'Κωνσταντίνος', 'Στάθης', 'Κώστας', 'Θοδωρής', 'Θάνος'
];

const vetLastNames = [
  'Παπαδόπουλος', 'Παπανδρέου', 'Σταμάτης', 'Νικολάου', 'Δημητρίδης',
  'Αναστασίου', 'Κωνσταντινίδης', 'Γεωργιάδης', 'Πετρίδης', 'Χαραλάμπους',
  'Σταθόπουλος', 'Ματθαίου', 'Λυδάκης', 'Σακελλαρίου', 'Βασιλείου'
];

const ownerFirstNames = [
  'Μαρία', 'Ελένη', 'Αναστασία', 'Σοφία', 'Γεωργία', 'Βάσω', 'Κατερίνα', 'Ρένα',
  'Αντώνης', 'Νίκος', 'Γιάννης', 'Αλέξανδρος', 'Δημήτρης', 'Πέτρος'
];

const ownerLastNames = [
  'Παπαδόπουλος', 'Παπανδρέου', 'Σταμάτης', 'Νικολάου', 'Δημητρίδης',
  'Αναστασίου', 'Κωνσταντινίδης', 'Γεωργιάδης', 'Πετρίδης', 'Χαραλάμπους'
];

const specializations = [
  'Γενική Κτηνιατρική',
  'Χειρουργική',
  'Δερματολογία',
  'Καρδιολογία',
  'Οδοντιατρική',
  'Οφθαλμολογία'
];

const petSpecies = ['Σκύλος', 'Γάτα'];

const dogBreeds = [
  'Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Poodle',
  'Beagle', 'Dalmatian', 'Husky', 'Dachshund', 'Boxer', 'Cocker Spaniel'
];

const catBreeds = [
  'Persian', 'Siamese', 'Bengal', 'Maine Coon', 'Ragdoll',
  'British Shorthair', 'Scottish Fold', 'Sphynx', 'Abyssinian'
];

const birdTypes = [
  'Παπαγάλος', 'Καρδερίνα', 'Ημερίδα', 'Παραδεισοπούλι', 'Κοτσύφας'
];

const reptileTypes = [
  'Χελώνα', 'Σαύρα', 'Φίδι', 'Τερατοσκώληξ'
];

const petNames = [
  'Μάξ', 'Σάσα', 'Μπέλα', 'Λούκι', 'Ζιγκ', 'Ρόκο', 'Σκάι', 'Ντόρα',
  'Παλ', 'Μπάμπης', 'Τόμας', 'Τζάρλι', 'Κόπι', 'Μίνι', 'Μούσκα', 'Τίνα'
];

const colors = [
  'Χρυσό', 'Μαύρο', 'Λευκό', 'Καφέ', 'Γκρι', 'Κόκκινο', 'Τρίχρωμο', 'Ασημί'
];

const medicalTypes = [
  { value: 'Εμβολιασμός', label: 'Εμβολιασμός', descriptions: ['Πενταπλός εμβολιασμός', 'Εμβόλιο λύσσας', 'Τριπλός εμβολιασμός', 'Ετήσιος εμβολιασμός'] },
  { value: 'Γενική Εξέταση', label: 'Γενική Εξέταση', descriptions: ['Γενική εξέταση υγείας', 'Ετήσιος κλινικός έλεγχος', 'Έλεγχος ενδοπαρασίτων', 'Έλεγχος καρδιάς'] },
  { value: 'Χειρουργείο', label: 'Χειρουργείο', descriptions: ['Στείρωση', 'Ευνουχοποίηση', 'Αφαίρεση χοληδόχου κύστης', 'Αφαίρεση όγκου'] },
  { value: 'Θεραπεία', label: 'Θεραπεία', descriptions: ['Θεραπεία λοίμωξης', 'Θεραπεία δερματικής νόσου', 'Θεραπεία γαστρεντερικής διαταραχής', 'Φυσιοθεραπεία'] },
  { value: 'Οδοντιατρική', label: 'Οδοντιατρική', descriptions: ['Καθαρισμός δοντιών', 'Αφαίρεση δοντιού', 'Έλεγχος δοντιών', 'Σκάλινγκ δοντιών'] },
  { value: 'Επείγον Περιστατικό', label: 'Επείγον Περιστατικό', descriptions: ['Κατάγματα', 'Δηλητηρίαση', 'Αναφυλακτικό σοκ', 'Τραυματισμός'] },
  { value: 'Άλλο', label: 'Άλλο', descriptions: ['Συμβουλή διατροφής', 'Συμβουλή συμπεριφοράς', 'Έλεγχος μικροτσίπ'] }
];

// Helper functions
function generatePhone() {
  return '69' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

function generateAFM() {
  return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

function generateMicrochip() {
  return Math.floor(Math.random() * 10000000000000000).toString().padStart(15, '0');
}

function generateLicenseNumber() {
  return 'UET-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

function generatePostalCode(start) {
  return String(start + Math.floor(Math.random() * 999));
}

function getRandomElements(array, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const result = [];
  const indices = new Set();
  while (indices.size < Math.min(count, array.length)) {
    indices.add(Math.floor(Math.random() * array.length));
  }
  return Array.from(indices).map(i => array[i]);
}

function generatePastDate(daysBack = 365) {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysBack) + 1;
  const date = new Date(today);
  date.setDate(date.getDate() - randomDays);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function generateFutureDate(daysAhead = 90) {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysAhead) + 1;
  const date = new Date(today);
  date.setDate(date.getDate() + randomDays);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function generateTime() {
  const hours = [9, 10, 11, 12, 14, 15, 16, 17];
  const hour = hours[Math.floor(Math.random() * hours.length)];
  return `${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:00`;
}

function getCurrentDateFormatted() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function generateAvailability(vetId) {
  const availability = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const id = `${vetId}`;
  let slotCounter = 1;

  days.forEach(day => {
    // Morning shift
    availability.push({
      id: `${id}-${day}-${slotCounter}`,
      vetId: Number(vetId),
      day: day,
      startTime: '09:00',
      endTime: '14:00',
      serviceType: medicalTypes[Math.floor(Math.random() * medicalTypes.length)].value,
      createdAt: getCurrentDateFormatted()
    });
    slotCounter++;

    // Afternoon shift
    availability.push({
      id: `${id}-${day}-${slotCounter}`,
      vetId: Number(vetId),
      day: day,
      startTime: '14:00',
      endTime: '18:00',
      serviceType: medicalTypes[Math.floor(Math.random() * medicalTypes.length)].value,
      createdAt: getCurrentDateFormatted()
    });
    slotCounter++;
  });

  return availability;
}

// ======================== VET SEEDING ========================
console.log('\n📋 PHASE 1: Creating Vet Profiles with Availability\n');

const cityList = Object.keys(greekCities);
let nextVetId = 2;
const vets = [];

// Create 12 vets
for (let i = 0; i < 12; i++) {
  const firstName = vetFirstNames[Math.floor(Math.random() * vetFirstNames.length)];
  const lastName = vetLastNames[Math.floor(Math.random() * vetLastNames.length)];
  const city = cityList[Math.floor(Math.random() * cityList.length)];
  const cityData = greekCities[city];
  const clinic = cityData.clinics[Math.floor(Math.random() * cityData.clinics.length)];
  const vSpecializations = getRandomElements(specializations, 1, 2);

  const vet = {
    id: String(nextVetId),
    email: `vet${nextVetId}@petcare.gr`,
    password: 'password123',
    name: firstName,
    lastName: lastName,
    userType: 'vet',
    phone: generatePhone(),
    afm: generateAFM(),
    specialization: vSpecializations.join(', '),
    clinicName: `Κλινική Κτηνιατρική ${firstName}`,
    licenseNumber: generateLicenseNumber(),
    licenseType: 'Άδεια Ασκήσεως',
    clinicAddress: clinic,
    clinicCity: city,
    clinicPostalCode: generatePostalCode(cityData.postalCodeStart),
    experience: String(Math.floor(Math.random() * 20) + 3),
    education: `Πανεπιστήμιο Κτηνιατρικής ${['Αθήνας', 'Θεσσαλονίκης', 'Θεσσαλίας'][Math.floor(Math.random() * 3)]}`,
    biography: `Εξειδικευμένος κτηνίατρος με εμπειρία στις ειδικότητες: ${vSpecializations.join(', ')}`,
    avatar: null,
    createdAt: getCurrentDateFormatted()
  };

  db.users.push(vet);
  vets.push(vet);

  // Add availability
  const availability = generateAvailability(nextVetId);
  db.availability.push(...availability);

  console.log(`✓ ${firstName} ${lastName} (${city}) - ${vSpecializations.join(', ')}`);
  nextVetId++;
}

// ======================== OWNER & PET SEEDING ========================
console.log('\n📋 PHASE 2: Creating Owner Profiles with Pets\n');

let nextOwnerId = Math.max(...db.users.map(u => parseInt(u.id)), 1) + 1;
let nextPetId = 1;
const owners = [];
const petsByOwner = {};

// Create 10 owners with pets
for (let i = 0; i < 10; i++) {
  const firstName = ownerFirstNames[Math.floor(Math.random() * ownerFirstNames.length)];
  const lastName = ownerLastNames[Math.floor(Math.random() * ownerLastNames.length)];
  const city = cityList[Math.floor(Math.random() * cityList.length)];
  const cityData = greekCities[city];

  const owner = {
    id: String(nextOwnerId),
    email: `owner${nextOwnerId}@petcare.gr`,
    password: 'password123',
    name: firstName,
    lastName: lastName,
    userType: 'owner',
    phone: generatePhone(),
    afm: generateAFM(),
    address: cityData.clinics[Math.floor(Math.random() * cityData.clinics.length)],
    addressNumber: String(Math.floor(Math.random() * 100) + 1),
    city: city,
    postalCode: generatePostalCode(cityData.postalCodeStart),
    avatar: null,
    createdAt: getCurrentDateFormatted()
  };

  db.users.push(owner);
  owners.push(owner);
  petsByOwner[nextOwnerId] = [];

  // Add 1-3 pets per owner
  const numPets = Math.floor(Math.random() * 3) + 1;

  for (let p = 0; p < numPets; p++) {
    const speciesType = petSpecies[Math.floor(Math.random() * petSpecies.length)];
    let breed, weight;

    if (speciesType === 'Σκύλος') {
      breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
      weight = String((Math.random() * 40 + 10).toFixed(1));
    } else if (speciesType === 'Γάτα') {
      breed = catBreeds[Math.floor(Math.random() * catBreeds.length)];
      weight = String((Math.random() * 6 + 2).toFixed(1));
    } else if (speciesType === 'Πτηνό') {
      breed = birdTypes[Math.floor(Math.random() * birdTypes.length)];
      weight = String((Math.random() * 1 + 0.2).toFixed(2));
    } else {
      breed = reptileTypes[Math.floor(Math.random() * reptileTypes.length)];
      weight = String((Math.random() * 5 + 0.5).toFixed(1));
    }

    const petName = petNames[Math.floor(Math.random() * petNames.length)];
    const registeredVet = vets[Math.floor(Math.random() * vets.length)];

    const pet = {
      id: String(nextPetId),
      ownerId: Number(nextOwnerId),
      name: petName,
      species: speciesType,
      breed: breed,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      birthDate: generatePastDate(2000),
      color: colors[Math.floor(Math.random() * colors.length)],
      weight: weight,
      microchipId: generateMicrochip(),
      registeredByVetId: Number(registeredVet.id),
      createdAt: getCurrentDateFormatted()
    };

    db.pets.push(pet);
    petsByOwner[nextOwnerId].push(pet);
    nextPetId++;
  }

  console.log(`✓ ${firstName} ${lastName} (${city}) - ${numPets} pet(s)`);
  nextOwnerId++;
}

// ======================== MEDICAL HISTORY SEEDING ========================
console.log('\n📋 PHASE 3: Creating Medical History for Pets\n');

let nextMedicalId = 1;
let totalMedicalEntries = 0;

db.pets.forEach(pet => {
  const numProcedures = Math.floor(Math.random() * 5) + 2;

  for (let i = 0; i < numProcedures; i++) {
    const medicalType = medicalTypes[Math.floor(Math.random() * medicalTypes.length)];
    const description = medicalType.descriptions[Math.floor(Math.random() * medicalType.descriptions.length)];
    const vet = vets[Math.floor(Math.random() * vets.length)];

    const procedure = {
      id: String(nextMedicalId),
      petId: Number(pet.id),
      vetId: Number(vet.id),
      type: medicalType.value,
      date: generatePastDate(),
      description: description,
      createdAt: getCurrentDateFormatted()
    };

    db.medicalProcedures.push(procedure);
    nextMedicalId++;
    totalMedicalEntries++;
  }
});

console.log(`✓ Created ${totalMedicalEntries} medical history entries`);

// ======================== APPOINTMENTS SEEDING ========================
console.log('\n📋 PHASE 4: Creating Appointments for Vets\n');

let nextAppointmentId = 1;
let totalAppointments = 0;

// Create 15-20 appointments across all vets
const appointmentsPerVet = Math.floor(Math.random() * 3) + 2;

vets.forEach(vet => {
  for (let i = 0; i < appointmentsPerVet; i++) {
    const owner = owners[Math.floor(Math.random() * owners.length)];
    const petList = petsByOwner[Number(owner.id)];
    if (!petList || petList.length === 0) continue;

    const pet = petList[Math.floor(Math.random() * petList.length)];
    const medicalType = medicalTypes[Math.floor(Math.random() * medicalTypes.length)];
    const status = Math.random() > 0.4 ? 'confirmed' : 'pending';
    const appointmentDate = Math.random() > 0.5 ? generateFutureDate() : generatePastDate(30);

    const appointment = {
      id: String(nextAppointmentId),
      petId: Number(pet.id),
      vetId: Number(vet.id),
      ownerId: Number(owner.id),
      ownerName: `${owner.name} ${owner.lastName}`,
      ownerPhone: owner.phone,
      petName: pet.name,
      petSpecies: pet.species,
      petBreed: pet.breed,
      date: appointmentDate,
      time: generateTime(),
      serviceType: medicalType.value,
      notes: Math.random() > 0.6 ? `Σημειώσεις για το ραντεβού του/της ${pet.name}` : '',
      status: status,
      createdAt: getCurrentDateFormatted()
    };

    db.appointments.push(appointment);
    nextAppointmentId++;
    totalAppointments++;
  }
});

console.log(`✓ Created ${totalAppointments} appointments`);

// ======================== LOST PETS SEEDING ========================
console.log('\n📋 PHASE 5: Creating Lost Pets from Random Pets\n');

const lostAreas = [
  'Μαρούσι, Αθήνα', 'Κολωνάκι, Αθήνα', 'Ψυχικό, Αθήνα', 'Περισσόν, Αθήνα',
  'Θεσσαλονίκη κέντρο', 'Πάτρα κέντρο', 'Λάρισα κέντρο', 'Ρόδος κέντρο',
  'Κέντρο Χανίων', 'Ηράκλειο κέντρο', 'Μύκονος κέντρο'
];

const lostPetDescriptions = {
  'Σκύλος': [
    'χαμένος στην περιοχή. Πολύ φιλικός και άνθρωπος.',
    'χάθηκε χθες. Χαρακτηριστικό: λευκή κουκίδα στο στήθος.',
    'εξαφανίστηκε από το πάρκο. Φορά μπλε κολάρο.',
    'χαμένος. Δεν αγαπά ξένους αλλά είναι καλή ψυχή.',
    'έχει χαθεί για 2 εβδομάδες. Αν τον δείτε επικοινωνήστε άμεσα!'
  ],
  'Γάτα': [
    'χάθηκε από το σπίτι. Πολύ τρομαγμένη, δεν αγαπά ξένους.',
    'εξαφανίστηκε στη γειτονιά. Φορά κόκκινο κολάρο με καμπανέλα.',
    'χαμένη γάτα. Πιθανώς εγκλωβισμένη κάπου κοντά.',
    'διαφυγε ανεξήγητα. Πάρα πολύ ήρεμη και λίγο κοινωνική.',
    'χάθηκε χθες το βράδυ. Αν τη δείτε παρακαλώ φωνάξτε!'
  ]
};

let nextLostPetId = 1;
let totalLostPets = 0;

// Randomly select 30-40% of pets to be lost
const numLostPets = Math.floor(db.pets.length * (0.3 + Math.random() * 0.1));

for (let i = 0; i < numLostPets; i++) {
  const pet = db.pets[Math.floor(Math.random() * db.pets.length)];
  const owner = db.users.find(u => u.id === String(pet.ownerId));
  const vet = vets[Math.floor(Math.random() * vets.length)];
  const area = lostAreas[Math.floor(Math.random() * lostAreas.length)];
  const descriptions = lostPetDescriptions[pet.species] || lostPetDescriptions['Σκύλος'];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  const lostPet = {
    id: String(nextLostPetId),
    petId: Number(pet.id),
    ownerId: Number(pet.ownerId),
    reportedByVetId: Number(vet.id),
    microchipNumber: pet.microchipId,
    petName: pet.name,
    type: pet.species,
    breed: pet.breed,
    lostDate: generatePastDate(60),
    lostLocation: area,
    area: area,
    locationLat: String((38 + Math.random() * 2).toFixed(4)),
    locationLon: String((23 + Math.random() * 2).toFixed(4)),
    contactPhone: owner ? owner.phone : generatePhone(),
    contactEmail: owner ? owner.email : `owner${Math.random()}@petcare.gr`,
    ownerName: owner ? `${owner.name} ${owner.lastName}` : 'Unknown',
    color: pet.color,
    microchip: pet.microchipId,
    name: pet.name,
    description: `${pet.species === 'Σκύλος' ? 'Σκύλος' : 'Γάτα'} ${pet.breed}, ${pet.color}. ${description}`,
    status: 'active',
    imageUrl: null,
    createdAt: getCurrentDateFormatted()
  };

  db.lostPets.push(lostPet);
  nextLostPetId++;
  totalLostPets++;
}

console.log(`✓ Created ${totalLostPets} lost pet reports`);
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('\n' + '='.repeat(70));
console.log('✅ DATABASE SUCCESSFULLY POPULATED!');
console.log('='.repeat(70));

console.log(`\n📊 SUMMARY:\n`);
console.log(`   🏥 Vets: ${vets.length}`);
console.log(`      Cities: ${new Set(vets.map(v => v.clinicCity)).size}`);
console.log(`      Specializations: ${new Set(vets.flatMap(v => v.specialization.split(', '))).size}`);
console.log(`      Availability slots: ${db.availability.length}`);

console.log(`\n   👥 Owners: ${owners.length}`);
console.log(`      Cities: ${new Set(owners.map(o => o.city)).size}`);

console.log(`\n   🐾 Pets: ${db.pets.length}`);
db.pets.forEach(pet => {
  console.log(`      - ${pet.name} (${pet.species})`);
});

console.log(`\n   📋 Medical Procedures: ${totalMedicalEntries}`);
console.log(`   📅 Appointments: ${totalAppointments}`);
console.log(`   🚨 Lost Pets: ${totalLostPets}`);

console.log('\n✨ Database is ready for testing!\n');
