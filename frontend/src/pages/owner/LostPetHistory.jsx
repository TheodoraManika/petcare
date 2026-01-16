import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, X, PawPrint, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import { ROUTES } from '../../utils/constants';
import './LostPetHistory.css';

const LostPetHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mine');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [declarations, setDeclarations] = useState([
    {
      id: 1,
      type: 'loss',
      petName: 'Μπάμπης',
      petType: 'Σκύλος',
      date: '05/11/2025',
      location: 'Κέντρο Αθήνας, Πλατεία Συντάγματος',
      status: 'submitted',
    },
    {
      id: 2,
      type: 'found',
      petName: 'Μίνι',
      petType: 'Γάτα',
      date: '01/11/2025',
      location: 'Πάρκο Εργηνης',
      status: 'submitted',
    },
    {
      id: 3,
      type: 'loss',
      petName: 'Ρέξ',
      petType: 'Σκύλος',
      date: '28/10/2025',
      location: 'Θεσσαλονίκη',
      status: 'draft',
    },
  ]);

  // Mock data for "Από άλλους" - Found pet declarations from other users
  // These should match the structure of found pet declarations
  const [foundByOthers, setFoundByOthers] = useState([
    {
      id: 4,
      type: 'found_by_other',
      petName: 'Μπάμπης',
      petSpecies: 'Σκύλος',
      petBreed: 'Λαμπραντόρ',
      petColor: 'Καφέ',
      petGender: 'Αρσενικό',
      date: '10/11/2025',
      location: 'Πλατεία Βικτωρίας, Αθήνα',
      description: 'Βρήκα έναν σκύλο που ταιριάζει με τη δήλωσή σας. Είναι φιλικός και φοράει κόκκινο περιλαίμιο.',
      contactName: 'Μαρία Παπαδοπούλου',
      contactPhone: '6912345678',
      contactEmail: 'maria.p@email.com',
    },
    {
      id: 5,
      type: 'found_by_other',
      petName: 'Ρέξ',
      petSpecies: 'Σκύλος',
      petBreed: 'Γερμανικός Ποιμενικός',
      petColor: 'Μαύρος με καφέ',
      petGender: 'Αρσενικό',
      date: '02/11/2025',
      location: 'Καλαμαριά, Θεσσαλονίκη',
      description: 'Είδα σκύλο που μοιάζει με την περιγραφή σας στην περιοχή. Περπατούσε μόνος του.',
      contactName: 'Γιώργος Κωνσταντίνου',
      contactPhone: '6987654321',
      contactEmail: 'g.konstantinou@email.com',
    },
  ]);

  const breadcrumbItems = [
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const currentData = activeTab === 'mine' ? declarations : foundByOthers;

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { label: 'Υποβλήθηκε', class: 'submitted' },
      found: { label: 'Βρέθηκε', class: 'found' },
      draft: { label: 'Πρόχειρη', class: 'draft' },
      pending: { label: 'Εκκρεμεί', class: 'pending' },
      contacted: { label: 'Επικοινωνήσατε', class: 'contacted' },
      resolved: { label: 'Επιλύθηκε', class: 'resolved' },
    };
    const config = statusConfig[status] || statusConfig.submitted;
    return (
      <span className={`lost-pet-history__status lost-pet-history__status--${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleView = (id) => {
    navigate(`${ROUTES.owner.lostHistory}/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`${ROUTES.owner.lostHistory}/${id}/edit`);
  };

  const handleFound = (id) => {
    const updatedDeclarations = declarations.map(d => {
      if (d.id === id) {
        return { ...d, status: 'found' };
      }
      return d;
    });
    setDeclarations(updatedDeclarations);
  };

  const handleDelete = (declaration) => {
    setSelectedDeclaration(declaration);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedDeclaration) {
      setDeclarations(declarations.filter(d => d.id !== selectedDeclaration.id));
      setShowDeleteModal(false);
      setSelectedDeclaration(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDeclaration(null);
  };

  return (
    <PageLayout variant="owner" title="Ιστορικό Δηλώσεων" breadcrumbs={breadcrumbItems}>
      <div className="lost-pet-history">
        <div className="lost-pet-history__header">
          <h1 className="lost-pet-history__title">Ιστορικό Δηλώσεων</h1>
          <p className="lost-pet-history__subtitle">Προβολή και διαχείριση των δηλώσεων απώλειας και εύρεσης</p>
        </div>

        <div className="lost-pet-history__tabs">
          <button
            className={`lost-pet-history__tab ${activeTab === 'mine' ? 'lost-pet-history__tab--active' : ''}`}
            onClick={() => handleTabChange('mine')}
          >
            Δικές μου
          </button>
          <button
            className={`lost-pet-history__tab ${activeTab === 'others' ? 'lost-pet-history__tab--active' : ''}`}
            onClick={() => handleTabChange('others')}
          >
            Από άλλους
          </button>
        </div>

        <div className="lost-pet-history__content">
          {currentData.map((declaration) => (
            <div key={declaration.id} className="lost-pet-history__card">
              <div className="lost-pet-history__icon">
                <PawPrint size={24} />
              </div>

              <div className="lost-pet-history__card-info">
                <div className="lost-pet-history__card-header">
                  <h3 className="lost-pet-history__card-title">
                    {declaration.type === 'found_by_other' 
                      ? 'Δήλωση Εύρεσης από Χρήστη' 
                      : declaration.type === 'loss' 
                      ? 'Δήλωση Απώλειας' 
                      : 'Δήλωση Εύρεσης'}
                  </h3>
                  <span className="lost-pet-history__card-subtitle">
                    {declaration.petType || declaration.petSpecies}
                  </span>
                  <span className="lost-pet-history__card-name">{declaration.petName}</span>
                </div>

                <div className="lost-pet-history__card-details">
                  {activeTab === 'mine' ? (
                    <>
                      <div>
                        <span className="lost-pet-history__label">Ημερομηνία</span>
                        <p className="lost-pet-history__value">{declaration.date}</p>
                      </div>
                      <div>
                        <span className="lost-pet-history__label">Τοποθεσία</span>
                        <p className="lost-pet-history__value">{declaration.location}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="lost-pet-history__label">Ημερομηνία Εύρεσης</span>
                        <p className="lost-pet-history__value">{declaration.date}</p>
                      </div>
                      <div>
                        <span className="lost-pet-history__label">Τοποθεσία Εύρεσης</span>
                        <p className="lost-pet-history__value">{declaration.location}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="lost-pet-history__card-actions">
                <div className="lost-pet-history__buttons">
                  {activeTab === 'mine' ? (
                    <>
                      <button
                        className="lost-pet-history__btn lost-pet-history__btn--view"
                        onClick={() => handleView(declaration.id)}
                      >
                        <Eye size={16} />
                        Προβολή
                      </button>
                      {declaration.status === 'draft' && (
                        <button
                          className="lost-pet-history__btn lost-pet-history__btn--edit"
                          onClick={() => handleEdit(declaration.id)}
                        >
                          <Edit2 size={16} />
                        </button>
                      )}

                      {declaration.type === 'loss' && declaration.status === 'submitted' && (
                        <button
                          className="lost-pet-history__btn lost-pet-history__btn--found"
                          onClick={() => handleFound(declaration.id)}
                        >
                          <CheckCircle size={16} />
                          Βρέθηκε
                        </button>
                      )}

                      {declaration.status === 'found' && (
                        <div className="lost-pet-history__found-message">
                          <CheckCircle size={16} />
                          Το κατοικίδιο βρέθηκε!
                        </div>
                      )}

                      {declaration.status === 'draft' && (
                        <button
                          className="lost-pet-history__btn lost-pet-history__btn--delete"
                          onClick={() => handleDelete(declaration)}
                          title="Διαγραφή"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="lost-pet-history__btn lost-pet-history__btn--view"
                      onClick={() => handleView(declaration.id)}
                    >
                      <Eye size={16} />
                      Προβολή
                    </button>
                  )}
                </div>
                {activeTab === 'mine' && (
                  <div className="lost-pet-history__status-section">
                    {getStatusBadge(declaration.status)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          variant="owner"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="lost-pet-history__modal-overlay">
          <div className="lost-pet-history__modal">
            <h3 className="lost-pet-history__modal-title">
              Είστε σίγουροι ότι θέλετε να διαγράψετε την παρακάτω δήλωση;
            </h3>
            <p className="lost-pet-history__modal-subtitle">
              Αυτή η ενέργεια δεν αναιρείται.
            </p>
            {selectedDeclaration && (
              <div className="lost-pet-history__modal-info">
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Κατοικίδιο:</span>
                  <span className="lost-pet-history__modal-value">{selectedDeclaration.petType}</span>
                </div>
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Ημερομηνία Εξαφάνισης:</span>
                  <span className="lost-pet-history__modal-value">{selectedDeclaration.date}</span>
                </div>
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Τοποθεσία Εξαφάνισης:</span>
                  <span className="lost-pet-history__modal-value">{selectedDeclaration.location}</span>
                </div>
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Περιγραφή:</span>
                  <span className="lost-pet-history__modal-value">
                    Είναι μικρόσωμος και οραίος σκύλος
                  </span>
                </div>
              </div>
            )}
            <div className="lost-pet-history__modal-actions">
              <button
                className="lost-pet-history__modal-btn lost-pet-history__modal-btn--cancel"
                onClick={cancelDelete}
              >
                Όχι, επιστροφή
              </button>
              <button
                className="lost-pet-history__modal-btn lost-pet-history__modal-btn--delete"
                onClick={confirmDelete}
              >
                Ναι, διαγραφή
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default LostPetHistory;
