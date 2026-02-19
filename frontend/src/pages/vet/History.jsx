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
        }).sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/').map(Number);
          const [dayB, monthB, yearB] = b.date.split('/').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB - dateA;
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

      // Fetch Found_pet declarations by this vet
      const foundPetsResponse = await fetch(`http://localhost:5000/Found_pet?foundByUserId=${currentUser.id}`);
      let foundPets = [];
      if (foundPetsResponse.ok) {
        const allFoundPets = await foundPetsResponse.json();
        // Only include active declarations (not drafts)
        foundPets = allFoundPets.filter(fp => fp.status === 'active');

        // Fetch owner names for found pets
        const ownersResponse = await fetch('http://localhost:5000/users');
        const allUsers = ownersResponse.ok ? await ownersResponse.json() : [];

        // Add owner names to foundPets
        foundPets = foundPets.map(fp => {
          const owner = allUsers.find(u => u.id == fp.ownerId);
          return {
            ...fp,
            ownerName: owner ? `${owner.name} ${owner.lastName || ''}`.trim() : 'Άγνωστος'
          };
        });
      }

      // Fetch lost pet declarations by this vet from lostPets endpoint
      const lostPetsResponse = await fetch(`http://localhost:5000/lostPets?reportedByVetId=${currentUser.id}`);
      let lostPets = [];
      if (lostPetsResponse.ok) {
        const allLostPets = await lostPetsResponse.json();
        // Only include active declarations (not drafts)
        lostPets = allLostPets.filter(lp => lp.status === 'active');
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
        })),
        ...foundPets.map(fp => ({
          id: fp.id,
          petName: fp.name || 'Άγνωστο',
          microchip: fp.microchipId || '-',
          date: formatDate(fp.foundAt || fp.foundDate),
          type: 'Δήλωση Εύρεσης',
          ownerLabel: 'Ιδιοκτήτης',
          owner: fp.ownerName || 'Άγνωστος',
          isFoundPet: true // Flag to identify Found_pet declarations
        })),
        ...lostPets.map(lp => ({
          id: lp.id,
          petName: lp.petName || 'Άγνωστο',
          microchip: lp.microchipNumber || '-',
          date: formatDate(lp.lostDate),
          type: 'Δήλωση Απώλειας',
          ownerLabel: 'Ιδιοκτήτης',
          owner: lp.ownerName || 'Άγνωστος',
          isLostPet: true // Flag to identify lost pet declarations
        }))
      ].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA;
      });

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
