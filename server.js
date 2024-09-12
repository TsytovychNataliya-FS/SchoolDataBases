const express = require("express");
const app = express();
const routes = require("./app/routes/index"); // Correct path to index.js

// Middleware to parse JSON
app.use(express.json());

// Use the routes defined in routes/index.js
app.use("/", routes);

// Connect to database
const connectDB = require("./app/db/config");
connectDB();

// Start server
app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
