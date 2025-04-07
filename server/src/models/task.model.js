const mongoose = require('mongoose');
const TaskStatus = require("../constans/taskStatus");

const TaskSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, trim: true, default: '' },
  assignee: { type: String, required: true, minlength: 3, },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO},
}, {timestamps: true});

// TaskSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     ret.id = ret._id.toString();
//     delete ret._id;
//
//     if(ret.dueDate) {
//       ret.dueDate = ret.dueDate.toISOString().split('T')[0];
//     }
//     return ret;
//   }
// });

const TaskModel = mongoose.model("Task", TaskSchema);
module.exports = TaskModel;
