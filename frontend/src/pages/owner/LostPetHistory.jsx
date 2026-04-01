import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Edit2, X, PawPrint, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Pagination from '../../components/common/layout/Pagination';
import CustomSelect from '../../components/common/forms/CustomSelect';
import { ROUTES, formatDate } from '../../utils/constants';
import './LostPetHistory.css';

const LostPetHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'mine');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [declarations, setDeclarations] = useState([]);
  const [foundByOthers, setFoundByOthers] = useState([]);
  const [lostHistory, setLostHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
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

        // "Δικές μου" (Mine tab) = YOUR lost pet declarations where:
        // 1. You are the owner AND nobody else found it yet (still lost or you found it yourself)
        // 2. Basically: pets you own where either no finder is set OR you are the finder
        const mine = allLostPets.filter(pet =>
          pet.ownerId == currentUser.id && (
            !pet.finderId || // No finder set yet (still lost)
            pet.finderId == currentUser.id || // You found your own pet
            !pet.finderName || // No finder name set
            pet.finderName === currentUser.name // You are listed as finder
          )
        );

        // "Από άλλους" (Others tab) = Someone ELSE found YOUR lost pet
        // Pet belongs to you BUT someone else is marked as the finder
        const others = allLostPets.filter(pet =>
          pet.ownerId == currentUser.id && (
            (pet.finderId && pet.finderId != currentUser.id) || // Someone else's ID as finder
            (pet.finderName && pet.finderName !== currentUser.name) // Someone else's name as finder
          )
        );

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

          // Determine if this is a found pet (by user themselves) or still lost
          const isFoundByMe = (pet.finderId == currentUser.id) || (pet.finderName === currentUser.name);

          return {
            id: pet.id,
            type: isFoundByMe ? 'found_by_me' : 'own_lost_pet',
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

        // Fetch Found_pet - pets that were found
        const foundPetResponse = await fetch('http://localhost:5000/Found_pet');
        if (foundPetResponse.ok) {
          const allFoundPets = await foundPetResponse.json();

          // Split Found_pet into categories:
          // For "Δικές μου": Include both active AND draft findings by current user
          // For "Από άλλους": Only active findings by others (no drafts)

          const myFindings = allFoundPets.filter(pet =>
            pet.foundByUserId == currentUser.id // All findings by current user (active + draft)
          );

          const othersFoundMyPets = allFoundPets.filter(pet =>
            pet.ownerId == currentUser.id &&
            pet.foundByUserId != currentUser.id &&
            pet.status === 'active' // Only active findings by others (no drafts)
          );

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

          // Transform pets YOU found
          const myFindingsTransformed = myFindings.map(pet => ({
            id: pet.id,
            type: 'found_by_me',
            petName: pet.name,
            petType: pet.type,
            petSpecies: pet.type,
            petBreed: pet.breed,
            petColor: pet.color,
            petGender: pet.gender,
            date: pet.foundDate ? parseDate(pet.foundDate) : parseDate(pet.foundAt),
            location: pet.area || pet.lostLocation || '-',
            description: pet.description,
            ownerName: pet.ownerId ? 'Γνωστός ιδιοκτήτης' : 'Άγνωστος ιδιοκτήτης',
            status: pet.status === 'draft' ? 'draft' : 'submitted', // Preserve draft status
          }));

          // Transform YOUR pets found by others
          const othersFoundMyPetsTransformed = othersFoundMyPets.map(pet => ({
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
          }));

          // Add to respective arrays
          setDeclarations([...mineTransformed, ...myFindingsTransformed]);
          setFoundByOthers([...othersTransformed, ...othersFoundMyPetsTransformed]);
        } else {
          setDeclarations(mineTransformed);
          setFoundByOthers(othersTransformed);
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

  const currentData = activeTab === 'mine' ? [...declarations, ...lostHistory] : foundByOthers;
  const sortedData = [...currentData].sort((a, b) => {
    const parseDateValue = (dateStr) => {
      if (!dateStr) return 0;
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, (month || 1) - 1, day || 1).getTime();
      }
      const parsed = new Date(dateStr).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const dateA = parseDateValue(a.date);
    const dateB = parseDateValue(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Handle deep linking to specific declaration from notifications
  useEffect(() => {
    if (location.state?.petId && !loading && currentData.length > 0) {
      const element = document.getElementById(`declaration-${location.state.petId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('lost-pet-history__card--highlighted');
        setTimeout(() => {
          element.classList.remove('lost-pet-history__card--highlighted');
        }, 3000);
      }
    }
  }, [location.state, loading, currentData]);

  const breadcrumbItems = [
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

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
          <div className="lost-pet-history__subtitle-row">
            <p className="lost-pet-history__subtitle">Προβολή και διαχείριση των δηλώσεων απώλειας και εύρεσης</p>
            <div className="lost-pet-history__filters">
              <span className="lost-pet-history__sort-label">Ταξινόμηση:</span>
              <div className="lost-pet-history__sort-control">
                <CustomSelect
                  name="lost-pet-history-sort"
                  value={sortOrder}
                  onChange={(value) => { setSortOrder(value); setCurrentPage(1); }}
                  options={[
                    { value: 'desc', label: 'Πιο πρόσφατα' },
                    { value: 'asc', label: 'Παλαιότερα' }
                  ]}
                  variant="owner"
                />
              </div>
            </div>
          </div>
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
              <div key={declaration.id} id={`declaration-${declaration.id}`} className="lost-pet-history__card">
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
                          : 'Δήλωση Απώλειας Κατοικιδίου'}
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
                          <p className="lost-pet-history__value">{formatDate(declaration.date)}</p>
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
                          <p className="lost-pet-history__value">{formatDate(declaration.date)}</p>
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
                  <span className="lost-pet-history__modal-value">{formatDate(selectedDeclaration.date)}</span>
                </div>
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Τοποθεσία Εξαφάνισης:</span>
                  <span className="lost-pet-history__modal-value">{selectedDeclaration.location}</span>
                </div>
                <div className="lost-pet-history__modal-row">
                  <span className="lost-pet-history__modal-label">Περιγραφή:</span>
                  <span className="lost-pet-history__modal-value">
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