// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/routes/config/db');

dotenv.config();

// Connect to MongoDB first
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const applicationRoutes = require('./src/routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
