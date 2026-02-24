# PetCare

- Μανίκα Θεοδώρα  1115202100267
- Καμπιώτη Δέσποινα 1115202100285
- Κατράκης Κωνσταντίνος 1115201800279

[Github link to project](https://github.com/TheodoraManika/petcare)

PetCare is a comprehensive web application designed to connect pet owners, veterinarians, and citizens. It facilitates pet adoption, helps track lost and found pets, and manages veterinary appointments.

## Features

- **Pet Adoption**: Browse pets available for adoption from veterinarians.
- **Lost & Found**: Report lost pets or register found pets to help reunite them with their owners.
- **Appointments**: Book and manage appointments with veterinarians.
- **User Roles**: Specialized interfaces for:
  - **Pet Owners**: Manage pets, appointments, and report lost pets.
  - **Veterinarians**: Manage adoptions, appointments, and medical records.
  - **Citizens**: Report found pets and browse adoptions.

## Tech Stack

### Frontend
- **React**: UI library for building the interface.
- **Vite**: Fast build tool and development server.
- **React Router**: For client-side routing.
- **Leaflet / React Leaflet**: For map integration (e.g., locating vets or lost pets).
- **Lucide React**: For modern iconography.

### Backend
- **JSON Server**: A full fake REST API for prototyping and development.
- **Node.js**: Runtime environment for the backend scripts.

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
│   └── uploads/      # Image uploads
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
└── README.md         # Project documentation
```