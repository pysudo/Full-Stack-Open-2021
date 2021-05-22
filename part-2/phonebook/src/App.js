import React, { useState, useEffect } from 'react';

import phoneBookService from './services/phonebook';


const Filter = ({ onChangeHandler, value }) => {

  return (
    <div>
      <label>
        filter shown with<input onChange={onChangeHandler} value={value} />
      </label>
    </div>
  );
};


const PersonForm = ({ onChangeHandlers, values, onClickHandler }) => {
  const { handleNameChange, handleNumberChange } = onChangeHandlers;
  const { newName, newNumber } = values;

  return (
    <form>
      <div>
        <label>
          name: <input onChange={handleNameChange} value={newName} />
        </label>
        <br />
        <label>
          number: <input onChange={handleNumberChange} value={newNumber} />
        </label>
      </div>
      <div>
        <button type="submit" onClick={onClickHandler}>add</button>
      </div>
    </form>
  );
};


const Persons = ({ persons, filter, deleteContactHandler }) => {
  const personsToDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    personsToDisplay.map(person =>
      <Person key={person.name}
        person={person}
        deleteContactHandler={deleteContactHandler}
      />
    ))
};


const Person = ({ person, deleteContactHandler }) => {
  
  return (
    <div>
      {person.name} {person.number}
      &nbsp;
      <button onClick={() => deleteContactHandler(person.id, person.name)}>
        delete
      </button>
    </div>
  )
};


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const handlerFilterReset = () => { setNewName(""); setNewNumber(""); };
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setNewFilter(event.target.value);

  // Add contact
  const addContactHandler = (event) => {
    event.preventDefault();
    const newObject = {
      name: newName.trim(),
      number: newNumber.trim()
    };

    // Check if contact detail already exists
    const personNames = persons.map(person => person.name.toLowerCase());
    if (personNames.includes(newName.trim().toLowerCase())) {
      // If exists, update the number
      let confirmationMessage = "is already added to phonebook, replace";
      confirmationMessage += " the old number with a new one?";

      if (window.confirm(`${newName.trim()} ${confirmationMessage}`)) {
        updateContactHandler(newObject);
        handlerFilterReset();
      }
      return; // Skip adding the same contact detail
    }

    phoneBookService.create(newObject)
      .then(newContactDetail => {
        setPersons(persons.concat(newContactDetail));
        handlerFilterReset();
      })
  };

  // Modify contact
  const updateContactHandler = (newObject) => {
    const contactDetail = persons.find(person => {
      return person.name.toLowerCase() === newName.trim().toLowerCase()
    })

    phoneBookService.update(contactDetail.id, newObject)
      .then(updatedContactDetail =>
        setPersons(persons.map(person =>
          person.id !== updatedContactDetail.id
            ? person
            : updatedContactDetail
        ))
      );
  }

  // Remove contact
  const deleteContactHandler = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    return phoneBookService.remove(id, name)
      .then(() =>
        setPersons(persons.filter(person => person.id !== id))
      );
  };

  // Effect hook
  const effectHook = () => phoneBookService.getAll()
    .then(contactDetails => setPersons(contactDetails));
  useEffect(effectHook, []);


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChangeHandler={handleFilterChange} value={newFilter} />

      <h2>add a new</h2>

      <PersonForm
        onChangeHandlers={{ handleNameChange, handleNumberChange }}
        values={{ newName, newNumber }}
        onClickHandler={addContactHandler}
      />

      <h2>Numbers</h2>

      <Persons
        persons={persons}
        filter={newFilter}
        deleteContactHandler={deleteContactHandler}
      />
    </div>
  )
};

export default App;