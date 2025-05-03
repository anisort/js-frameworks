const TaskModel = require('../models/task.model');

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const filter = req.query.filter?.trim().toLowerCase() || '';
    const status = req.query.status;
    const isAdmin = req.user.role === 'admin';
    console.log(req.user.role);
    const searchQuery = filter
      ? {
        $or: [
          { title: { $regex: filter, $options: 'i' } },
          { description: { $regex: filter, $options: 'i' } },
        ]
      }
      : {};
    const statusQuery = status ? { status } : {};
    const query = {...searchQuery, ...statusQuery, ...(isAdmin ? {} : { assignee: req.user.id })};
    const [tasks, total] = await Promise.all([
      TaskModel.find(query).populate('assignee', 'email role').skip(skip).limit(limit),
      TaskModel.countDocuments(query)
    ]);
    console.log({ tasks, total });
    res.json({ tasks, total });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", errors: error });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = new TaskModel({...req.body, assignee: req.user.id});
    await newTask.save();
    const populated = await newTask.populate('assignee', 'email role');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    res.status(400).json({ message: "Error creating task", errors: error });
  }
};

const updateTask = async (req, res) => {
  try {
    console.log(req.body);
    const updatedTask = await TaskModel.findOneAndReplace(
      { _id: req.params.id, assignee: req.user.id },
      {...req.body, assignee: req.user.id},
      { new: true, runValidators: true }
    ).populate('assignee', 'email role');
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    res.status(400).json({ message: "Error updating task", errors: error });
  }
};

const patchTask = async (req, res) => {
  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      { _id: req.params.id, assignee: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('assignee', 'email role');
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    res.status(400).json({ message: "Error partially updating task", errors: error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await TaskModel.findOneAndDelete({ _id: req.params.id, assignee: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or permission denied" });
    }
    const total = await TaskModel.countDocuments();
    res.json({ message: "Task deleted", total });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", errors: error });
  }
};

module.exports = { getTasks, createTask, updateTask, patchTask, deleteTask };
