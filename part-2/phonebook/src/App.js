import React, { useState, useEffect } from 'react';

import { PersonForm, Persons } from './components/Person';
import Notification from './components/Utils';
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

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const handlerFilterReset = () => { setNewName(""); setNewNumber(""); };
  const hideAlertMessageHandler = () =>
    setTimeout(() => setAlertMessage(null), 5000);
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

      if (window.confirm(`'${newName.trim()}' ${confirmationMessage}`)) {
        updateContactHandler(newObject);
        handlerFilterReset();
      }
      return; // Skip adding the same contact detail
    }

    phoneBookService.create(newObject)
      .then(newContactDetail => {
        setPersons(persons.concat(newContactDetail));
        handlerFilterReset();
        setAlertMessage({
          message: `Added ${newContactDetail.name}`,
          success: true
        });
        hideAlertMessageHandler();
      })
      .catch(error => {
        setAlertMessage({ message: error.response.data.error, success: false });
        handlerFilterReset();
        hideAlertMessageHandler();
      });
  };

  // Modify contact
  const updateContactHandler = (newObject) => {
    const contactDetail = persons.find(person => {
      return person.name.toLowerCase() === newName.trim().toLowerCase()
    })

    phoneBookService.update(contactDetail.id, newObject)
      .then(updatedContactDetail => {
        let updateMessage = `Updated ${newObject.name}`;
        updateMessage += ` with phone number ${newObject.number}`;
        setAlertMessage({ message: updateMessage, success: true });
        hideAlertMessageHandler();

        setPersons(persons.map(person =>
          person.id !== updatedContactDetail.id
            ? person
            : updatedContactDetail
        ))
      })
      .catch(error => {
        if (error.response.status === 404) {
          // When a resource doesn't exist, update the current state
          setPersons(persons.filter(person =>
            person.id !== contactDetail.id
          ))
        }
        setAlertMessage({ message: error.response.data.error, success: false });
        hideAlertMessageHandler();
      });
  }

  // Remove contact
  const deleteContactHandler = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return null;
    }

    setPersons(persons.filter(person => person.id !== id));
    return phoneBookService.remove(id, name)
      .then(() => {
        setAlertMessage({ message: `Deleted ${name}`, success: true });
        hideAlertMessageHandler();
      })
      .catch(error => {
        setAlertMessage({ message: error.response.data.error, success: false });
        hideAlertMessageHandler();
      });
  };

  // Effect hook
  const effectHook = () => phoneBookService.getAll()
    .then(contactDetails => setPersons(contactDetails));
  useEffect(effectHook, []);


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={alertMessage ? alertMessage.message : null}
        success={alertMessage ? alertMessage.success : null}
      />

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