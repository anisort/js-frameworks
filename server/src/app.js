const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const taskMockRoutes = require('./routes/taskMockRoutes');
const taskRoutes = require('./routes/task.route');
const authRoutes = require('./routes/auth.routes');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/tasks', taskMockRoutes);
app.use('/api/v2/tasks', taskRoutes);
app.use('/api/v2/auth', authRoutes);

module.exports = app;
