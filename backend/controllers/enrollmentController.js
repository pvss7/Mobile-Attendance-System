const Student = require('../models/Student'); // Ensure path is correct
const Class = require('../models/Class'); // Ensure path is correct

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.log('Unauthorized access attempt by user:', req.user);
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// Enroll a student in a class (Admin only)
exports.enrollStudentInClass = [
  isAdmin,
  async (req, res) => {
    const { studentId, classId } = req.body;

    console.log('Received request for /enroll with body:', req.body);

    try {
      const student = await Student.findById(studentId);
      console.log('Fetched student:', student);

      const foundClass = await Class.findById(classId);
      console.log('Fetched class:', foundClass);

      if (!student || !foundClass) {
        console.log('Error: Student or Class not found');
        return res.status(404).json({ message: 'Student or Class not found' });
      }

      // Check if student is already enrolled
      if (student.enrolledClasses.includes(classId)) {
        console.log(
          `Error: Student ${studentId} is already enrolled in class ${classId}`
        );
        return res.status(400).json({ message: 'Student already enrolled' });
      }

      // Add class to student's enrolled classes
      student.enrolledClasses.push(classId);
      await student.save();
      console.log(`Success: Student ${studentId} enrolled in class ${classId}`);

      res.status(200).json({ message: 'Student enrolled successfully' });
    } catch (err) {
      console.error('Error during enrollment:', err.message);
      res.status(500).json({ error: err.message });
    }
  },
];
