import React, { useState } from 'react';

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

const Persons = ({ persons, filter }) => {
  const personsToDisplay = persons.filter((person) => {

    return person.name.toLowerCase().includes(filter.toLowerCase());
  })

  return (
    personsToDisplay.map(person => <Person key={person.name} person={person} />)
  )
};

const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setNewFilter(event.target.value);

  const addContact = (event) => {
    event.preventDefault();

    const personsToDisplay = persons.map(person => person.name);
    if (personsToDisplay.includes(newName.trim())) {
      return alert(`${newName.trim()} is already added to phonebook`);
    }

    const newObject = {
      name: newName.trim(),
      number: newNumber.trim()
    };

    setPersons(persons.concat(newObject));
    setNewName("");
    setNewNumber("");
  };


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChangeHandler={handleFilterChange} value={newFilter} />

      <h2>add a new</h2>

      <PersonForm
        onChangeHandlers={{ handleNameChange, handleNumberChange }}
        values={{ newName, newNumber }}
        onClickHandler={addContact}
      />

      <h2>Numbers</h2>

      <Persons persons={persons} filter={newFilter} />
    </div>
  )
};

export default App;