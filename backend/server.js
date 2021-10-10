const express = require('express');
const connectDB = require('../database/db');
const cors = require('cors')

const app = express();

// Connect database
connectDB();

// Init Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json({extended: false}))

// Main route
app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));       // Route for registering user (pass in name, email, password --> creates user entry in database on success and returns token)
app.use('/api/auth', require('./routes/api/auth'));         // Route for authenticating user (pass in email and password --> either authenticates or not and returns token)
app.use('/api/profile', require('./routes/api/profile'));   // Route for creating a new profile or viewing your own profile (/me)
app.use('/api/review', require('./routes/api/review'));     // Route for creating/viewing/deleting reviews

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));