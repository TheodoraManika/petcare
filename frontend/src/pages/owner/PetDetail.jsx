import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Dog, Cat } from 'lucide-react';
import PageLayout from '../../components/global/layout/PageLayout';
import MedicalEventCard from '../../components/owner/healthcard/MedicalEventCard';
import StatCard from '../../components/owner/healthcard/StatCard';
import { ROUTES } from '../../utils/constants';
import './PetDetail.css';

const PetDetail = () => {
  const navigate = useNavigate();
  const { petId } = useParams();

  // Mock data - in real app, this would come from API/database
  const petsData = {
    pet1: {
      name: 'Μπάμπης',
      type: 'Σκύλος',
      breed: 'Golden Retriever',
      gender: 'Αρσενικό',
      birthDate: '15/4/2020',
      microchip: '123456789012345',
      afm: '123456789',
      icon: 'dog',
      medicalHistory: [
        {
          id: 1,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Πενταπλός εμβολιασμός',
          date: '10/11/2024',
          vet: 'Δρ. Χώρης Παπαδόπουλος',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 2,
          type: 'surgery',
          title: 'Χειρουργείο',
          description: 'Στείρωση',
          date: '5/6/2024',
          vet: 'Δρ. Μαρία Γεωργίου',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 3,
          type: 'examination',
          title: 'Εξέταση',
          description: 'Γενική εξέταση',
          date: '20/7/2024',
          vet: 'Δρ. Χώρης Παπαδόπουλος',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 4,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Εμβόλιο λύσσας',
          date: '12/5/2024',
          vet: 'Δρ. Ελένη Νικολάου',
          status: 'Ολοκληρώθηκε',
        },
      ],
      stats: {
        vaccinations: 2,
        surgeries: 1,
        examinations: 1,
      },
    },
    pet2: {
      name: 'Μίνι',
      type: 'Γάτα',
      breed: 'Περσική',
      gender: 'Θηλυκό',
      birthDate: '22/6/2021',
      microchip: '987654321098765',
      afm: '123456788',
      icon: 'cat',
      medicalHistory: [
        {
          id: 1,
          type: 'vaccination',
          title: 'Εμβολιασμός',
          description: 'Τριπλός εμβολιασμός',
          date: '10/10/2024',
          vet: 'Δρ. Άννα Παπαδάκη',
          status: 'Ολοκληρώθηκε',
        },
        {
          id: 2,
          type: 'examination',
          title: 'Εξέταση',
          description: 'Οδοντιατρικός έλεγχος',
          date: '3/9/2024',
          vet: 'Δρ. Νίκος Ιωάννου',
          status: 'Ολοκληρώθηκε',
        },
      ],
      stats: {
        vaccinations: 1,
        surgeries: 0,
        examinations: 1,
      },
    },
  };

  const pet = petsData[petId];

  const breadcrumbItems = [
    { label: 'Μενού', path: ROUTES.owner.dashboard },
    { label: 'Βιβλιάριο Υγείας', path: ROUTES.owner.pets }
  ];


  const handlePrint = () => {
    window.print();
  };


  const getPetIcon = (iconType) => {
    switch (iconType) {
      case 'dog':
        return <Dog size={40} />;
      case 'cat':
        return <Cat size={40} />;
      default:
        return <Dog size={40} />;
    }
  };

  if (!pet) {
    return (
      <PageLayout variant="owner" title="Κατοικίδιο" breadcrumbs={breadcrumbItems}>
        <div className="owner-pet-detail">
          <p>Το κατοικίδιο δεν βρέθηκε.</p>
        </div>
      </PageLayout>
    );
  }

return (
    <PageLayout variant="owner" title={pet.name} breadcrumbs={breadcrumbItems}>
        <div className="owner-pet-detail">
            <div className="owner-pet-detail__header">
            </div>

            <div className="owner-pet-detail__content">
                <div className="owner-pet-detail__sidebar">
                    <div className="owner-pet-detail__pet-card">
                        <div className="owner-pet-detail__pet-avatar">
                            <span className="owner-pet-detail__pet-icon">{getPetIcon(pet.icon)}</span>
                        </div>
                        <h2 className="owner-pet-detail__pet-name">{pet.name}</h2>
                        
                        <div className="owner-pet-detail__pet-info">
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Είδος</span>
                                <span className="owner-pet-detail__info-value">{pet.type}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Ράτσα</span>
                                <span className="owner-pet-detail__info-value">{pet.breed}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Φύλο</span>
                                <span className="owner-pet-detail__info-value">{pet.gender}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Ημερομηνία Γέννησης</span>
                                <span className="owner-pet-detail__info-value">{pet.birthDate}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">Αριθμός Μικροτσίπ</span>
                                <span className="owner-pet-detail__info-value">{pet.microchip}</span>
                            </div>
                            <div className="owner-pet-detail__info-row">
                                <span className="owner-pet-detail__info-label">ΑΦΜ Ιδιοκτήτη</span>
                                <span className="owner-pet-detail__info-value">{pet.afm}</span>
                            </div>
                        </div>

                        <button className="owner-pet-detail__download-btn" onClick={handlePrint}>
                            <Download size={18} />
                            Εκτύπωση Βιβλιαρίου
                        </button>
                    </div>
                </div>

                <div className="owner-pet-detail__main">
                    <h2 className="owner-pet-detail__section-title">Ιατρικό Ιστορικό</h2>

                    <div className="owner-pet-detail__events">
                        {pet.medicalHistory.map((event) => (
                            <MedicalEventCard key={event.id} event={event} />
                        ))}
                    </div>

                    <h2 className="owner-pet-detail__section-title">Στατιστικά</h2>
                    <div className="owner-pet-detail__stats">
                        <StatCard type="vaccination" label="Εμβολιασμοί" value={pet.stats.vaccinations} />
                        <StatCard type="surgery" label="Χειρουργεία" value={pet.stats.surgeries} />
                        <StatCard type="examination" label="Εξετάσεις" value={pet.stats.examinations} />
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
);
};

export default PetDetail;