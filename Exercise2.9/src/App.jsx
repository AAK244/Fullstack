import React, { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: Math.random() 
      };
      setPersons([...persons, personObject]);
    }

    setNewName('');
    setNewNumber('');
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <h2>Add Person</h2>
      <form onSubmit={addPerson}>
        <div>
          Name: <input type="text" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Number: <input type="text" value={newNumber} onChange={handleNumberChange} />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person, index) => (
          <li key={index}>{`${person.name}: ${person.number}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
