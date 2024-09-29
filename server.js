const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const routes = require("./app/routes/index"); // Correct path to index.js

// Middleware to parse JSON
app.use(express.json());

// Use CORS middleware to allow cross-origin requests
app.use(cors()); // Add this line

// Use the routes defined in routes/index.js
app.use("/", routes);

// Connect to database
const connectDB = require("./app/db/config");
connectDB();

// Start server
const PORT = process.env.PORT || 5001; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
