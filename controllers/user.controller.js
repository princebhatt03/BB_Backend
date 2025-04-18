const User = require('../models/user.model');

// User Registration
const userRegister = async (req, res) => {
  try {
    const { fullName, email, mobile, bloodGroup, agreeTerms, donateBlood } =
      req.body;

    if (
      !fullName ||
      !email ||
      !mobile ||
      !bloodGroup ||
      typeof agreeTerms === 'undefined' ||
      typeof donateBlood === 'undefined'
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already registered with this email or mobile number.',
      });
    }

    const newUser = new User({
      fullName,
      email,
      mobile,
      bloodGroup,
      agreeTerms,
      donateBlood,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully! We will contact you soon.',
      user: newUser,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Exporting functions
module.exports = {
  userRegister,
  getAllUsers,
  deleteUser,
};
