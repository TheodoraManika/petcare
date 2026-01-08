import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import Pagination from '../../components/common/Pagination';
import { ROUTES } from '../../utils/constants';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('visits');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data for visits and medical procedures
  const visitsData = [
    {
      id: 1,
      petName: 'Μπάμπης',
      microchip: 'GR123456789012345',
      date: '05/11/2025',
      type: 'Εμβολιασμός',
      description: 'Εμβόλιο Λύσσας'
    },
    {
      id: 2,
      petName: 'Μίνι',
      microchip: 'GR987654321098765',
      date: '01/11/2025',
      type: 'Χειρουργείο',
      description: 'Χειρουργείο στείρωσης'
    },
    {
      id: 3,
      petName: 'Ρεξ',
      microchip: 'GR555666777888999',
      date: '28/10/2025',
      type: 'Γενική Εξέταση',
      description: 'Ετήσιος Έλεγχος'
    },
    {
      id: 4,
      petName: 'Λούνα',
      microchip: 'GR111222333444555',
      date: '15/10/2025',
      type: 'Εμβολιασμός',
      description: 'Τετραπλό εμβόλιο'
    },
    {
      id: 5,
      petName: 'Μάξ',
      microchip: 'GR999888777666555',
      date: '10/10/2025',
      type: 'Επείγον Περιστατικό',
      description: 'Κάταγμα ποδιού'
    },
    {
      id: 6,
      petName: 'Μπέλλα',
      microchip: 'GR444333222111000',
      date: '05/10/2025',
      type: 'Οδοντιατρική',
      description: 'Οδοντιατρικός έλεγχος'
    }
  ];

  // Mock data for declarations
  const declarationsData = [
    {
      id: 1,
      petName: 'Μπάμπης',
      microchip: 'GR123456789012345',
      date: '05/11/2025',
      type: 'Μεταβίβαση',
      ownerLabel: 'Νέος Ιδιοκτήτης',
      owner: 'Νίκος Μιχαλόπουλος'
    },
    {
      id: 2,
      petName: 'Μίνι',
      microchip: 'GR987654321098765',
      date: '01/11/2025',
      type: 'Υιοθεσία',
      ownerLabel: 'Υιοθετών',
      owner: 'Μαρία Ιωάννου'
    },
    {
      id: 3,
      petName: 'Ρεξ',
      microchip: 'GR555666777888999',
      date: '28/10/2025',
      type: 'Αναδοχή',
      ownerLabel: 'Ανάδοχος',
      owner: 'Δημήτρης Παπάς'
    }
  ];

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
                  {activeTab === 'declarations' && (
                    <button 
                      className="history__view-btn"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <Eye size={18} />
                      Προβολή
                    </button>
                  )}
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
