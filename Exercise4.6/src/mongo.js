const mongoose = require('mongoose');

const mongoUrl = 'mongodb+srv://username:password@aak.w8fonht.mongodb.net/Part4?retryWrites=true&w=majority';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

module.exports = mongoose;
