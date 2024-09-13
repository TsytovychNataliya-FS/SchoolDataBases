const Teacher = require("../modules/teacher");
const Messages = require("../modules/messages");

// Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all teachers and include student count
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.aggregate([
      {
        $lookup: {
          from: "students", // The name of the students collection
          localField: "_id",
          foreignField: "teacher",
          as: "students",
        },
      },
      {
        $project: {
          name: 1,
          subject: 1,
          studentCount: { $size: "$students" }, // Count of students
        },
      },
    ]);

    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get teacher by ID and include student count
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "students", // The name of the students collection
          localField: "_id",
          foreignField: "teacher",
          as: "students",
        },
      },
      {
        $project: {
          name: 1,
          subject: 1,
          studentCount: { $size: "$students" }, // Count of students
        },
      },
    ]);

    if (!teacher.length) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json(teacher[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update teacher by ID
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v"); // Exclude version info (__v)

    if (!teacher) {
      return res.status(404).json({ error: Messages.TEACHER_NOT_FOUND });
    }

    // Optionally, if you want to return studentCount, you will need to use aggregation
    const teacherWithCount = await Teacher.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "teacher",
          as: "students",
        },
      },
      {
        $project: {
          name: 1,
          subject: 1,
          studentCount: { $size: "$students" },
        },
      },
    ]);

    res.status(200).json(teacherWithCount[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete teacher by ID
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: Messages.TEACHER_NOT_FOUND });
    }

    res.status(204).json({ message: Messages.DELETE_SUCCESS });
  } catch (error) {
    res.status(400).json({ error: Messages.INVALID_ID });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
