const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');

const {
  validateTask,
  validateTaskPatch,
} = require('../validators/taskValidator');

const authMiddleware = require('../middleware/auth.middleware');

const {handleValidationErrors} = require("../middleware/validationErrorHandler.middleware")

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', validateTask, handleValidationErrors, taskController.createTask);
router.put('/:id', validateTask, handleValidationErrors, taskController.updateTask);
router.patch('/:id', validateTaskPatch, handleValidationErrors, taskController.patchTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
