require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');


const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan(function (tokens, request, response) {
    const logData = [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
    ];

    // For POST requests, include the request body
    if (request.method === "POST") {
        return logData.concat(tokens.body(request, response)).join(' ');
    }

    return logData.join(' ');
}));


// General info
app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            let infoMessage = `<p>Phonebook has info for ${persons.length} `;
            infoMessage += `people</p><p>${new Date()}</p>`;
            response.send(infoMessage);
        });
});


// GET list of phonebook entries 
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
});


// GET single phonebook entry 
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            }
            else {
                response.status(404).end();
            }
        })
        .catch(next);
});


// DELETE single phonebook entry 
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            // Check if the person to be deleted exists in the database
            if (deletedPerson) {
                return response.status(204).end();
            }

            // Handle delete attempts of non-exisiting well-formed person id
            response.status(404).send({
                error: "The contact does not exist or has already been removed."
            });
        })
        .catch(next);
});


// POST(append) single entry to the phonebook list
app.post('/api/persons', (request, response, next) => {
    if (!request.body.name) {
        return response.status(400).json({
            error: "name is missing"
        });
    }
    if (!request.body.number) {
        return response.status(400).json({
            error: "number is missing"
        });
    }

    const person = new Person(request.body);
    person.save({})
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(next);
});


// Updates the name or number or both of an already existing contact
app.put('/api/persons/:id', (request, response, next) => {
    if (!request.body.number) {
        return response.status(400).json({
            error: "number is missing"
        });
    }

    Person.findByIdAndUpdate(request.params.id, request.body, { new: true })
        .then(updateNote => {
            response.json(updateNote);
        })
        .catch(next);
});


// Requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);


// Error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    // Handle bad formatted person id
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }

    next(error);
};
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log(`Listening to server at port ${PORT}`);
});
