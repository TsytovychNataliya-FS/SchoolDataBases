const Teacher = require("../modules/teacher");
const Messages = require("../modules/messages");
const mongoose = require("mongoose");

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

// Get all teachers and include student count, query string, and sorting
const getAllTeachers = async (req, res) => {
  try {
    const { minStudents, maxStudents, sortBy, subject } = req.query;
    const matchCriteria = {};

    // Validate and set minStudents
    if (minStudents) {
      const min = Number(minStudents);
      if (isNaN(min)) {
        return res.status(400).json({ error: Messages.MIN_STUDENTS });
      }
      matchCriteria.studentCount = { $gte: min };
    }

    // Validate and set maxStudents
    if (maxStudents) {
      const max = Number(maxStudents);
      if (isNaN(max)) {
        return res.status(400).json({ error: Messages.MAX_STUDENTS });
      }
      if (!matchCriteria.studentCount) {
        matchCriteria.studentCount = {};
      }
      matchCriteria.studentCount.$lte = max;
    }

    // Add subject to match criteria if provided
    if (subject) {
      matchCriteria.subject = subject; // Match teachers by subject
    }

    const teachers = await Teacher.aggregate([
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
          students: "$students.name", // Include student names
        },
      },
      {
        $match: matchCriteria, // Match based on the constructed criteria
      },
      {
        $sort: { [sortBy || "subject"]: 1 }, // Default to sorting by subject if sortBy is not provided
      },
    ]);

    if (teachers.length === 0) {
      return res.status(404).json({ message: Messages.TEACHER_NOT_FOUND_C });
    }

    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get teacher by ID and include student count and names
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.aggregate([
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
        $addFields: {
          studentCount: { $size: "$students" },
        },
      },
      {
        $project: {
          name: 1,
          subject: 1,
          studentCount: 1,
          students: "$students.name",
        },
      },
    ]);

    if (!teacher.length) {
      return res.status(404).json({ error: Messages.TEACHER_NOT_FOUND });
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
    }).select("-__v");

    if (!teacher) {
      return res.status(404).json({ error: Messages.TEACHER_NOT_FOUND });
    }

    const updatedTeacher = await Teacher.aggregate([
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
        $addFields: {
          studentCount: { $size: "$students" },
        },
      },
      {
        $project: {
          name: 1,
          subject: 1,
          studentCount: 1,
          students: "$students.name",
        },
      },
    ]);

    res.status(200).json(updatedTeacher[0]);
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
