const Student = require('../models/Student'); // Ensure this path is correct

// Get all students
exports.getAllStudents = async (req, res) => {
  console.log('Received a request for /students');
  try {
    const students = await Student.find().populate('enrolledClasses'); // Populate enrolledClasses
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res
      .status(500)
      .json({ message: 'Failed to fetch students. Please try again later.' });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  console.log(`Received a request for /student/${req.params.id}`);
  try {
    const student = await Student.findById(req.params.id).populate(
      'enrolledClasses'
    ); // Populate enrolledClasses
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student by ID:', error.message);
    res.status(500).json({
      message: 'Failed to fetch student details. Please try again later.',
    });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  console.log('Received a request for creating a new student');
  const student = new Student(req.body);
  try {
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error.message);
    res.status(400).json({
      message:
        'Failed to create student. Please ensure all required fields are provided.',
    });
  }
};

// Update an existing student
exports.updateStudent = async (req, res) => {
  console.log(
    `Received a request for updating student /student/${req.params.id}`
  );
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error.message);
    res
      .status(400)
      .json({ message: 'Failed to update student. Please check your input.' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  console.log(
    `Received a request for deleting student /student/${req.params.id}`
  );
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: 'Student not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error.message);
    res
      .status(500)
      .json({ message: 'Failed to delete student. Please try again later.' });
  }
};
