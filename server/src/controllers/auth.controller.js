const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('../services/email.service');

const JWT_CONFIRM_SECRET = process.env.JWT_CONFIRM_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({ email, password: passwordHash });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_CONFIRM_SECRET, { expiresIn: '1d' });

    await sendConfirmationEmail(email, token);

    res.status(201).json({ message: 'Successfully registration. Please check your email for verify your account.' });
  } catch (error) {
    res.status(500).send({ message: 'Registration error.', errors: error });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decode = jwt.verify(token, JWT_CONFIRM_SECRET);

    const user = await UserModel.findById(decode.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isConfirmed) return res.status(400).json({ message: 'User already confirmed' });

    user.isConfirmed = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isConfirmed) return res.status(400).json({ message: 'Verify your email.' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isConfirmed: user.isConfirmed,
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Login error', errors: error });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, JWT_RESET_SECRET, { expiresIn: '30m' });

    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: 'Instruction sent to email' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while requesting password recovery.', errors: error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: 'Password is required' });
    const decoded = jwt.verify(token, JWT_RESET_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { register, confirmEmail, login, requestPasswordReset, resetPassword };
