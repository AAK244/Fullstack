import React, { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson && existingPerson.number !== newNumber) {
      alert(`${newName} is already added to phonebook with another number!`);
    } else if (existingPerson) {
      const personIndex = persons.findIndex(p => p.name === newName);
      const updatedPerson = { ...persons[personIndex], number: newNumber };
      const updatedPersons = [...persons];
      updatedPersons[personIndex] = updatedPerson;
      setPersons(updatedPersons);
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };
      setPersons([...persons, personObject]);
    }

    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, index) => (
          <li key={index}>{`${person.name}: ${person.number}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
