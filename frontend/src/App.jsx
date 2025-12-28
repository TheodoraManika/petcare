// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Vet Pages
import Dashboard from './pages/vet/Dashboard';
import Profile from './pages/vet/Profile';
import Reviews from './pages/vet/Reviews';
import Register from './pages/vet/Register';
import Operation from './pages/vet/Operation';
import Availability from './pages/vet/Availability';
import Transfer from './pages/vet/Transfer';
import LifeEvents from './pages/vet/LifeEvents';
import Adoption from './pages/vet/Adoption';
import Foster from './pages/vet/Foster';
import ConfirmationPage from './pages/common/ConfirmationPage';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to vet dashboard */}
        <Route path="/" element={<Navigate to="/vet/dashboard" replace />} />

        {/* Vet Routes */}
        <Route path="/vet/dashboard" element={<Dashboard />} />
        <Route path={ROUTES.vet.profile} element={<Profile />} />
        <Route path={ROUTES.vet.reviews} element={<Reviews />} />
        <Route path={ROUTES.vet.register} element={<Register />} />
        <Route path={ROUTES.vet.operation} element={<Operation />} />
        <Route path={ROUTES.vet.availability} element={<Availability />} />
        <Route path={ROUTES.vet.transfer} element={<Transfer />} />
        <Route path={ROUTES.vet.adoption} element={<Adoption />} />
        <Route path={ROUTES.vet.foster} element={<Foster />} />
        <Route path={ROUTES.vet.lifeEvents} element={<LifeEvents />} />

        {/* Confirmation / Notices */}
        <Route path={ROUTES.confirmation} element={<ConfirmationPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/vet/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;