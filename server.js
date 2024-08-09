const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(helmet()); // For security headers
app.use(cors());   // Enable CORS
app.use(morgan('dev')); // Logging requests
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Spaarks API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
