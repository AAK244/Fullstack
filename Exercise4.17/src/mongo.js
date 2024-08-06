const mongoose = require('mongoose');

const mongoUrl = process.env.NODE_ENV === 'test'
  ? 'mongodb+srv://username:password@aak.w8fonht.mongodb.net/testBlogList?retryWrites=true&w=majority'
  : 'mongodb+srv://username:password@aak.w8fonht.mongodb.net/Part4?retryWrites=true&w=majority';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

const disconnectFromDatabase = async () => {
  await mongoose.connection.close();
  console.log('Disconnected from MongoDB');
};

module.exports = { connectToDatabase, disconnectFromDatabase, mongoose };
