const { validationResult } = require('express-validator');

// 🔹 Функція для перевірки помилок `express-validator`
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const valErrors = Object.values(errors.errors).map((err) => err.msg);
    return res.status(400).json({ message: "Validation error", errors: valErrors });
  }
  next();
};

module.exports = { handleValidationErrors };
