import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Edit2, Trash2, AlertCircle, Printer, Download, CheckCircle, ChevronLeft } from 'lucide-react';
import PageLayout from '../../components/common/layout/PageLayout';
import Notification from '../../components/common/modals/Notification';
import PetDetailsCard from '../../components/common/cards/PetDetailsCard';
import { ROUTES, formatDate } from '../../utils/constants';
import './LostPetHistoryDetail.css';

const LostPetHistoryDetail = () => {
    const navigate = useNavigate();
    const { declarationId } = useParams();
    const [declaration, setDeclaration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const fetchDeclaration = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if this is a lost_history entry (ID starts with "history_") or Found_pet entry (ID starts with "found_")
                const isHistory = declarationId.startsWith('history_');
                const isFoundPet = declarationId.startsWith('found_');
                const fetchEndpoint = isHistory ? 'lost_history' : isFoundPet ? 'Found_pet' : 'pets';

                // Fetch the lost pet declaration
                const response = await fetch(`http://localhost:5000/${fetchEndpoint}/${declarationId}`);
                if (!response.ok) {
                    throw new Error('Δήλωση δεν βρέθηκε');
                }

                const lostPet = await response.json();

                // Helper function to parse dates in DD/MM/YYYY or ISO format
                const parseDate = (dateStr) => {
                    if (!dateStr) return '-';

                    // Try to parse ISO format first
                    if (dateStr.includes('T') || dateStr.includes('-')) {
                        const parsed = new Date(dateStr);
                        return isNaN(parsed) ? dateStr : parsed.toLocaleDateString('el-GR');
                    }

                    // Try to parse DD/MM/YYYY format
                    if (dateStr.includes('/')) {
                        const parts = dateStr.split('/');
                        if (parts.length === 3) {
                            const parsed = new Date(parts[2], parts[1] - 1, parts[0]); // Year, Month (0-based), Day
                            return isNaN(parsed) ? dateStr : parsed.toLocaleDateString('el-GR');
                        }
                    }

                    return dateStr;
                };

                // Fetch pet details - try by petId first, then by microchipId
                let petDetails = {};
                if (lostPet.petId) {
                    const petResponse = await fetch(`http://localhost:5000/pets/${lostPet.petId}`);
                    if (petResponse.ok) {
                        petDetails = await petResponse.json();
                    }
                }

                // If no petDetails found and we have microchipId, fetch by microchip
                if (!petDetails.id && lostPet.microchipId) {
                    const petsResponse = await fetch(`http://localhost:5000/pets?microchipId=${lostPet.microchipId}`);
                    if (petsResponse.ok) {
                        const pets = await petsResponse.json();
                        if (pets.length > 0) {
                            petDetails = pets[0];
                        }
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
                const isFoundByOther = isFoundPet || (lostPet.finderName && lostPet.finderId) || (lostPet.foundByUserId);
                const formattedDeclaration = {
                    id: lostPet.id,
                    type: isFoundByOther ? 'found_by_other' : 'loss',
                    petName: lostPet.name || lostPet.petName || petDetails.name || '-',
                    petType: lostPet.type || petDetails.type || '-',
                    petSpecies: lostPet.type || petDetails.type || '-',
                    breed: lostPet.breed || petDetails.breed || '-',
                    petBreed: lostPet.breed || petDetails.breed || '-',
                    petColor: lostPet.color || petDetails.color || '-',
                    petGender: lostPet.gender || petDetails.gender || '-',
                    petImage: petDetails.imageUrl || petDetails.image || lostPet.imageUrl || lostPet.image || '',
                    microchip: lostPet.microchipId || petDetails.microchipId || '-',
                    date: parseDate(lostPet.foundDate || lostPet.foundAt || lostPet.lostDate || lostPet.dateFound || lostPet.dateLost),
                    location: lostPet.area || lostPet.lostLocation || lostPet.location || lostPet.foundLocation || '-',
                    description: lostPet.description || '-',
                    phone: ownerInfo.phone || lostPet.contactPhone || '-',
                    status: lostPet.status || 'submitted',
                    statusLabel: 'Υποβλήθηκε',
                    petStatus: lostPet.petStatus || 1,
                    // For found_by_other - handle both old format and Found_pet format
                    contactName: lostPet.foundByUserName && lostPet.foundByUserSurname
                        ? `${lostPet.foundByUserName} ${lostPet.foundByUserSurname}`
                        : finderInfo.name && finderInfo.lastName
                            ? `${finderInfo.name} ${finderInfo.lastName}`
                            : lostPet.finderName || '-',
                    contactPhone: lostPet.foundByUserPhone || finderInfo.phone || lostPet.finderPhone || lostPet.contactPhone || '-',
                    contactEmail: lostPet.foundByUserEmail || finderInfo.email || lostPet.finderEmail || lostPet.contactEmail || '-',
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

    const showNotification = (message, type = 'success') => {
        setNotification({
            isVisible: true,
            message,
            type
        });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };

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

    const handleFound = async () => {
        try {
            let petId = declarationId;
            let completePetData = null;

            // Check if this is a Found_pet entry
            if (declarationId.startsWith('found_')) {
                // Get the original pet ID from the Found_pet entry
                const foundPetResponse = await fetch(`http://localhost:5000/Found_pet/${declarationId}`);
                if (!foundPetResponse.ok) {
                    throw new Error('Failed to fetch found pet data');
                }
                const foundPetData = await foundPetResponse.json();

                // Extract the actual pet ID (if it exists in the database)
                if (foundPetData.ownerId) {
                    // Try to find the original pet by ownerId and microchipId
                    const petsResponse = await fetch(`http://localhost:5000/pets?ownerId=${foundPetData.ownerId}&microchipId=${foundPetData.microchipId}`);
                    if (petsResponse.ok) {
                        const pets = await petsResponse.json();
                        if (pets.length > 0) {
                            completePetData = pets[0];
                            petId = pets[0].id;
                        }
                    }
                }

                // If no matching pet found, use the Found_pet data itself
                if (!completePetData) {
                    completePetData = foundPetData;
                    // Remove the "found_" prefix to create a new pet entry
                    completePetData.id = foundPetData.microchipId || Date.now().toString();
                }
            } else {
                // Regular pet entry
                const petResponse = await fetch(`http://localhost:5000/pets/${declarationId}`);
                if (!petResponse.ok) {
                    throw new Error('Failed to fetch pet data');
                }
                completePetData = await petResponse.json();
            }

            // Save the complete pet data to lost_history
            const lostHistoryEntry = {
                ...completePetData,
                id: `history_${completePetData.id}_${Date.now()}`,
                petStatus: 2
            };

            const historyResponse = await fetch(`http://localhost:5000/lost_history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lostHistoryEntry),
            });

            if (!historyResponse.ok) {
                throw new Error('Failed to save to lost_history');
            }

            // Then update pet status (if pet exists in pets table)
            if (!declarationId.startsWith('found_') || completePetData.ownerId) {
                const patchResponse = await fetch(`http://localhost:5000/pets/${petId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ petStatus: 0, status: 'active' }),
                });

                if (!patchResponse.ok) {
                    throw new Error('Failed to update pet status');
                }
            }

            // Update local state
            setDeclaration(prev => ({ ...prev, status: 'found', statusLabel: 'Βρέθηκε' }));
            showNotification('Το κατοικίδιό σας σημειώθηκε ως βρεθέν και η ιστορία αποθηκεύτηκε.', 'success');

            // Navigate back to history
            setTimeout(() => {
                navigate(ROUTES.owner.lostHistory);
            }, 1500);
        } catch (error) {
            console.error('Error marking pet as found:', error);
            showNotification('Σφάλμα κατά την ενημέρωση της κατάστασης. Παρακαλώ προσπαθήστε ξανά.', 'error');
        }
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
                <Notification
                    isVisible={notification.isVisible}
                    message={notification.message}
                    type={notification.type}
                />
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

                        {/* Show "Βρέθηκε" button for: 1) own lost pets (type=loss), 2) found_by_other reports that need confirmation */}
                        {declaration.status !== 'found' && declaration.petStatus !== 0 && declaration.petStatus !== 2 &&
                            ((declaration.type === 'loss' && declaration.status !== 'draft') ||
                                (declaration.type === 'found_by_other' && declarationId.startsWith('found_'))) && (
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
                        {!isFoundByOther && declaration.status !== 'submitted' && declaration.status !== 'found' && declaration.status === 'draft' && (
                            <>
                                <button
                                    className="lost-pet-detail__btn-icon"
                                    onClick={handleEdit}
                                    title="Επεξεργασία"
                                >
                                    <Edit2 size={18} />
                                </button>
                                {/* <button
                  className="lost-pet-detail__btn-icon lost-pet-detail__btn-icon--active"
                  title="Προβολή"
                  >
                  <Eye size={18} />
                </button> */}
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

                    <PetDetailsCard
                        petData={{
                            name: declaration.petName,
                            type: declaration.petType || declaration.petSpecies,
                            breed: declaration.breed || declaration.petBreed,
                            color: declaration.petColor,
                            gender: declaration.petGender,
                            image: declaration.petImage,
                            microchipId: declaration.microchip
                        }}
                        variant="owner"
                    />

                    {/* Event Details */}
                    <div className="lost-pet-detail__section">
                        <div className="lost-pet-detail__row">
                            <div className="lost-pet-detail__info-item">
                                <span className="lost-pet-detail__label">
                                    {isFoundByOther ? 'Ημερομηνία Εύρεσης' : 'Ημερομηνία Εξαφάνισης'}
                                    <span className="lost-pet-detail__required">*</span>
                                </span>
                                <p className="lost-pet-detail__value">{formatDate(declaration.date)}</p>
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
