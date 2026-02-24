// Route constants
export const ROUTES = {
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  contact: '/contact',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  information: '/information',
  confirmation: '/confirmation',
  success: '/success',
  confirm: '/confirm',
  citizen: {
    lostPets: '/citizen/lost-pets',
    foundPetForm: '/citizen/found-pet',
    searchMap: '/vet/search-map',
    information: '/citizen/information',
  },
  owner: {
    dashboard: '/owner/dashboard',
    profile: '/owner/profile',
    register: '/owner/register',
    pets: '/owner/pets',
    appointments: '/owner/appointments',
    lostPetForm: '/owner/lost-pet',
    foundPetForm: '/owner/found-pet',
    lostHistory: '/owner/history',
    information: '/owner/information',
  },
  vet: {
    dashboard: '/vet/dashboard',
    searchMap: '/vet/search-map',
    profile: '/vet/profile',
    register: '/vet/register',
    registerpet: '/vet/register-pet',
    operation: '/vet/operation',
    reviews: '/vet/reviews',
    history: '/vet/history',
    appointments: '/vet/appointments',
    availability: '/vet/availability',
    transfer: '/vet/transfer',
    foster: '/vet/foster',
    adoption: '/vet/adoption',
    lifeEvents: '/vet/life-events',
    lostPetForm: '/vet/lost-pet',
    foundPetForm: '/vet/found-pet',
    healthBook: '/vet/health-book',
    information: '/vet/information',
  },
};

export const SERVICE_LABELS = {
  vaccination: 'Εμβολιασμός',
  checkup: 'Γενική Εξέταση',
  surgery: 'Χειρουργείο',
  treatment: 'Θεραπεία',
  dental: 'Οδοντιατρική',
  ophthalmology: 'Οφθαλμολογική',
  cardiology: 'Καρδιολογική',
  dermatology: 'Δερματολογική',
  other: 'Όλες οι υπηρεσίες'
};

// Date formatting utility
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // If it's already in DD/MM/YYYY format, return as is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};