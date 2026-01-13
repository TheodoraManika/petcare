const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');

// Helper to get DB instance
const getDb = () => router.db;

server.use(middlewares);
server.use(bodyParser.json());

// --- Custom Auth Routes ---

// Login
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDb();
    const user = db.get('users').find({ email, password }).value();

    if (user) {
        // Return mock token and user info (excluding password)
        const { password, ...userSafe } = user;
        res.json({
            token: 'jwt-mock-token-123456',
            user: userSafe
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register
server.post('/auth/register', (req, res) => {
    const { email, password, ...otherData } = req.body;
    const db = getDb();
    const existingUser = db.get('users').find({ email }).value();

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (simple ID generation)
    const id = Date.now().toString();
    const newUser = { id, email, password, ...otherData, createdAt: new Date().toISOString() };

    db.get('users').push(newUser).write();

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({
        token: 'jwt-mock-token-' + id,
        user: userSafe
    });
});


// --- Custom Logic Routes ---

// Advanced Vet Search
server.get('/vets/search', (req, res) => {
    const { city, specialty, day } = req.query;
    const db = getDb();
    let vets = db.get('users').filter({ userType: 'vet' }).value();

    if (city) {
        vets = vets.filter(v =>
            (v.clinicCity && v.clinicCity.includes(city)) ||
            (v.city && v.city.includes(city))
        );
    }

    if (specialty) {
        vets = vets.filter(v => v.specialization === specialty);
    }

    // Filter by Availability (Day)
    // This requires joining with 'availability' collection
    if (day) {
        const availabilities = db.get('availability').value();
        // Find vetIds that have slots on this day
        const availableVetIds = availabilities
            .filter(a => a.dayOfWeek === day && a.slots && a.slots.length > 0)
            .map(a => a.vetId);

        vets = vets.filter(v => availableVetIds.includes(v.id));
    }

    // Attach availability data to each vet
    const availabilities = db.get('availability').value();
    const vetsWithAvailability = vets.map(vet => {
        const vetAvailability = availabilities.filter(a => Number(a.vetId) === Number(vet.id));
        const availableDays = [...new Set(vetAvailability.map(a => a.dayOfWeek || a.day))]; // Handle varied naming
        return {
            ...vet,
            availability: vetAvailability,
            availableDays,
            // Add derived fields for frontend convenience if needed, 
            // but usually frontend does the mapping.
            // keeping it raw but attached is best.
        };
    });

    res.json(vetsWithAvailability);
});

// Middleware for "Draft vs Submitted" Check
server.use((req, res, next) => {
    if (req.method === 'PUT' || req.method === 'PATCH') {
        // Check if we are modifying a restricted resource
        // Logic: If resource has status: 'submitted', allow NO edits except by admin (or specific logic)
        // For now, let's keep it simple: Frontend enforces it, backend allows it for demo purposes 
        // or log a warning.
        // implementation skipped for simplicity unless strict requirement.
    }
    next();
});

// --- File Uploads (Multer) ---
const multer = require('multer');
const path = require('path');
const express = require('express');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Upload Endpoint
server.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname
    });
});

// Serve Uploads Directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Standard Router ---
// Use standard router for all other CRUD operations
server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Custom JSON Server is running on port ${PORT}`);
});
