const Student = require('../models/Student');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

// Constants for college geolocation
const COLLEGE_LATITUDE = 17.196194148753055; // Replace with actual college latitude
const COLLEGE_LONGITUDE = 78.59723549286544; // Replace with actual college longitude
const RADIUS_METERS = 100; // Radius in meters for acceptable distance from college

// Helper function to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Function to mark attendance
exports.markAttendance = async (req, res) => {
  const { studentId, classId, location } = req.body;
  const currentTime = new Date();

  try {
    // Verify if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student is enrolled in the class by its ObjectId
    const enrolledClassId = student.enrolledClasses.find((cls) =>
      cls.equals(classId)
    );
    if (!enrolledClassId) {
      return res
        .status(404)
        .json({ message: 'Class not found in enrolled classes' });
    }

    // Retrieve the class details from the Class model
    const enrolledClass = await Class.findById(enrolledClassId);
    if (!enrolledClass) {
      return res.status(404).json({ message: 'Class details not found' });
    }

    // Ensure the class has a schedule
    if (!enrolledClass.schedule || !Array.isArray(enrolledClass.schedule)) {
      return res.status(400).json({ message: 'Class schedule is not defined' });
    }

    // Determine today's day of the week
    const dayOfWeek = currentTime.toLocaleString('en-US', { weekday: 'long' });
    const classSchedule = enrolledClass.schedule.find(
      (schedule) => schedule.day.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (!classSchedule) {
      return res.status(400).json({ message: 'No class scheduled for today' });
    }

    // Calculate class start and end times
    const startTime = new Date(
      `${currentTime.toDateString()} ${classSchedule.startTime}`
    );
    const endTime = new Date(
      `${currentTime.toDateString()} ${classSchedule.endTime}`
    );
    const gracePeriodStart = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 mins before
    const gracePeriodEnd = new Date(endTime.getTime() + 15 * 60 * 1000); // 15 mins after

    // Check if the current time is within the grace period
    if (currentTime < gracePeriodStart || currentTime > gracePeriodEnd) {
      return res.status(400).json({
        message:
          'You can only mark attendance during the class time or within the grace period',
      });
    }

    // Verify geolocation
    const distance = getDistanceFromLatLonInMeters(
      location.latitude,
      location.longitude,
      COLLEGE_LATITUDE,
      COLLEGE_LONGITUDE
    );
    if (distance > RADIUS_METERS) {
      return res
        .status(400)
        .json({ message: 'You are outside the allowed college location' });
    }

    // Record attendance in the Attendance model
    const attendanceRecord = new Attendance({
      classId: enrolledClassId,
      studentId: student._id,
      date: currentTime,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      attended: true,
      time: currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    await attendanceRecord.save(); // Save the attendance record

    return res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to get attendance records for a specific student
exports.getAttendanceRecords = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ studentId })
      .populate('classId', 'name') // Populate class name if needed
      .select('classId date location attended time'); // Select fields to return

    if (!attendanceRecords) {
      return res.status(404).json({ message: 'Attendance records not found' });
    }

    return res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error('Error retrieving attendance records:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
