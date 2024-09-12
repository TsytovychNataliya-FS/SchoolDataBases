const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Unique constraint
  subject: { type: String, required: true },
  hireDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", teacherSchema);
