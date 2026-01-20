import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, Download, User, PawPrint, HandHeart, ArrowRightLeft, ArrowLeft, Heart, MapPin } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './HistoryDetail.css';

const HistoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOperationData();
  }, [id]);

  const fetchOperationData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      let operationType = null;

      // Check medical procedures
      const proceduresResponse = await fetch(`http://localhost:5000/medicalProcedures/${id}`);
      if (proceduresResponse.ok) {
        const procedure = await proceduresResponse.json();
        const petResponse = await fetch(`http://localhost:5000/pets/${procedure.petId}`);
        const pet = petResponse.ok ? await petResponse.json() : {};
        
        data = {
          declarationType: 'Ιατρική Πράξη',
          pet: {
            name: pet.name || '-',
            species: pet.type || '-',
            breed: pet.breed || '-',
            microchip: procedure.microchip || pet.microchipId || '-'
          },
          procedure: procedure
        };
        operationType = 'procedure';
      }

      // Check transfers
      if (!data) {
        const transferResponse = await fetch(`http://localhost:5000/transfers/${id}`);
        if (transferResponse.ok) {
          const transfer = await transferResponse.json();
          const petResponse = await fetch(`http://localhost:5000/pets/${transfer.petId}`);
          const pet = petResponse.ok ? await petResponse.json() : {};
          
          data = {
            declarationType: 'Μεταβίβαση',
            pet: {
              name: transfer.petName || pet.name || '-',
              species: pet.type || '-',
              breed: pet.breed || '-',
              microchip: transfer.microchip || pet.microchipId || '-'
            },
            transfer: {
              currentOwner: {
                name: transfer.currentOwnerName?.split(' ')[0] || '-',
                surname: transfer.currentOwnerName?.split(' ')[1] || '-',
                afm: transfer.currentOwnerAfm || '-'
              },
              newOwner: {
                name: transfer.newOwnerName?.split(' ')[0] || '-',
                surname: transfer.newOwnerName?.split(' ')[1] || '-',
                afm: transfer.newOwnerAfm || '-'
              },
              transferDate: formatDate(transfer.transferDate),
              transferReason: transfer.transferReason || '-'
            }
          };
          operationType = 'transfer';
        }
      }

      // Check adoptions
      if (!data) {
        const adoptionResponse = await fetch(`http://localhost:5000/adoptions/${id}`);
        if (adoptionResponse.ok) {
          const adoption = await adoptionResponse.json();
          const petResponse = await fetch(`http://localhost:5000/pets/${adoption.petId}`);
          const pet = petResponse.ok ? await petResponse.json() : {};
          
          data = {
            declarationType: 'Υιοθεσία',
            pet: {
              name: adoption.petName || pet.name || '-',
              species: pet.type || '-',
              breed: pet.breed || '-',
              microchip: adoption.microchip || pet.microchipId || '-'
            },
            adoption: {
              owner: {
                name: adoption.adoptingOwnerName?.split(' ')[0] || '-',
                surname: adoption.adoptingOwnerName?.split(' ')[1] || '-',
                afm: adoption.adoptingOwnerAfm || '-'
              },
              adoptionDate: formatDate(adoption.adoptionDate),
              shelterName: adoption.shelterName || '-',
              hasGarden: adoption.hasGarden ? 'Ναι' : 'Όχι',
              hasOtherPets: adoption.hasOtherPets ? 'Ναι' : 'Όχι',
              hasPetExperience: adoption.hasPetExperience ? 'Ναι' : 'Όχι'
            }
          };
          operationType = 'adoption';
        }
      }

      // Check fosters
      if (!data) {
        const fosterResponse = await fetch(`http://localhost:5000/fosters/${id}`);
        if (fosterResponse.ok) {
          const foster = await fosterResponse.json();
          const petResponse = await fetch(`http://localhost:5000/pets/${foster.petId}`);
          const pet = petResponse.ok ? await petResponse.json() : {};
          
          data = {
            declarationType: 'Αναδοχή',
            pet: {
              name: foster.petName || pet.name || '-',
              species: pet.type || '-',
              breed: pet.breed || '-',
              microchip: foster.microchip || pet.microchipId || '-'
            },
            adoption: {
              owner: {
                name: foster.fosterParentName?.split(' ')[0] || '-',
                surname: foster.fosterParentName?.split(' ')[1] || '-',
                afm: foster.fosterParentAfm || '-'
              },
              adoptionDate: formatDate(foster.fosterDate),
              shelterName: foster.shelterName || '-',
              hasGarden: foster.hasGarden ? 'Ναι' : 'Όχι',
              hasOtherPets: foster.hasOtherPets ? 'Ναι' : 'Όχι',
              hasPetExperience: foster.hasPetExperience ? 'Ναι' : 'Όχι'
            }
          };
          operationType = 'foster';
        }
      }

      // Check Found_pet declarations
      if (!data) {
        const foundPetResponse = await fetch(`http://localhost:5000/Found_pet/${id}`);
        if (foundPetResponse.ok) {
          const foundPet = await foundPetResponse.json();
          
          // Fetch owner info if ownerId exists
          let ownerInfo = null;
          if (foundPet.ownerId) {
            const ownerResponse = await fetch(`http://localhost:5000/users/${foundPet.ownerId}`);
            if (ownerResponse.ok) {
              ownerInfo = await ownerResponse.json();
            }
          }
          
          data = {
            declarationType: 'Δήλωση Εύρεσης',
            pet: {
              name: foundPet.name || 'Άγνωστο',
              species: foundPet.type || '-',
              breed: foundPet.breed || '-',
              microchip: foundPet.microchipId || '-'
            },
            foundPet: {
              foundDate: formatDate(foundPet.foundAt || foundPet.foundDate),
              foundLocation: foundPet.area || '-',
              description: foundPet.description || '-',
              owner: ownerInfo ? {
                name: ownerInfo.name || '-',
                surname: ownerInfo.lastName || '-',
                phone: ownerInfo.phone || '-',
                email: ownerInfo.email || '-'
              } : null
            }
          };
          operationType = 'foundPet';
        }
      }

      if (data) {
        setDetailData(data);
      } else {
        setError('Δεν βρέθηκαν δεδομένα');
      }
    } catch (err) {
      console.error('Error fetching operation data:', err);
      setError('Σφάλμα φόρτωσης δεδομένων');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  // Get title based on declaration type
  const getPageTitle = () => {
    if (!detailData) return 'Προβολή';
    return `Προβολή ${detailData.declarationType}`;
  };

  // Get icon based on declaration type
  const getTitleIcon = () => {
    if (!detailData) return null;
    switch (detailData.declarationType) {
      case 'Μεταβίβαση':
        return <ArrowRightLeft size={24} className="history-detail__icon" />;
      case 'Υιοθεσία':
        return <Heart size={24} className="history-detail__icon" />;
      case 'Αναδοχή':
        return <HandHeart size={24} className="history-detail__icon" />;
      case 'Ιατρική Πράξη':
        return <PawPrint size={24} className="history-detail__icon" />;
      case 'Δήλωση Εύρεσης':
        return <MapPin size={24} className="history-detail__icon" />;
      default:
        return <HandHeart size={24} className="history-detail__icon" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementation for download
    console.log('Download PDF');
  };

  const breadcrumbItems = [
    { label: 'Ιστορικό', path: ROUTES.vet.history }
  ];

  if (loading) {
    return (
      <PageLayout title="Φόρτωση..." breadcrumbs={breadcrumbItems}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Φόρτωση δεδομένων...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !detailData) {
    return (
      <PageLayout title="Σφάλμα" breadcrumbs={breadcrumbItems}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>{error || 'Δεν βρέθηκαν δεδομένα'}</p>
          <button onClick={() => navigate(ROUTES.vet.history)} style={{ marginTop: '20px' }}>
            Επιστροφή
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={getPageTitle()} breadcrumbs={breadcrumbItems}>
      <div className="history-detail">
        <div className="history-detail__header">
          <button 
            className="history-detail__back-btn" 
            onClick={() => navigate(ROUTES.vet.history, { state: { activeTab: 'declarations' } })}
          >
            <ArrowLeft size={14} /> Πίσω
          </button>
        </div>

        <div className="history-detail__content">
          <div className="history-detail__title-row">
            <div className="history-detail__title-wrapper">
              {getTitleIcon()}
              <h1 className="history-detail__title">{detailData.declarationType}</h1>
            </div>
            <div className="history-detail__actions">
              <button className="history-detail__action-btn" onClick={handlePrint}>
                <Printer size={18} />
              </button>
              <button className="history-detail__action-btn" onClick={handleDownload}>
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="history-detail__section history-detail__section--pet">
            <div className="history-detail__section-header">
              <div className="history-detail__pet-icon">
                <PawPrint size={24} />
              </div>
              <h2 className="history-detail__section-title">Στοιχεία Κατοικιδίου</h2>
            </div>
            <div className="history-detail__info-grid">
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Όνομα</span>
                <span className="history-detail__info-value">{detailData.pet.name}</span>
              </div>
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Είδος Ζώου</span>
                <span className="history-detail__info-value">{detailData.pet.type}</span>
              </div>
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Ράτσα</span>
                <span className="history-detail__info-value">{detailData.pet.breed}</span>
              </div>
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Αριθμός Μικροτσίπ</span>
                <span className="history-detail__info-value">{detailData.pet.microchip}</span>
              </div>
              {(detailData.declarationType === 'Υιοθεσία' || detailData.declarationType === 'Αναδοχή') && detailData.pet.age && (
                <>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Ηλικία</span>
                    <span className="history-detail__info-value">{detailData.pet.age} έτη</span>
                  </div>
                  {detailData.pet.gender && (
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Φύλο</span>
                      <span className="history-detail__info-value">{detailData.pet.gender}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ΙΑΤΡΙΚΗ ΠΡΑΞΗ */}
          {detailData.declarationType === 'Ιατρική Πράξη' && detailData.procedure && (
            <div className="history-detail__section">
              <h2 className="history-detail__section-title">Στοιχεία Ιατρικής Πράξης</h2>
              <div className="history-detail__info-column">
                <div className="history-detail__info-item">
                  <span className="history-detail__info-label">Ημερομηνία</span>
                  <span className="history-detail__info-value">{formatDate(detailData.procedure.date)}</span>
                </div>
                <div className="history-detail__info-item">
                  <span className="history-detail__info-label">Τύπος Πράξης</span>
                  <span className="history-detail__info-value">{detailData.procedure.type}</span>
                </div>
                <div className="history-detail__info-item">
                  <span className="history-detail__info-label">Περιγραφή</span>
                  <span className="history-detail__info-value">{detailData.procedure.description}</span>
                </div>
              </div>
            </div>
          )}

          {/* ΜΕΤΑΒΙΒΑΣΗ */}
          {detailData.declarationType === 'Μεταβίβαση' && (
            <>
              <div className="history-detail__owners">
                <div className="history-detail__section">
                  <div className="history-detail__section-header">
                    <User size={20} className="history-detail__section-icon" />
                    <h2 className="history-detail__section-title">Αρχικός Ιδιοκτήτης</h2>
                  </div>
                  <div className="history-detail__info-column">
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Όνομα</span>
                      <span className="history-detail__info-value">{detailData.transfer.currentOwner.name}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Επώνυμο</span>
                      <span className="history-detail__info-value">{detailData.transfer.currentOwner.surname}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">ΑΦΜ</span>
                      <span className="history-detail__info-value">{detailData.transfer.currentOwner.afm}</span>
                    </div>
                  </div>
                </div>

                <div className="history-detail__section">
                  <div className="history-detail__section-header">
                    <User size={20} className="history-detail__section-icon" />
                    <h2 className="history-detail__section-title">Νέος Ιδιοκτήτης</h2>
                  </div>
                  <div className="history-detail__info-column">
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Όνομα</span>
                      <span className="history-detail__info-value">{detailData.transfer.newOwner.name}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Επώνυμο</span>
                      <span className="history-detail__info-value">{detailData.transfer.newOwner.surname}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">ΑΦΜ</span>
                      <span className="history-detail__info-value">{detailData.transfer.newOwner.afm}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="history-detail__section">
                <h2 className="history-detail__section-title">Στοιχεία Μεταβίβασης</h2>
                <div className="history-detail__info-column">
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Ημερομηνία Μεταβίβασης</span>
                    <span className="history-detail__info-value">{detailData.transfer.transferDate}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Λόγος Μεταβίβασης</span>
                    <span className="history-detail__info-value">{detailData.transfer.transferReason}</span>
                  </div>
                  {detailData.transfer.notes && (
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Σημειώσεις</span>
                      <span className="history-detail__info-value">{detailData.transfer.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ΥΙΟΘΕΣΙΑ & ΑΝΑΔΟΧΗ */}
          {(detailData.declarationType === 'Υιοθεσία' || detailData.declarationType === 'Αναδοχή') && (
            <>
              <div className="history-detail__section">
                <div className="history-detail__section-header">
                  <User size={20} className="history-detail__section-icon" />
                  <h2 className="history-detail__section-title">
                    {detailData.declarationType === 'Υιοθεσία' ? 'Στοιχεία Υιοθετούντος' : 'Στοιχεία Ανάδοχου'}
                  </h2>
                </div>
                <div className="history-detail__info-grid">
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Όνομα</span>
                    <span className="history-detail__info-value">{detailData.adoption.owner.name}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Επώνυμο</span>
                    <span className="history-detail__info-value">{detailData.adoption.owner.surname}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">ΑΦΜ</span>
                    <span className="history-detail__info-value">{detailData.adoption.owner.afm}</span>
                  </div>
                </div>
              </div>

              <div className="history-detail__section">
                <h2 className="history-detail__section-title">
                  {detailData.declarationType === 'Υιοθεσία' ? 'Στοιχεία Υιοθεσίας' : 'Στοιχεία Αναδοχής'}
                </h2>
                <div className="history-detail__info-grid">
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">
                      Ημερομηνία {detailData.declarationType === 'Υιοθεσία' ? 'Υιοθεσίας' : 'Αναδοχής'}
                    </span>
                    <span className="history-detail__info-value">{detailData.adoption.adoptionDate}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Καταφύγιο/Φιλοζωική</span>
                    <span className="history-detail__info-value">{detailData.adoption.shelterName}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Διαθέσιμος Κήπος/Αυλή</span>
                    <span className="history-detail__info-value">{detailData.adoption.hasGarden}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Υπάρχουν άλλα κατοικίδια</span>
                    <span className="history-detail__info-value">{detailData.adoption.hasOtherPets}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Εμπειρία με κατοικίδια</span>
                    <span className="history-detail__info-value">{detailData.adoption.hasPetExperience}</span>
                  </div>
                  {detailData.adoption.notes && (
                    <div className="history-detail__info-item history-detail__info-item--full">
                      <span className="history-detail__info-label">Σημειώσεις</span>
                      <span className="history-detail__info-value">{detailData.adoption.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ΔΗΛΩΣΗ ΕΥΡΕΣΗΣ */}
          {detailData.declarationType === 'Δήλωση Εύρεσης' && (
            <>
              {detailData.foundPet.owner && (
                <div className="history-detail__section">
                  <div className="history-detail__section-header">
                    <User size={20} className="history-detail__section-icon" />
                    <h2 className="history-detail__section-title">Στοιχεία Ιδιοκτήτη</h2>
                  </div>
                  <div className="history-detail__info-grid">
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Όνομα</span>
                      <span className="history-detail__info-value">{detailData.foundPet.owner.name}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Επώνυμο</span>
                      <span className="history-detail__info-value">{detailData.foundPet.owner.surname}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Τηλέφωνο</span>
                      <span className="history-detail__info-value">{detailData.foundPet.owner.phone}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Email</span>
                      <span className="history-detail__info-value">{detailData.foundPet.owner.email}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="history-detail__section">
                <h2 className="history-detail__section-title">Στοιχεία Εύρεσης</h2>
                <div className="history-detail__info-grid">
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Ημερομηνία Εύρεσης</span>
                    <span className="history-detail__info-value">{detailData.foundPet.foundDate}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Τοποθεσία Εύρεσης</span>
                    <span className="history-detail__info-value">{detailData.foundPet.foundLocation}</span>
                  </div>
                  {!detailData.foundPet.owner && (
                    <div className="history-detail__info-item history-detail__info-item--full">
                      <span className="history-detail__info-label">Κατάσταση</span>
                      <span className="history-detail__info-value">Άγνωστος Ιδιοκτήτης</span>
                    </div>
                  )}
                  {detailData.foundPet.description && (
                    <div className="history-detail__info-item history-detail__info-item--full">
                      <span className="history-detail__info-label">Περιγραφή</span>
                      <span className="history-detail__info-value">{detailData.foundPet.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryDetail;
