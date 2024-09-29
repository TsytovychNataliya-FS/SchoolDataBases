const express = require("express");
const studentRoutes = require("../routes/studentRoutes");
const teacherRoutes = require("../routes/teacherRoutes");
require("dotenv").config(); // To access environment variables

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);

module.exports = app; // Export the app for use in server.js
