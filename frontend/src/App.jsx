// /src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Owner Pages
import Dashboard from './pages/owner/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to owner dashboard */}
        <Route path="/" element={<Navigate to="/owner/dashboard" replace />} />
        
        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<Dashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
