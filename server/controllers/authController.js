const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail } = require('../services/emailService');
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await User.create({ firstName, lastName, email, password });
    await sendVerificationEmail(email, firstName, newUser.verificationToken);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Verification token missing' });
    }

    const user = await User.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    await User.verifyUser(user.id);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(401).json({ error: 'Please verify your email before logging in' });
    }

    const validPassword = await User.comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Account already verified. Please log in.' });
    }

    // Generate a new verification token
    const newToken = uuidv4();

    // Update user with new token
    await db.collection('users').doc(user.id).update({
      verificationToken: newToken,
    });

    // Send verification email
    await sendVerificationEmail(email, user.firstName, newToken);

    res.json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;
    
    // Check if email is already taken by another user
    if (email) {
      const existing = await db.collection('users')
        .where('email', '==', email)
        .where(admin.firestore.FieldPath.documentId(), '!=', userId)
        .get();
      if (!existing.empty) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;

    await db.collection('users').doc(userId).update(updateData);
    
    // Get updated user
    const updatedDoc = await db.collection('users').doc(userId).get();
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() };
    delete updatedUser.password;
    delete updatedUser.verificationToken;

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    const valid = await bcrypt.compare(currentPassword, userData.password);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(userId).update({ password: hashed });
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  resendVerification,
  updateProfile,
  changePassword,
};