const { check } = require('express-validator');

const ALLOWED_FIELDS = ['email', 'password'];

const validateAuthLogAndReg = [
  check('email', 'Email is required').trim().notEmpty().isEmail().withMessage('Неправильний email'),
  check('password', 'Password is required').notEmpty().isLength({ min: 8 }).withMessage('Password must contain at least 8 characters'),
  (req, res, next) => {
    const extraFields = Object.keys(req.body).filter(field => !ALLOWED_FIELDS.includes(field));
    if (extraFields.length) {
      return res.status(400).json({ error: `Extra fields: ${extraFields.join(', ')}` });
    }
    next();
  },
];

const validateAuthReqPassReset = [
  check('email', 'Email is required').trim().notEmpty().isEmail().withMessage('Wrong email'),
  (req, res, next) => {
    const extraFields = Object.keys(req.body).filter(field => !ALLOWED_FIELDS.includes(field));
    if (extraFields.length) {
      return res.status(400).json({ error: `Extra fields: ${extraFields.join(', ')}` });
    }
    next();
  },
];

const validateAuthPassReset = [
  check('password', 'Password is required').notEmpty().isLength({ min: 8 }).withMessage('Password must contain at least 8 characters'),
  (req, res, next) => {
    const extraFields = Object.keys(req.body).filter(field => !ALLOWED_FIELDS.includes(field));
    if (extraFields.length) {
      return res.status(400).json({ error: `Extra fields: ${extraFields.join(', ')}` });
    }
    next();
  },
];

module.exports = { validateAuthLogAndReg, validateAuthReqPassReset, validateAuthPassReset };
