const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express();

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

persons = [{
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
},
{
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
},
{
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
},
{
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
}
]

// General info
app.get('/info', (request, response) => {

    return response.send(`<p>Phonebook has info for 4 people</p>
    <p>${new Date()}</p>
    `);
});


// GET list of phonebook entries 
app.get('/api/persons', (request, response) => {

    return response.json(persons);
});


// GET single phonebook entry 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).end();
    }

    return response.json(person);
});


// DELETE single phonebook entry 
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find(person => person.id === id) // Check if exists
    if (!person) {
        return response.status(404).end();
    }

    persons = persons.filter(person => person.id !== id)

    return response.status(204).end();
});


// POST(append) single entry to the phonebook list
app.post('/api/persons', (request, response) => {

    const { name, number } = request.body;
    if (!name) {
        return response.status(400).json({
            error: "name is missing"
        });
    }
    if (!number) {
        return response.status(400).json({
            error: "number is missing"
        });
    }

    const person = persons.find(person => person.name === name)
    if (person) {
        return response.status(409).json({
            error: "name must be unique"
        });
    }

    const newPerson = {
        name,
        number,
        id: Math.floor(Math.random() * 1000000)
    };
    persons = persons.concat(newPerson);

    return response.json(newPerson);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {

    console.log(`Listening to server at port ${PORT}`);
})
