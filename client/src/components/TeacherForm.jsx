import React, { useState } from "react";
import axios from "axios";
const TeacherForm = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTeacher = { name, subject };
      await axios.post("http://localhost:5001/teachers", newTeacher);
      setName("");
      setSubject("");
      alert("Teacher created successfully!");
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="teacher-form">
      <h3>Create a Teacher</h3>
      <input
        type="text"
        placeholder="Teacher's Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <button type="submit">Add Teacher</button>
    </form>
  );
};

export default TeacherForm;
