import React, { useState, useEffect } from 'react';
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
  const itemsPerPage = 5;
  const [declarations, setDeclarations] = useState([]);
  const [foundByOthers, setFoundByOthers] = useState([]);
  const [lostHistory, setLostHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch lost pet declarations from database
  useEffect(() => {
    const fetchDeclarations = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Fetch all lost pets from database (petStatus: 1)
        const response = await fetch('http://localhost:5000/pets?petStatus=1');
        if (!response.ok) throw new Error('Failed to fetch lost pets');
        const allLostPets = await response.json();

        // "Δικές μου" has TWO types:
        // 1. Findings THIS user MADE about finding other people's pets (user is the finder)
        // 2. OWN LOST PET DECLARATIONS by this user (ownerId = currentUser.id) including drafts
        const mine = allLostPets.filter(pet => 
          (pet.finderName === currentUser.name || pet.finderId == currentUser.id) || // User found someone's pet
          (pet.ownerId == currentUser.id && !pet.finderName && !pet.finderId) // User's own lost pet declaration (no finder yet)
        );
        
        // "Από άλλους" = declarations OTHER PEOPLE MADE about finding THIS user's lost pets
        const others = allLostPets.filter(pet => pet.ownerId == currentUser.id && (pet.finderName || pet.finderId));

        // Transform mine data (user's own findings + user's own lost pet declarations)
        const mineTransformed = mine.map(pet => {
          // Helper function to parse dates in DD/MM/YYYY or ISO format
          const parseDate = (dateStr) => {
            if (!dateStr) return new Date().toLocaleDateString('el-GR');
            
            // Try to parse ISO format first
            if (dateStr.includes('T') || dateStr.includes('-')) {
              const parsed = new Date(dateStr);
              return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
            }
            
            // Try to parse DD/MM/YYYY format
            if (dateStr.includes('/')) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                const parsed = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
                return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
              }
            }
            
            return dateStr;
          };

          return {
            id: pet.id,
            type: pet.finderName || pet.finderId ? 'found_by_me' : 'own_lost_pet',
            petName: pet.petName || pet.name,
            petType: pet.type,
            date: pet.dateFound 
              ? parseDate(pet.dateFound)
              : pet.lostDate 
              ? parseDate(pet.lostDate)
              : new Date().toLocaleDateString('el-GR'),
            location: pet.location || pet.lostLocation || pet.lostLocation,
            description: pet.description,
            status: pet.status || 'submitted',
            ownerName: pet.ownerName,
            ownerPhone: pet.ownerPhone,
            ownerEmail: pet.ownerEmail,
          };
        });

        // Transform others' findings (other people finding this user's pets)
        const othersTransformed = others.map(pet => {
          // Helper function to parse dates in DD/MM/YYYY or ISO format
          const parseDate = (dateStr) => {
            if (!dateStr) return new Date().toLocaleDateString('el-GR');
            
            // Try to parse ISO format first
            if (dateStr.includes('T') || dateStr.includes('-')) {
              const parsed = new Date(dateStr);
              return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
            }
            
            // Try to parse DD/MM/YYYY format
            if (dateStr.includes('/')) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                const parsed = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
                return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
              }
            }
            
            return dateStr;
          };

          return {
            id: pet.id,
            type: 'found_by_other',
            petName: pet.petName || pet.name,
            petSpecies: pet.type,
            petBreed: pet.breed,
            petColor: pet.color,
            petGender: pet.gender,
            date: pet.foundDate ? parseDate(pet.foundDate) : pet.lostDate ? parseDate(pet.lostDate) : new Date().toLocaleDateString('el-GR'),
            location: pet.foundLocation || pet.location,
            description: pet.description,
            contactName: pet.finderName,
            contactPhone: pet.finderPhone,
            contactEmail: pet.finderEmail,
            status: pet.status || 'submitted',
          };
        });

        setDeclarations(mineTransformed);
        setFoundByOthers(othersTransformed);

        // Fetch Found_pet - pets that were found by others
        const foundPetResponse = await fetch('http://localhost:5000/Found_pet');
        if (foundPetResponse.ok) {
          const allFoundPets = await foundPetResponse.json();
          // Filter to only show pets belonging to this user
          const userFoundPets = allFoundPets.filter(pet => pet.ownerId == currentUser.id);
          
          const foundPetTransformed = userFoundPets.map(pet => {
            const parseDate = (dateStr) => {
              if (!dateStr) return new Date().toLocaleDateString('el-GR');
              if (dateStr.includes('T') || dateStr.includes('-')) {
                const parsed = new Date(dateStr);
                return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
              }
              if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                  const parsed = new Date(parts[2], parts[1] - 1, parts[0]);
                  return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
                }
              }
              return dateStr;
            };

            return {
              id: pet.id,
              type: 'found_by_other',
              petName: pet.name,
              petSpecies: pet.type,
              petBreed: pet.breed,
              petColor: pet.color,
              petGender: pet.gender,
              date: pet.foundDate ? parseDate(pet.foundDate) : parseDate(pet.foundAt),
              location: pet.area || pet.lostLocation || '-',
              description: pet.description,
              contactName: `${pet.foundByUserName} ${pet.foundByUserSurname}`,
              contactPhone: pet.foundByUserPhone,
              contactEmail: pet.foundByUserEmail,
              status: 'submitted',
            };
          });

          // Append to foundByOthers
          setFoundByOthers([...othersTransformed, ...foundPetTransformed]);
        }

        // Fetch lost_history - pets that were found and marked as found
        const lostHistoryResponse = await fetch('http://localhost:5000/lost_history');
        if (lostHistoryResponse.ok) {
          const allLostHistory = await lostHistoryResponse.json();
          // Filter to only show this user's pets from lost_history
          const userLostHistory = allLostHistory.filter(pet => pet.ownerId == currentUser.id);
          
          const historyTransformed = userLostHistory.map(pet => {
            const parseDate = (dateStr) => {
              if (!dateStr) return new Date().toLocaleDateString('el-GR');
              if (dateStr.includes('T') || dateStr.includes('-')) {
                const parsed = new Date(dateStr);
                return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
              }
              if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                  const parsed = new Date(parts[2], parts[1] - 1, parts[0]);
                  return isNaN(parsed) ? 'Άγνωστη' : parsed.toLocaleDateString('el-GR');
                }
              }
              return dateStr;
            };

            return {
              id: pet.id,
              type: 'found',
              petName: pet.petName || pet.name,
              petType: pet.type,
              date: pet.markedFoundAt ? parseDate(pet.markedFoundAt) : new Date().toLocaleDateString('el-GR'),
              location: pet.area || pet.lostLocation || '-',
              description: pet.description,
              status: 'found',
            };
          });

          setLostHistory(historyTransformed);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching declarations:', error);
        setLoading(false);
      }
    };

    fetchDeclarations();
  }, []);

  const breadcrumbItems = [
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const currentData = activeTab === 'mine' ? [...declarations, ...lostHistory] : foundByOthers;
  
  // Calculate pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Φόρτωση δηλώσεων...
            </div>
          ) : currentData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              Δεν υπάρχουν δηλώσεις για εμφάνιση.
            </div>
          ) : (
            paginatedData.map((declaration) => (
            <div key={declaration.id} className="lost-pet-history__card">
              <div className="lost-pet-history__icon">
                <PawPrint size={24} />
              </div>

              <div className="lost-pet-history__card-info">
                <div className="lost-pet-history__card-header">
                  <h3 className="lost-pet-history__card-title">
                    {declaration.type === 'found_by_other' 
                      ? 'Δήλωση Εύρεσης από Χρήστη' 
                      : declaration.type === 'own_lost_pet'
                      ? 'Δήλωση Απώλειας Κατοικιδίου'
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
                          title="Επεξεργασία"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}

                      {(declaration.type === 'own_lost_pet' || declaration.type === 'loss') && declaration.status === 'submitted' && (
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
            ))
          )}
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
