// components/StudentForm.jsx
import React, { useState } from "react";
import axios from "axios";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [age, setAge] = useState(""); // Add state for age

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newStudent = { name, teacher: teacherId, age }; // Include age
      await axios.post("http://localhost:5001/students", newStudent);
      setName("");
      setTeacherId("");
      setAge(""); // Reset age field
      alert("Student created successfully!");
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <h3>Create a Student</h3>
      <input
        type="text"
        placeholder="Student's Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Teacher ID"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        required
      />
      <input
        type="number" // Change type to number for age
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;
