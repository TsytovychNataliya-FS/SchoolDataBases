const Student = require("../modules/student");
const Teacher = require("../modules/teacher");
const Messages = require("../modules/messages");

// Create a new student
const createStudent = async (req, res) => {
  try {
    // Check if the teacher exists before creating a student
    const teacher = await Teacher.findById(req.body.teacher);
    if (!teacher) {
      return res.status(404).json({ error: Messages.TEACHER_NOT_FOUND });
    }

    const student = new Student(req.body);
    await student.save();

    // Add the student to the teacher's students array
    teacher.students.push(student._id);
    await teacher.save();

    console.log(`Added student ${student._id} to teacher ${teacher._id}`); // Debug log

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    // Fetch all students and populate the teacher information, excluding version info
    const students = await Student.find()
      .populate("teacher", "name") // Only include the teacher's name
      .select("-__v"); // Exclude version info (__v)

    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("teacher", "name") // Only include the teacher's name
      .select("-__v"); // Exclude version info (__v)

    if (!student) {
      return res.status(404).json({ error: Messages.STUDENT_NOT_FOUND });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update student by ID
const updateStudent = async (req, res) => {
  try {
    // Find the student and its current teacher
    const student = await Student.findById(req.params.id).populate("teacher");

    if (!student) {
      return res.status(404).json({ error: Messages.STUDENT_NOT_FOUND });
    }

    // Store the current teacher and the new teacher
    const currentTeacher = student.teacher;
    const newTeacherId = req.body.teacher;

    // Update the student information
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: Messages.STUDENT_NOT_FOUND });
    }

    // If the teacher has changed, update the teachers' students arrays
    if (currentTeacher && currentTeacher._id.toString() !== newTeacherId) {
      // Remove the student from the current teacher
      await Teacher.findByIdAndUpdate(currentTeacher._id, {
        $pull: { students: student._id },
      });
    }

    if (newTeacherId) {
      // Add the student to the new teacher's students array
      const newTeacher = await Teacher.findById(newTeacherId);
      if (newTeacher) {
        await Teacher.findByIdAndUpdate(newTeacherId, {
          $addToSet: { students: student._id },
        });
      }
    }

    // Respond with the updated student data
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete student by ID
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: Messages.STUDENT_NOT_FOUND });
    }

    // Remove the student from the teacher's students array
    const result = await Teacher.updateMany(
      { students: student._id },
      { $pull: { students: student._id } }
    );

    console.log(
      `Removed student ${student._id} from ${result.nModified} teachers`
    ); // Debug log

    res.status(204).json({ message: Messages.DELETE_SUCCESS });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
