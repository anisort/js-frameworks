const TaskStatus = require("../constans/taskStatus");

const tasks = [
  {
    id: 1,
    title: 'Complete lab6',
    assignee: 'Valerria',
    dueDate: new Date('2025-02-14'),
    status: TaskStatus.DONE
  }
];

module.exports = { tasks };
