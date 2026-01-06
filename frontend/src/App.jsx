// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerProfile from './pages/owner/Profile';
import OwnerRegisterPage from './pages/owner/OwnerRegisterPage';
import OwnerLostPet from './pages/owner/LostPet';
import OwnerHealthBook from './pages/owner/HealthBook';
import OwnerPetDetail from './pages/owner/PetDetail';
import OwnerAppointments from './pages/owner/Appointments';
import OwnerReview from './pages/owner/Review';
import OwnerLostPetHistory from './pages/owner/LostPetHistory';
import OwnerLostPetHistoryDetail from './pages/owner/LostPetHistoryDetail';
import OwnerLostPetHistoryEdit from './pages/owner/LostPetHistoryEdit';

// Citizen Pages
import HomePage from './pages/citizen/HomePage';
import LostPets from './pages/citizen/LostPets';
import LostPetDetails from './pages/citizen/LostPetDetails';
import CitizenFoundPetForm from './pages/citizen/FoundPetForm';
import VetSearchMap from './pages/citizen/VetSearchMap';
import VetProfile from './pages/citizen/VetProfile';

// Vet Pages
import Dashboard from './pages/vet/Dashboard';
import Profile from './pages/vet/Profile';
import Reviews from './pages/vet/Reviews';
import VetRegisterPage from './pages/vet/VetRegisterPage';
import Register from './pages/vet/Register';
import Operation from './pages/vet/Operation';
import Availability from './pages/vet/Availability';
import Transfer from './pages/vet/Transfer';
import LifeEvents from './pages/vet/LifeEvents';
import Adoption from './pages/vet/Adoption';
import Foster from './pages/vet/Foster';
import History from './pages/vet/History';
import HistoryDetail from './pages/vet/HistoryDetail';
import LostPet from './pages/vet/LostPet';
import Appointments from './pages/vet/Appointments';

// Common Pages
import LoginPage from './pages/common/LoginPage';
import ForgotPasswordPage from './pages/common/ForgotPasswordPage';
import ConfirmationPage from './pages/common/ConfirmationPage';
import AboutPage from './pages/common/AboutPage';
import ContactPage from './pages/common/ContactPage';
import PrivacyPage from './pages/common/PrivacyPage';
import TermsPage from './pages/common/TermsPage';
import CookiesPage from './pages/common/CookiesPage';
import InformationPage from './pages/common/InformationPage';

import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to home page */}
        <Route path="/" element={<HomePage />} />

        {/* Owner Routes */}
        <Route path={ROUTES.owner.dashboard} element={<OwnerDashboard />} />
        <Route path={ROUTES.owner.profile} element={<OwnerProfile />} />
        <Route path={ROUTES.owner.register} element={<OwnerRegisterPage />} />
        <Route path={ROUTES.owner.lostPetForm} element={<OwnerLostPet />} />
        <Route path={ROUTES.owner.foundPetForm} element={<CitizenFoundPetForm />} />
        <Route path={ROUTES.owner.pets} element={<OwnerHealthBook />} />
        <Route path={`${ROUTES.owner.pets}/:petId`} element={<OwnerPetDetail />} />
        <Route path={ROUTES.owner.appointments} element={<OwnerAppointments />} />
        <Route path={`${ROUTES.owner.appointments}/:appointmentId/review`} element={<OwnerReview />} />
        <Route path={ROUTES.owner.lostHistory} element={<OwnerLostPetHistory />} />
        <Route path={`${ROUTES.owner.lostHistory}/:declarationId`} element={<OwnerLostPetHistoryDetail />} />
        <Route path={`${ROUTES.owner.lostHistory}/:declarationId/edit`} element={<OwnerLostPetHistoryEdit />} />

        {/* Citizen Routes */}
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.citizen.lostPets} element={<LostPets />} />
        <Route path={ROUTES.citizen.lostPetDetails} element={<LostPetDetails />} />
        <Route path={ROUTES.citizen.foundPetForm} element={<CitizenFoundPetForm />} />
        <Route path={ROUTES.citizen.searchMap} element={<VetSearchMap />} />
        <Route path="/vet-profile/:vetId" element={<VetProfile />} />

        {/* Vet Routes */}
        <Route path={ROUTES.vet.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.vet.profile} element={<Profile />} />
        <Route path={ROUTES.vet.reviews} element={<Reviews />} />
        <Route path={ROUTES.vet.register} element={<VetRegisterPage />} />
        <Route path={ROUTES.vet.registerpet} element={<Register />} />
        <Route path={ROUTES.vet.operation} element={<Operation />} />
        <Route path={ROUTES.vet.availability} element={<Availability />} />
        <Route path={ROUTES.vet.appointments} element={<Appointments />} />
        <Route path={ROUTES.vet.transfer} element={<Transfer />} />
        <Route path={ROUTES.vet.adoption} element={<Adoption />} />
        <Route path={ROUTES.vet.foster} element={<Foster />} />
        <Route path={ROUTES.vet.lifeEvents} element={<LifeEvents />} />
        <Route path={ROUTES.vet.history} element={<History />} />
        <Route path={`${ROUTES.vet.history}/:id`} element={<HistoryDetail />} />
        <Route path={ROUTES.vet.lostPetForm} element={<LostPet />} />
        <Route path={ROUTES.vet.foundPetForm} element={<CitizenFoundPetForm />} />

        {/* Common Pages */}
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.confirmation} element={<ConfirmationPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.privacy} element={<PrivacyPage />} />
        <Route path={ROUTES.terms} element={<TermsPage />} />
        <Route path={ROUTES.cookies} element={<CookiesPage />} />
        <Route path={ROUTES.information} element={<InformationPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;