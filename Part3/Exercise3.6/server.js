const express = require('express');
const app = express();

app.use(express.json()); 

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

app.get('/info', (req, res) => {
  const date = new Date();
  const infoMessage = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
  `;
  res.send(infoMessage);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
      res.json(person);
  } else {
      res.status(404).send({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personIndex = persons.findIndex(p => p.id === id);
  if (personIndex !== -1) {
      persons = persons.filter(p => p.id !== id);
      res.status(204).end();
  } else {
      res.status(404).send({ error: 'Person not found' });
  }
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});