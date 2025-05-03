const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

const {
  validateAuthLogAndReg,
  validateAuthReqPassReset,
  validateAuthPassReset
} = require('../validators/auth.validator');

const { handleValidationErrors } = require('../middleware/validationErrorHandler.middleware');

router.post('/register', validateAuthLogAndReg, handleValidationErrors, authController.register);
router.post('/confirm/:token', authController.confirmEmail);
router.post('/login', validateAuthLogAndReg, handleValidationErrors, authController.login);
router.post('/reset', validateAuthReqPassReset, handleValidationErrors, authController.requestPasswordReset);
router.post('/reset-password/:token', validateAuthPassReset, handleValidationErrors, authController.resetPassword);

module.exports = router;
