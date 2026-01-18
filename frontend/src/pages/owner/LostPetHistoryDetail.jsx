import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Edit2, Trash2, AlertCircle, Printer, Download, CheckCircle, ChevronLeft } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './LostPetHistoryDetail.css';

const LostPetHistoryDetail = () => {
  const navigate = useNavigate();
  const { declarationId } = useParams();
  const [declaration, setDeclaration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeclaration = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the lost pet declaration
        const response = await fetch(`http://localhost:5000/lostPets/${declarationId}`);
        if (!response.ok) {
          throw new Error('Δήλωση δεν βρέθηκε');
        }

        const lostPet = await response.json();

        // Fetch pet details if petId exists
        let petDetails = {};
        if (lostPet.petId) {
          const petResponse = await fetch(`http://localhost:5000/pets/${lostPet.petId}`);
          if (petResponse.ok) {
            petDetails = await petResponse.json();
          }
        }

        // Fetch finder and owner information
        let finderInfo = {};
        let ownerInfo = {};

        if (lostPet.finderId) {
          const finderResponse = await fetch(`http://localhost:5000/users/${lostPet.finderId}`);
          if (finderResponse.ok) {
            finderInfo = await finderResponse.json();
          }
        }

        if (lostPet.ownerId) {
          const ownerResponse = await fetch(`http://localhost:5000/users/${lostPet.ownerId}`);
          if (ownerResponse.ok) {
            ownerInfo = await ownerResponse.json();
          }
        }

        // Format the declaration data
        const formattedDeclaration = {
          id: lostPet.id,
          type: lostPet.finderName && lostPet.finderId ? 'found_by_other' : 'loss',
          petName: lostPet.petName || petDetails.name || '-',
          petType: petDetails.species || lostPet.petType || '-',
          petSpecies: petDetails.species || '-',
          breed: petDetails.breed || lostPet.breed || '-',
          petBreed: petDetails.breed || '-',
          petColor: petDetails.color || lostPet.color || '-',
          petGender: petDetails.gender || lostPet.gender || '-',
          microchip: petDetails.microchipId || lostPet.microchip || '-',
          date: lostPet.dateLost || lostPet.dateFound || '-',
          location: lostPet.location || '-',
          description: lostPet.description || '-',
          phone: ownerInfo.phone || lostPet.phone || '-',
          status: 'submitted',
          statusLabel: 'Υποβλήθηκε',
          // For found_by_other
          contactName: finderInfo.name && finderInfo.lastName ? `${finderInfo.name} ${finderInfo.lastName}` : lostPet.finderName || '-',
          contactPhone: finderInfo.phone || lostPet.finderPhone || '-',
          contactEmail: finderInfo.email || lostPet.finderEmail || '-',
        };

        setDeclaration(formattedDeclaration);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching declaration:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (declarationId) {
      fetchDeclaration();
    }
  }, [declarationId]);

  const isFoundByOther = declaration?.type === 'found_by_other';

  const breadcrumbItems = [
    { label: 'Ιστορικό Δηλώσεων', path: ROUTES.owner.lostHistory },
  ];

  const getStatusColor = (status) => {
    const colors = {
      draft: 'draft',
      submitted: 'submitted',
      completed: 'completed',
    };
    return colors[status] || 'draft';
  };

  const handleEdit = () => {
    navigate(`${ROUTES.owner.lostHistory}/${declarationId}/edit`);
  };

  const handleFound = () => {
    setDeclaration(prev => ({ ...prev, status: 'found', statusLabel: 'Βρέθηκε' }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Replace with real export when available
    console.log('Download lost pet declaration');
  };

  const handleDelete = () => {
    if (window.confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε τη δήλωση;')) {
      navigate(ROUTES.owner.lostHistory);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.owner.lostHistory);
  };

  if (loading) {
    return (
      <PageLayout variant="owner" title="Φόρτωση..." breadcrumbs={breadcrumbItems}>
        <div className="lost-pet-detail">
          <p>Φόρτωση δήλωσης...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !declaration) {
    return (
      <PageLayout variant="owner" title="Σφάλμα" breadcrumbs={breadcrumbItems}>
        <div className="lost-pet-detail">
          <p style={{ color: '#d32f2f' }}>Σφάλμα: {error || 'Η δήλωση δεν βρέθηκε'}</p>
          <button 
            onClick={handleBack}
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Επιστροφή
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="owner" title={declaration.petName} breadcrumbs={breadcrumbItems}>
      <div className="lost-pet-detail">
        <button 
          className="lost-pet-detail__back-btn"
          onClick={handleBack}
        >
          <ChevronLeft size={20} />
          Πίσω
        </button>

        <div className="lost-pet-detail__header">
          <div className="lost-pet-detail__header-actions">
            {!isFoundByOther && declaration.status === 'found' && (
              <div className="lost-pet-detail__found-message">
                <CheckCircle size={18} />
                Το κατοικίδιο βρέθηκε!
              </div>
            )}

            {!isFoundByOther && declaration.type === 'loss' && declaration.status === 'submitted' && (
              <button
                className="lost-pet-detail__btn-found"
                onClick={handleFound}
              >
                <CheckCircle size={18} />
                Βρέθηκε
              </button>
            )}

            {!isFoundByOther && (
              <>
                <button
                  className="lost-pet-detail__btn-icon"
                  onClick={handlePrint}
                  title="Εκτύπωση"
                >
                  <Printer size={18} />
                </button>
                <button
                  className="lost-pet-detail__btn-icon"
                  onClick={handleDownload}
                  title="Λήψη"
                >
                  <Download size={18} />
                </button>
              </>
            )}
            {!isFoundByOther && declaration.status !== 'submitted' && declaration.status !== 'found' && (
              <>
                <button
                  className="lost-pet-detail__btn-icon"
                  onClick={handleEdit}
                  title="Επεξεργασία"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="lost-pet-detail__btn-icon lost-pet-detail__btn-icon--active"
                  title="Προβολή"
                >
                  <Eye size={18} />
                </button>
                <button
                  className="lost-pet-detail__btn-icon"
                  onClick={handleDelete}
                  title="Διαγραφή"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="lost-pet-detail__card">
          <h2 className="lost-pet-detail__card-title">
            {isFoundByOther ? 'Δήλωση Εύρεσης Κατοικιδίου' : 'Δήλωση Απώλειας Κατοικιδίου'}
          </h2>

          {/* Pet Info Card */}
          <div className="lost-pet-detail__pet-card">
            <div className="lost-pet-detail__pet-image">🐕</div>
            <div className="lost-pet-detail__pet-details">
              <h3 className="lost-pet-detail__pet-name">Στοιχεία Κατοικιδίου</h3>
              <div className="lost-pet-detail__pet-info">
                <div className="lost-pet-detail__pet-row">
                  <span className="lost-pet-detail__pet-label">Όνομα</span>
                  <span className="lost-pet-detail__pet-value">{declaration.petName}</span>
                </div>
                <div className="lost-pet-detail__pet-row">
                  <span className="lost-pet-detail__pet-label">Είδος</span>
                  <span className="lost-pet-detail__pet-value">
                    {declaration.petType || declaration.petSpecies}
                  </span>
                </div>
                <div className="lost-pet-detail__pet-row">
                  <span className="lost-pet-detail__pet-label">Ράτσα</span>
                  <span className="lost-pet-detail__pet-value">
                    {declaration.breed || declaration.petBreed}
                  </span>
                </div>
                {isFoundByOther ? (
                  <>
                    <div className="lost-pet-detail__pet-row">
                      <span className="lost-pet-detail__pet-label">Χρώμα</span>
                      <span className="lost-pet-detail__pet-value">{declaration.petColor}</span>
                    </div>
                    <div className="lost-pet-detail__pet-row">
                      <span className="lost-pet-detail__pet-label">Φύλο</span>
                      <span className="lost-pet-detail__pet-value">{declaration.petGender}</span>
                    </div>
                  </>
                ) : (
                  <div className="lost-pet-detail__pet-row">
                    <span className="lost-pet-detail__pet-label">Αριθμός Μικροτσίπ</span>
                    <span className="lost-pet-detail__pet-value">{declaration.microchip}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="lost-pet-detail__section">
            <div className="lost-pet-detail__row">
              <div className="lost-pet-detail__info-item">
                <span className="lost-pet-detail__label">
                  {isFoundByOther ? 'Ημερομηνία Εύρεσης' : 'Ημερομηνία Εξαφάνισης'} 
                  <span className="lost-pet-detail__required">*</span>
                </span>
                <p className="lost-pet-detail__value">{declaration.date}</p>
              </div>

              {!isFoundByOther && (
                <div className="lost-pet-detail__info-item">
                  <span className="lost-pet-detail__label">Τηλέφωνο Επικοινωνίας <span className="lost-pet-detail__required">*</span></span>
                  <p className="lost-pet-detail__value">{declaration.phone}</p>
                </div>
              )}
            </div>

            <div className="lost-pet-detail__info-full">
              <span className="lost-pet-detail__label">
                {isFoundByOther ? 'Τοποθεσία Εύρεσης' : 'Τοποθεσία Εξαφάνισης'} 
                <span className="lost-pet-detail__required">*</span>
              </span>
              <p className="lost-pet-detail__value">{declaration.location}</p>
            </div>

            <div className="lost-pet-detail__info-full">
              <span className="lost-pet-detail__label">Περιγραφή</span>
              <p className="lost-pet-detail__value">{declaration.description}</p>
            </div>

            {/* Contact Information for found_by_other */}
            {isFoundByOther && (
              <>
                <h3 className="lost-pet-detail__section-title">Στοιχεία Επικοινωνίας</h3>
                <div className="lost-pet-detail__row">
                  <div className="lost-pet-detail__info-item">
                    <span className="lost-pet-detail__label">Όνομα <span className="lost-pet-detail__required">*</span></span>
                    <p className="lost-pet-detail__value">{declaration.contactName}</p>
                  </div>
                  <div className="lost-pet-detail__info-item">
                    <span className="lost-pet-detail__label">Τηλέφωνο <span className="lost-pet-detail__required">*</span></span>
                    <p className="lost-pet-detail__value">{declaration.contactPhone}</p>
                  </div>
                </div>
                <div className="lost-pet-detail__info-full">
                  <span className="lost-pet-detail__label">Email</span>
                  <p className="lost-pet-detail__value">{declaration.contactEmail}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LostPetHistoryDetail;
