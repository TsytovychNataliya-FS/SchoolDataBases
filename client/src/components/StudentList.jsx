// components/StudentList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <ul>
      {students.map((student) => (
        <li key={student._id}>
          {student.name} - Age: {student.age} - Teacher:{" "}
          {student.teacher ? student.teacher.name : "N/A"}
        </li>
      ))}
    </ul>
  );
};

export default StudentList;
