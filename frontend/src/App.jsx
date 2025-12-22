// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Vet Pages
import Dashboard from './pages/vet/Dashboard';
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

        {/* Confirmation / Notices */}
        <Route path={ROUTES.confirmation} element={<ConfirmationPage />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/vet/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;