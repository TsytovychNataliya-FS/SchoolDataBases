# School Assignment

This project is a Node.js application for managing a school database using MongoDB. It provides an API to manage students and teachers.

## Features

- **Student Management:** Create, read, update, and delete student records.
- **Teacher Management:** Create, read, update, and delete teacher records.
- **Database:** MongoDB for data storage.

## Server

The server will run on [http://localhost:5001](http://localhost:5001).

## API Endpoints

### Students

- **`POST /students`** - Create a new student.
- **`GET /students`** - Retrieve all students.
- **`GET /students/:id`** - Retrieve a student by ID.
- **`PUT /students/:id`** - Update a student by ID.
- **`DELETE /students/:id`** - Delete a student by ID.

### Teachers

- **`POST /teachers`** - Create a new teacher.
- **`GET /teachers`** - Retrieve all teachers.
- **`GET /teachers/:id`** - Retrieve a teacher by ID.
- **`PUT /teachers/:id`** - Update a teacher by ID.
- **`DELETE /teachers/:id`** - Delete a teacher by ID.

## Summary

This application provides a RESTful API for managing a school's students and teachers. It uses Express.js for the server framework and MongoDB for the database.
