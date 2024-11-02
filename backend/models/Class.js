// models/Class.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  startTime: { type: String, required: true }, // Store time as strings (e.g., '10:00 AM')
  endTime: { type: String, required: true },
});

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: [scheduleSchema], // Array of schedule objects
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
