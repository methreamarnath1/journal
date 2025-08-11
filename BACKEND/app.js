const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db.js");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Routes
// auth routes
const authRoutes = require("./src/routes/auth.js");
app.use("/api/auth", authRoutes); // the url to register will be  https://localhost:3000/api/auth/register/ 

// Journal routes
const journalRoutes = require("./src/routes/journal.js");
app.use("/api/journals", journalRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "working" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
  console.log(`http://localhost:${port}/health`);
  console.log(`Server running on port ${port}`);
});
