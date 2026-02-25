require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/family-members', require('./routes/familyMemberRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Family Memory Management Platform API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

// Try to listen on default port, if in use try next available port
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use.`);
      if (port === DEFAULT_PORT) {
        // try next port
        const next = port + 1;
        console.log(`Trying port ${next} instead...`);
        startServer(next);
      } else {
        console.error(`Port ${port} is unavailable. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return server;
};

startServer(DEFAULT_PORT);
