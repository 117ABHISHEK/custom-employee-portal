require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB
connectDB();

require('./src/models/User');
require('./src/models/Role');
require('./src/models/Permission');
require('./src/models/UserRole');
require('./src/models/RolePermission');
require('./src/models/AuditLog');

// Middleware
app.use(cors());
app.use(express.json());

// Health check route — good for confirming the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BrainWave Employee Portal API running' });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});