const Class = require('../models/Class'); // Ensure the path is correct

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return res.json(classData);
  } catch (error) {
    console.error('Error fetching class by ID:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new class
const createClass = async (req, res) => {
  const { name, schedule } = req.body; // Get schedule from the request body
  try {
    const newClass = new Class({ name, schedule }); // Save schedule
    await newClass.save();
    return res.status(201).json({ message: 'Class added' }); // Return a success message
  } catch (error) {
    console.error('Error creating class:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing class
const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure validators run on update
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    return res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    return res.json(classes);
  } catch (error) {
    console.error('Error fetching all classes:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getAllClasses,
};
