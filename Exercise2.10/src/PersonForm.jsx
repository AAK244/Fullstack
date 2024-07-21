import React from 'react';

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber
}) => {
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

  return (
    <form onSubmit={addPerson}>
      <div>
        Name: <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        Number: <input type="text" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <button type="submit">Add</button>
    </form>
  );
};

export default PersonForm;
