const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  const nameExists = persons.some(p => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const id = Math.floor(Math.random() * 1000000);

  const person = {
    id: id.toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const buildPath = path.join(__dirname, 'build');
fs.access(buildPath, fs.constants.F_OK, (err) => {
  console.log(`${buildPath} ${err ? 'does not exist' : 'exists'}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
