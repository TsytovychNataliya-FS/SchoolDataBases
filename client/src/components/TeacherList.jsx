import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <ul>
      {teachers.map((teacher) => (
        <li key={teacher._id}>
          {teacher.name} - {teacher.subject} - Teacher ID: {teacher._id} -
          Number of Students: {teacher.students.length}
        </li>
      ))}
    </ul>
  );
};

export default TeacherList;
