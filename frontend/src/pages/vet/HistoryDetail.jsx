import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, Download, User, PawPrint, Handshake, ArrowRightLeft, Heart } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';
import './HistoryDetail.css';

const HistoryDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - In real app, fetch based on id
  const mockDataCollection = {
    '1': {
      declarationType: 'Μεταβίβαση',
      pet: {
        name: 'Μπάμπης',
        species: 'Σκύλος',
        breed: 'Golden Retriever',
        age: '2',
        gender: 'Αρσενικό',
        microchip: 'GR123456789012345'
      },
      transfer: {
        currentOwner: {
          name: 'Σοφία',
          surname: 'Παπαδόκη',
          afm: '123456789',
          phone: '+30 210 1234567',
          email: 'sofia.papadoki@example.com',
          address: 'Λεωφόρος Αθηνών 123',
          city: 'Αθήνα',
          postalCode: '11524'
        },
        newOwner: {
          name: 'Νίκος',
          surname: 'Μιχαλόπουλος',
          afm: '987654321',
          phone: '+30 210 9876543',
          email: 'nikos.michalopoulos@example.com',
          address: 'Πατησίων 45',
          city: 'Αθήνα',
          postalCode: '10682'
        },
        transferDate: '05/11/2025',
        transferReason: 'Μετακόμιση σε άλλη πόλη και αδυναμία φροντίδας του κατοικιδίου',
        notes: 'Το κατοικίδιο είναι εμβολιασμένο και σε άριστη κατάσταση υγείας. Έχει υποβληθεί σε τακτικούς ελέγχους.'
      }
    },
    '2': {
      declarationType: 'Υιοθεσία',
      pet: {
        name: 'Μίνι',
        species: 'Γάτα',
        breed: 'Σιαμέζα',
        age: '1',
        gender: 'Θηλυκό',
        microchip: 'GR987654321098765'
      },
      adoption: {
        owner: {
          name: 'Μαρία',
          surname: 'Ιωάννου',
          afm: '456789123',
          phone: '+30 210 5555555',
          email: 'maria.ioannou@example.com',
          address: 'Σόλωνος 78',
          city: 'Αθήνα',
          postalCode: '10679'
        },
        adoptionDate: '01/11/2025',
        shelterName: 'Καταφύγιο Φιλόζωων Αθηνών "Η Στέγη"',
        hasGarden: 'Ναι',
        hasOtherPets: 'Ναι',
        hasPetExperience: 'Ναι',
        notes: 'Η υιοθετούσα διαθέτει όλο τον απαραίτητο εξοπλισμό και κρίνεται κατάλληλη για την υιοθεσία.'
      }
    },
    '3': {
      declarationType: 'Αναδοχή',
      pet: {
        name: 'Ρεξ',
        species: 'Σκύλος',
        breed: 'Λαμπραντόρ',
        age: '3',
        gender: 'Αρσενικό',
        microchip: 'GR555666777888999'
      },
      adoption: {
        owner: {
          name: 'Δημήτρης',
          surname: 'Παπάς',
          afm: '321654987',
          phone: '+30 210 7777777',
          email: 'dimitris.papas@example.com',
          address: 'Ακαδημίας 156',
          city: 'Αθήνα',
          postalCode: '10673'
        },
        adoptionDate: '28/10/2025',
        shelterName: 'Φιλοζωική Οργάνωση "Ελπίδα για τα Ζώα"',
        hasGarden: 'Όχι',
        hasOtherPets: 'Όχι',
        hasPetExperience: 'Ναι',
        notes: 'Ο ανάδοχος έχει προηγούμενη εμπειρία με σκύλους μεγάλου μεγέθους και έχει ξανά υπάρξει ανάδοχος.'
      }
    }
  };

  // Get the detail data based on ID, default to first entry
  const detailData = mockDataCollection[id] || mockDataCollection['1'];

  // Get icon based on declaration type
  const getTitleIcon = () => {
    switch (detailData.declarationType) {
      case 'Μεταβίβαση':
        return <ArrowRightLeft size={24} className="history-detail__icon" />;
      case 'Υιοθεσία':
        return <Heart size={24} className="history-detail__icon" />;
      case 'Αναδοχή':
        return <Handshake size={24} className="history-detail__icon" />;
      default:
        return <Handshake size={24} className="history-detail__icon" />;
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
    { label: 'Μενού', path: ROUTES.vet.dashboard },
    { label: 'Ιστορικό', path: ROUTES.vet.history }
  ];

  return (
    <PageLayout title="Λεπτομέρειες Ιστορικού" breadcrumbs={breadcrumbItems}>
      <div className="history-detail">
        <div className="history-detail__header">
          <div className="history-detail__breadcrumb">
            <span className="history-detail__breadcrumb-link" onClick={() => navigate(ROUTES.vet.dashboard)}>
              Μενού
            </span>
            <span className="history-detail__breadcrumb-separator">›</span>
            <span className="history-detail__breadcrumb-link" onClick={() => navigate(ROUTES.vet.history)}>
              Ιστορικό
            </span>
            <span className="history-detail__breadcrumb-separator">›</span>
            <span className="history-detail__breadcrumb-current">
              Δήλωση {detailData.declarationType} {detailData.pet.name}
            </span>
          </div>
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
                <span className="history-detail__info-value">{detailData.pet.species}</span>
              </div>
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Ράτσα</span>
                <span className="history-detail__info-value">{detailData.pet.breed}</span>
              </div>
              <div className="history-detail__info-item">
                <span className="history-detail__info-label">Αριθμός Μικροτσίπ</span>
                <span className="history-detail__info-value">{detailData.pet.microchip}</span>
              </div>
              {(detailData.declarationType === 'Υιοθεσία' || detailData.declarationType === 'Αναδοχή') && (
                <>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Ηλικία</span>
                    <span className="history-detail__info-value">{detailData.pet.age} έτη</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Φύλο</span>
                    <span className="history-detail__info-value">{detailData.pet.gender}</span>
                  </div>
                </>
              )}
            </div>
          </div>

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
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Τηλέφωνο</span>
                      <span className="history-detail__info-value">{detailData.transfer.currentOwner.phone}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Email</span>
                      <span className="history-detail__info-value">{detailData.transfer.currentOwner.email}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Διεύθυνση</span>
                      <span className="history-detail__info-value">
                        {detailData.transfer.currentOwner.address}, {detailData.transfer.currentOwner.city}, {detailData.transfer.currentOwner.postalCode}
                      </span>
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
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Τηλέφωνο</span>
                      <span className="history-detail__info-value">{detailData.transfer.newOwner.phone}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Email</span>
                      <span className="history-detail__info-value">{detailData.transfer.newOwner.email}</span>
                    </div>
                    <div className="history-detail__info-item">
                      <span className="history-detail__info-label">Διεύθυνση</span>
                      <span className="history-detail__info-value">
                        {detailData.transfer.newOwner.address}, {detailData.transfer.newOwner.city}, {detailData.transfer.newOwner.postalCode}
                      </span>
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
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Τηλέφωνο</span>
                    <span className="history-detail__info-value">{detailData.adoption.owner.phone}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Email</span>
                    <span className="history-detail__info-value">{detailData.adoption.owner.email}</span>
                  </div>
                  <div className="history-detail__info-item">
                    <span className="history-detail__info-label">Διεύθυνση</span>
                    <span className="history-detail__info-value">
                      {detailData.adoption.owner.address}, {detailData.adoption.owner.city}, {detailData.adoption.owner.postalCode}
                    </span>
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
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryDetail;
