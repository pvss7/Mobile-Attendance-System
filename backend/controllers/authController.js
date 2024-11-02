const User = require('../models/Student'); // Adjust the path if necessary
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login function
exports.login = async (req, res) => {
  console.log('Login request received:', req.body);
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ id });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      redirectTo:
        user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard',
      id: user._id,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Register function
exports.register = async (req, res) => {
  console.log('Registration request received:', req.body);
  const { id, name, section, year, password, role, adminKey } = req.body;

  try {
    if (!id || !name || !section || !year || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'admin' && adminKey !== process.env.ADMIN_KEY) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to register as admin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      id,
      name,
      section,
      year,
      password: hashedPassword,
      role: role || 'student',
    });

    await newUser.save();
    return res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
