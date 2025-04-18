const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema(
  {
    adminID: { type: String, required: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);
const validAdminIDSchema = new mongoose.Schema({
  adminID: { type: String, required: true, unique: true },
});

const ValidAdminID = mongoose.model('ValidAdminID', validAdminIDSchema);

module.exports = {
  Admin,
  ValidAdminID,
};
