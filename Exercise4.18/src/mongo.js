const mongoose = require('mongoose');

const mongoUrl = process.env.NODE_ENV === 'test' 
  ? 'mongodb+srv://username:password@aak.w8fonht.mongodb.net/testBlogList?retryWrites=true&w=majority'
  : 'mongodb+srv://username:password@aak.w8fonht.mongodb.net/Part4?retryWrites=true&w=majority';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

const disconnectFromDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

module.exports = { connectToDatabase, disconnectFromDatabase };
