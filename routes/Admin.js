const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Trip = require('../models/Trip'); 
// // Import controller functions
const {
    register,
    login,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    getGroup1Users,
    getGroup2Users,
    getGroup3Users
} = require('../controllers/authcontrollers');

// Middleware for authentication and admin routes
const auth = require('../middleware/authmiddleware');
const adminAuth = require('../middleware/adminauthmidele');
const verifyToken = require('./auth');  // Assuming your middleware file is auth.js

router.get('/users', verifyToken, async (req, res) => {
  // Only authenticated users can access this route
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Protected routes (requires authentication)
router.get('/users', auth, getAllUsers);  // Fetch all users (authenticated users only)
router.get('/users/:id', auth, getUserById); // Fetch user by ID



// Admin-only routes
router.delete('/users/:id', auth, adminAuth, deleteUser);  // Delete user (admin only)
router.post('/users/:id/role', auth, adminAuth, updateUserRole); // Update user role (admin only)
// Fetch all users for Admin
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // routes/admin.js
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
 
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete user with id: ${id}`); // Add this line
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});
// Add this route to handle disabling a user
router.put('/users/:userId/disable', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Implement the logic to disable the user (e.g., setting `active: false`)
    const user = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: 'Error disabling user' });
  }
});



module.exports = router;
