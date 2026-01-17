import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES } from '../../utils/constants';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('visits');
  const [currentPage, setCurrentPage] = useState(1);
  const [visitsData, setVisitsData] = useState([]);
  const [declarationsData, setDeclarationsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || currentUser.id === undefined) return;

      // Fetch medical procedures
      const proceduresResponse = await fetch(`http://localhost:5000/medicalProcedures?vetId=${currentUser.id}`);
      if (proceduresResponse.ok) {
        const procedures = await proceduresResponse.json();
        
        // Fetch all pets to get their names
        const petsResponse = await fetch('http://localhost:5000/pets');
        const allPets = petsResponse.ok ? await petsResponse.json() : [];
        
        const visitsArray = procedures.map(proc => {
          const pet = allPets.find(p => p.id == proc.petId);
          return {
            id: proc.id,
            petId: proc.petId,
            petName: pet?.name || 'Άγνωστο',
            microchip: pet?.microchipId || proc.microchip || '-',
            date: formatDate(proc.date),
            type: proc.type,
            description: proc.description || '-'
          };
        });
        setVisitsData(visitsArray);
      }

      // Fetch transfers
      const transfersResponse = await fetch(`http://localhost:5000/transfers?vetId=${currentUser.id}`);
      let transfers = [];
      if (transfersResponse.ok) {
        transfers = await transfersResponse.json();
      }

      // Fetch adoptions
      const adoptionsResponse = await fetch(`http://localhost:5000/adoptions?vetId=${currentUser.id}`);
      let adoptions = [];
      if (adoptionsResponse.ok) {
        adoptions = await adoptionsResponse.json();
      }

      // Fetch fosters
      const fostersResponse = await fetch(`http://localhost:5000/fosters?vetId=${currentUser.id}`);
      let fosters = [];
      if (fostersResponse.ok) {
        fosters = await fostersResponse.json();
      }

      // Combine declarations
      const declarationsArray = [
        ...transfers.map(t => ({
          id: t.id,
          petName: t.petName || 'Άγνωστο',
          microchip: t.microchip || '-',
          date: formatDate(t.transferDate),
          type: 'Μεταβίβαση',
          ownerLabel: 'Νέος Ιδιοκτήτης',
          owner: t.newOwnerName || '-'
        })),
        ...adoptions.map(a => ({
          id: a.id,
          petName: a.petName || 'Άγνωστο',
          microchip: a.microchip || '-',
          date: formatDate(a.adoptionDate),
          type: 'Υιοθεσία',
          ownerLabel: 'Υιοθετών',
          owner: a.adoptingOwnerName || '-'
        })),
        ...fosters.map(f => ({
          id: f.id,
          petName: f.petName || 'Άγνωστο',
          microchip: f.microchip || '-',
          date: formatDate(f.fosterDate),
          type: 'Αναδοχή',
          ownerLabel: 'Ανάδοχος',
          owner: f.fosterParentName || '-'
        }))
      ];

      setDeclarationsData(declarationsArray);
    } catch (err) {
      console.error('Error fetching history data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    // Handle YYYY-MM-DD format
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const currentData = activeTab === 'visits' ? visitsData : declarationsData;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);

  const handleViewDetails = (id) => {
    navigate(`${ROUTES.vet.history}/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const breadcrumbItems = [];

  return (
    <PageLayout title="Ιστορικό" breadcrumbs={breadcrumbItems}>
      <div className="history">
        <div className="history__header">
          <h1 className="history__title">Ιστορικό</h1>
          <p className="history__subtitle-main">Προβολή ιατρικών πράξεων και δηλώσεων</p>
        </div>

        <div className="history__tabs">
          <button
            className={`history__tab ${activeTab === 'visits' ? 'history__tab--active' : ''}`}
            onClick={() => handleTabChange('visits')}
          >
            Επισκέψεις & Ιατρικές πράξεις
          </button>
          <button
            className={`history__tab ${activeTab === 'declarations' ? 'history__tab--active' : ''}`}
            onClick={() => handleTabChange('declarations')}
          >
            Δηλώσεις
          </button>
        </div>

        <div className="history__content">
          <p className="history__subtitle">
            {activeTab === 'visits' 
              ? 'Προβολή όλων των ιατρικών πράξεων που έχετε καταχωρήσει'
              : 'Προβολή όλων των δηλώσεων που έχετε καταχωρήσει'}
          </p>

          <div className="history__cards">
            {currentItems.map((item) => (
              <div key={item.id} className="history__card">
                <div className="history__card-header">
                  <h3 className="history__card-title">{item.petName}</h3>
                  <button 
                    className="history__view-btn"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    <Eye size={18} />
                    Προβολή
                  </button>
                </div>
                <p className="history__card-microchip">Μικροτσίπ: {item.microchip}</p>
                
                <div className="history__card-details">
                  <div className="history__card-detail">
                    <span className="history__card-label">Ημερομηνία</span>
                    <span className="history__card-value">{item.date}</span>
                  </div>
                  <div className="history__card-detail">
                    <span className="history__card-label">Τύπος</span>
                    <span className="history__card-value">{item.type}</span>
                  </div>
                  <div className="history__card-detail">
                    <span className="history__card-label">
                      {activeTab === 'visits' ? 'Περιγραφή' : item.ownerLabel}
                    </span>
                    <span className="history__card-value">
                      {activeTab === 'visits' ? item.description : item.owner}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="vet"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default History;
