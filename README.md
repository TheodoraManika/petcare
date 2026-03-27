# PetCare

## Contributors
- Manika Theodora
- Kampioti Despoina 
- Katrakis Konstantinos 

[Github link to project](https://github.com/TheodoraManika/petcare)

PetCare was developed for the Human-Computer Interaction course in the Department of Informatics and Telecommunications at NKUA. It redesigns and implements the user interface for the pet.gov.gr portal, aiming to deliver a modern “pet health registration and monitoring” hub that serves pet owners, veterinarians, and citizens with personalized information and streamlined workflows across key services.

## Features

### Pet Owners
- Personalized guidance on platform procedures and next steps.
- View and print pet health records.
- Declarations for lost pets with draft/submitted states.
- Declarations for found pets and declaration history.
- Vet search with filters (area, availability, profile) and detailed profiles.
- Appointment scheduling, confirmation/cancellation flow, and history tracking.
- Vet reviews and ratings.

### Veterinarians
- Guided onboarding and profile creation (credentials, experience, clinic info).
- Pet identity registration and life events (loss, found, transfer, adoption, foster).
- Medical procedure logging and visit history.
- Availability management for appointments.
- Appointment requests with approve/decline flow and notifications.
- Review management.

### Citizens (Public)
- Browse lost pets without authentication.
- Submit found pet reports with location, photos, and finder details.
- View veterinarians' profiles, reviews and ratings.

## Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Fast build tool and development server.
- **React Router**: For client-side routing.
- **Leaflet / React Leaflet**: For map integration (e.g., locating vets or lost pets).
- **Lucide React**: For modern iconography.

### Backend
- **JSON Server**: Fake REST API for prototyping and demo data.
- **Node.js**: Runtime environment for backend scripts.

## Project Scope
This project focuses on the frontend experience. The backend is mocked for demonstration and development purposes, following the assignment’s requirement to design and implement the interface from scratch. It runs on JSON Server and serves data from a local `db.json`, enabling CRUD operations during development without a full backend.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone <repository-url>
    cd petcare
    ```

2.  **Install Backend Dependencies**:
    Navigate to the backend directory and install the required packages.
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    Navigate to the frontend directory and install the required packages.
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

You need to run both the backend (JSON Server) and the frontend (Vite) concurrently.

1.  **Start the Backend**:
    From the `backend` directory:
    ```bash
    npm start
    ```
    This will start the JSON server on `http://localhost:5000`.

2.  **Start the Frontend**:
    From the `frontend` directory (in a new terminal):
    ```bash
    npm run dev
    ```
    This will start the Vite development server, usually on `http://localhost:5173`.

### Test user accounts

- **Pet Owners (7 existing accounts)**:
    - Email: `owner1@petcare.gr` - `owner7@petcare.gr`
    - Password: `password123` (same for all)

- **Vets (10 existing accounts)**:
    - Email: `vet1@petcare.gr` - `vet10@petcare.gr`
    - Password: `password123` (same for all)

*Note: To switch between users, simply change the number in the email 
(e.g. vet2@petcare.gr, owner5@petcare.gr).*

## Project Structure

```
petcare/
├── backend/          # Backend logic and mock database
│   ├── db.json       # JSON database
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
└── README.md         # Project documentation
```