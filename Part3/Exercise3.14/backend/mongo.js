const mongoose = require('mongoose');

const url = `mongodb+srv://username:password@aak.w8fonht.mongodb.net/phonebook?retryWrites=true&w=majority&appName=AAK`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
