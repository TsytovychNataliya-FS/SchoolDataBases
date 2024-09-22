const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

// Virtual field to get the student count
teacherSchema.virtual("studentCount").get(function () {
  return this.students.length;
});

module.exports = mongoose.model("Teacher", teacherSchema);
