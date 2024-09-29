import React, { useState } from "react";
import StudentList from "./components/StudentList.jsx";
import TeacherList from "./components/TeacherList.jsx";
import TeacherForm from "./components/TeacherForm.jsx";
import StudentForm from "./components/StudentForm.jsx";

function App() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Function to add a student
  const addStudent = (student) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  // Function to add a teacher
  const addTeacher = (teacher) => {
    setTeachers((prevTeachers) => [...prevTeachers, teacher]);
  };

  return (
    <div className="App">
      <header>
        <h1>School Management</h1>
      </header>

      <main>
        <div className="forms">
          <TeacherForm addTeacher={addTeacher} />
          <StudentForm addStudent={addStudent} />
        </div>

        <div className="lists">
          <h2>Teachers</h2>
          <TeacherList teachers={teachers} />

          <h2>Students</h2>
          <StudentList students={students} />
        </div>
      </main>
    </div>
  );
}

export default App;
