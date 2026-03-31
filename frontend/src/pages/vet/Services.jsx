import React, { useState, useEffect } from 'react';
import { Stethoscope, Save, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Notification from '../../components/common/modals/Notification';
import { SERVICE_LABELS } from '../../utils/constants';
import './Services.css';

const VetServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchVetData = async () => {
      const user = getCurrentUser();
      if (!user) {
        setError('Παρακαλώ συνδεθείτε ξανά');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch vet data');
        const data = await response.json();
        
        // Ensure services is an array
        setServices(data.services || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Σφάλμα κατά τη φόρτωση των υπηρεσιών');
      } finally {
        setLoading(false);
      }
    };

    fetchVetData();
  }, []);

  const handleToggleService = (serviceId) => {
    const existingService = services.find(s => s.id === serviceId);
    
    if (existingService) {
      // Remove it
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } else {
      // Add it with default price if possible
      const label = SERVICE_LABELS[serviceId] || serviceId;
      setServices(prev => [...prev, { id: serviceId, name: label, price: 30 }]);
    }
  };

  const handlePriceChange = (serviceId, newPrice) => {
    const price = parseInt(newPrice) || 0;
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, price } : s
    ));
  };

  const handleSave = async () => {
    const user = getCurrentUser();
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services })
      });

      if (!response.ok) throw new Error('Failed to save services');
      
      setNotification('success');
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error('Error saving services:', err);
      setNotification('error');
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Τιμοκατάλογος Υπηρεσιών">
        <div className="vet-services">
          <p>Φόρτωση...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Τιμοκατάλογος Υπηρεσιών">
      <div className="vet-services">
        <Notification
          isVisible={notification !== null}
          message={notification === 'success' ? 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς!' : 'Σφάλμα κατά την αποθήκευση'}
          type={notification === 'success' ? 'success' : 'error'}
        />

        <div className="vet-services__header">
          <h1 className="vet-services__title">Τιμοκατάλογος Υπηρεσιών</h1>
          <p className="vet-services__subtitle">
            Επιλέξτε τις υπηρεσίες που παρέχετε και ορίστε το κόστος τους
          </p>
        </div>

        <div className="vet-services__container">
          <div className="vet-services__list-header">
            <div className="vet-services__col-service">Υπηρεσία</div>
            <div className="vet-services__col-status">Κατάσταση</div>
            <div className="vet-services__col-price">Τιμή (€)</div>
          </div>

          <div className="vet-services__list">
            {Object.entries(SERVICE_LABELS).filter(([id]) => id !== 'other').map(([id, label]) => {
              const activeService = services.find(s => s.id === id);
              const isActive = !!activeService;

              return (
                <div key={id} className={`vet-services__item ${isActive ? 'vet-services__item--active' : ''}`}>
                  <div className="vet-services__col-service">
                    <div className="vet-services__service-info">
                      <div className="vet-services__icon">
                        <Stethoscope size={20} />
                      </div>
                      <span className="vet-services__name">{label}</span>
                    </div>
                  </div>

                  <div className="vet-services__col-status">
                    <button 
                      className={`vet-services__toggle-btn ${isActive ? 'vet-services__toggle-btn--active' : ''}`}
                      onClick={() => handleToggleService(id)}
                    >
                      {isActive ? (
                        <><Check size={16} /> Παρέχεται</>
                      ) : (
                        '+ Προσθήκη'
                      )}
                    </button>
                  </div>

                  <div className="vet-services__col-price">
                    <div className="vet-services__price-wrapper">
                      <input 
                        type="number" 
                        className="vet-services__price-input"
                        value={isActive ? activeService.price : ''}
                        disabled={!isActive}
                        onChange={(e) => handlePriceChange(id, e.target.value)}
                        placeholder="--"
                      />
                      <span className="vet-services__currency">€</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="vet-services__actions">
            <button 
              className="vet-services__save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
            </button>
          </div>
        </div>

        <div className="vet-services__info">
          <AlertCircle size={20} />
          <p>Οι τιμές που ορίζετε θα εμφανίζονται στους ιδιοκτήτες κατά την αναζήτηση και την κράτηση ραντεβού.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default VetServices;
