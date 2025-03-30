const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const taskMockRoutes = require('./routes/taskMockRoutes');
const taskRoutes = require('./routes/task.route');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/tasks', taskMockRoutes);
app.use('/api/v2/tasks', taskRoutes);

module.exports = app;
