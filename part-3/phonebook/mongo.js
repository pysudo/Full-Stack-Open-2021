require("dotenv").config();
const mongoose = require("mongoose");


if (
    process.argv.length < 3
    || (process.argv.length > 3 && (process.argv.length !== 5))
) {
    console.log("Please provide the password as an argument.\n\nUsage:"
        + "\n\tnode mongo.js <password> \t\t\t\tdisplay all of the entries "
        + "in the phonebook."
        + "\n\tnode mongo.js <password> <name> <phone number> \t\tnew entry "
        + "to the phonebook will be saved."
    );
    process.exit(1);
}


let URL = `mongodb+srv://${process.env.mongo_username}:${process.argv[2]}`;
URL += "@cluster0.llzrs.mongodb.net/phonebook?retryWrites=true&w=majority";
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const createPerson = () => {
    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });
    const Person = mongoose.model("Person", personSchema);

    return Person;
};


const getPersons = () => {
    const Person = createPerson();

    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person);
        });
        mongoose.connection.close();
    });
};


const addPerson = (name, number) => {
    const Person = createPerson();
    const person = new Person({ name, number });

    person.save({}).then(result => {
        console.log(
            `added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
    });
};


if (process.argv.length === 3) {
    getPersons();
}
else {
    const name = process.argv[process.argv.length - 2];
    const number = process.argv[process.argv.length - 1];
    addPerson(name, number);
}