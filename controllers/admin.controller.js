const bcrypt = require('bcrypt');
const { Admin, ValidAdminID } = require('../models/admin.model');

const adminController = {
  // Admin Registration
  async adminRegister(req, res) {
    try {
      const { adminID, fullName, username, email, mobile, password } = req.body;
      if (
        !adminID ||
        !fullName ||
        !username ||
        !email ||
        !mobile ||
        !password
      ) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      // Check if the provided adminID is valid (exists in the valid list)
      const isValidAdminID = await ValidAdminID.findOne({ adminID });

      if (!isValidAdminID) {
        return res
          .status(400)
          .json({ error: 'Invalid Admin ID. Contact the Bank.' });
      }

      // Check if admin already exists by username or email
      const existingAdmin = await Admin.findOne({
        $or: [{ username }, { email }],
      });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new admin
      const newAdmin = new Admin({
        adminID,
        fullName,
        username,
        email,
        mobile,
        password: hashedPassword,
      });

      await newAdmin.save();

      return res.status(201).json({
        message: 'Admin registered successfully!',
        redirect: '/adminHome',
      });
    } catch (error) {
      console.error('Admin Registration Error:', error);
      return res
        .status(500)
        .json({ error: 'Something went wrong, please try again.' });
    }
  },

  // Admin Login
  async adminLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: 'Username and password are required.' });
      }

      const admin = await Admin.findOne({ username });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      req.session.admin = {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
      };

      await req.session.save(); // Ensures session persists

      return res.status(200).json({
        message: 'Login successful!',
        admin: req.session.admin,
      });
    } catch (error) {
      console.error('Admin Login Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get Admin Details
  async getAdminDetails(req, res) {
    try {
      if (!req.session.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const admin = await Admin.findById(req.session.admin.id).select(
        'fullName username'
      );

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      return res.json({ adminName: admin.fullName });
    } catch (error) {
      console.error('Error fetching admin details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Admin Logout
  async adminLogout(req, res) {
    try {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed' });
        }
        return res.status(200).json({ message: 'Logout successful' });
      });
    } catch (error) {
      console.error('Logout Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = adminController;
