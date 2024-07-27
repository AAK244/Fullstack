require('dotenv').config();
const mongoose = require('mongoose');

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const clusterUrl = process.env.MONGODB_CLUSTER;
const dbname = process.env.MONGODB_DBNAME;

const url = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbname}?retryWrites=true&w=majority&appName=AAK`;

mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const validatePhoneNumber = (number) => {
  const regex = /^\d{2,3}-\d{5,}$/;
  return regex.test(number);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: validatePhoneNumber,
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
