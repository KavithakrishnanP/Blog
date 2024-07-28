const express = require('express');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

// Router import
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require('./routes/blogRoutes');

// MongoDB connect
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Adjust this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'client/build')));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Serve React frontend
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
