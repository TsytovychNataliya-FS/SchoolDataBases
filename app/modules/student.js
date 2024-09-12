const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true }, // Relationship to Teacher
});

module.exports = mongoose.model("Student", studentSchema);
