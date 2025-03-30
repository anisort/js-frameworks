require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI){
  console.log('Missing MONGO_URI in .env file')
  process.exit(1)
}

const connectDB = async () => {
  try {
    await  mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    // console.log('MongoDB connection error', error.message);
    // console.log('Retry in 5 seconds');
    // setTimeout(connectDB, 5000);
  }
}


mongoose.connection.on('connected', () => console.log('Mongoose connected'));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ', err.message);
  console.log(' Retry in 5 seconds...');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose is down... Retrying');
  setTimeout(connectDB, 5000)
});

mongoose.connection.on('reconnected', () => console.log('Mongoose successfully reconnected'))

const gracefulExit = async (signal) => {
  console.log('MONGO_URI:', process.env.MONGO_URI);
  console.log(`Signal received ${signal}. Finishing work...`)
  try {
    await mongoose.connection.close(false);
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Shutdown error: ', error);
  }
};

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

module.exports = connectDB;
