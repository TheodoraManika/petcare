// Route constants
export const ROUTES = {
  home: '/',
  confirmation: '/confirmation',
  vet: {
    dashboard: '/vet/dashboard',
    profile: '/vet/profile',
    register: '/vet/register',
    operations: '/vet/operations',
    reviews: '/vet/reviews',
    history: '/vet/history',
    appointments: '/vet/appointments',
    availability: '/vet/availability',
    lifeEvent: '/vet/life-event',
    lostPetForm: '/vet/lost-pet',
    foundPetForm: '/vet/found-pet',
  },
};

// Greek translations ΤΙ ΕΙΝΑΙ ΑΥΤΟ ΚΑΙ ΓΙΑΤΙ ΤΟ ΘΕΛΟΥΜΕ ΚΑΛΕ
export const GR = {
  nav: {
    myPage: 'Μενού',
    myPets: 'Τα Κατοικίδιά μου',
    appointments: 'Ραντεβού',
    profile: 'Προφίλ',
    logout: 'Αποσύνδεση',
  },
  dashboard: {
    title: 'Μενού',
    welcome: 'Καλώς ήρθατε',
  },
  pets: {
    title: 'Βιβλιάριο Υγείας',
    description: 'Προβολή στοιχείων κατοικιδίων',
  },
  appointments: {
    title: 'Τα Ραντεβού μου',
    description: 'Διαχείριση ραντεβού',
  },
  vets: {
    title: 'Αναζήτηση Κτηνιάτρων',
    description: 'Αναζήτηση επαγγελματιών κτηνιάτρων',
  },
  lostPet: {
    title: 'Δήλωση Απώλειας',
    description: 'Δήλωση απώλειας ενός κατοικιδίου',
  },
  foundPet: {
    title: 'Δήλωση Εύρεσης',
    description: 'Δήλωση εύρεσης ενός κατοικιδίου',
  },
  history: {
    title: 'Ιστορικό Δηλώσεων',
    description: 'Προβολή και επεξεργασία των δηλώσεων σας',
  },
  footer: {
    support: 'Υποστήριξη & Πληροφορίες',
    contact: 'Επικοινωνία',
    about: 'Σχετικά με Εμάς',
    legal: 'Νομικά',
    privacy: 'Πολιτική Απορρήτου',
    terms: 'Όροι & Προϋποθέσεις',
    cookies: 'Πολιτική Cookies',
    copyright: '© 2025 PetCare. Όλα τα δικαιώματα διατηρούνται.',
  },
};

// Alias UK to GR for backwards compatibility
export const UK = GR;