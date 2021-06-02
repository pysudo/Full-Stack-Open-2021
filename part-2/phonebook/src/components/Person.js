import React from 'react';


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
            <Person key={person.id}
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


export {PersonForm, Persons};