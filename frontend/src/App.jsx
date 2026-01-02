// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Common Pages
import HomePage from './pages/citizen/HomePage';
import ConfirmationPage from './pages/common/ConfirmationPage';
import ContactPage from './pages/common/ContactPage';
import AboutPage from './pages/common/AboutPage';
import PrivacyPage from './pages/common/PrivacyPage';
import TermsPage from './pages/common/TermsPage';
import CookiesPage from './pages/common/CookiesPage';
import InformationPage from './pages/common/InformationPage';
import LostPets from './pages/citizen/LostPets';
import LostPetDetails from './pages/citizen/LostPetDetails';

// Vet Pages
import Dashboard from './pages/vet/Dashboard';

// Citizen Pages  
import FoundPetForm from './pages/citizen/FoundPetForm';
import VetSearchMap from './pages/citizen/VetSearchMap';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Common Routes */}
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.privacy} element={<PrivacyPage />} />
        <Route path={ROUTES.terms} element={<TermsPage />} />
        <Route path={ROUTES.cookies} element={<CookiesPage />} />
        <Route path={ROUTES.information} element={<InformationPage />} />

        {/* Citizen Routes */}
        <Route path={ROUTES.citizen.lostPets} element={<LostPets />} />
        <Route path={ROUTES.citizen.lostPetDetails} element={<LostPetDetails />} />
        <Route path={ROUTES.citizen.foundPetForm} element={<FoundPetForm />} />

        {/* Vet Routes */}
        <Route path="/vet/dashboard" element={<Dashboard />} />
        <Route path={ROUTES.vet.searchMap} element={<VetSearchMap />} />

        {/* Confirmation / Notices */}
        <Route path={ROUTES.confirmation} element={<ConfirmationPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;