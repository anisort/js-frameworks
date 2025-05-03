const mongoose = require('mongoose');
const TaskStatus = require("../constans/taskStatus");

const TaskSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, trim: true, default: '' },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO},
}, {timestamps: true});

const TaskModel = mongoose.model("Task", TaskSchema);
module.exports = TaskModel;
