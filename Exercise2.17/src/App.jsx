import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${returnedPerson.name}'s number`, type: 'success' })
            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
          })
          .catch(error => {
            setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' })
            setTimeout(() => {
              setNotification({ message: null, type: '' })
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({ message: `Deleted ${name}`, type: 'success' })
          setTimeout(() => {
            setNotification({ message: null, type: '' })
          }, 5000)
        })
    }
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
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
        {personsToShow.map((person, index) => (
          <li key={index}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
