const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher" }, // Reference to Teacher
});

module.exports = mongoose.model("Student", studentSchema);
