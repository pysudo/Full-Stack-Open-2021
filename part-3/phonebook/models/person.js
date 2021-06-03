const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const URL = process.env.MONGO_URI;
console.log("connecting to", URL);
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(result => {
        console.log("connected to MongoDB");
    })
    .catch(error => {
        console.log("error connecting to MongoDB", error.message);
    })


// Custom mongoose validator
function checkDigits(number) {
    const numberLength = number.replace(/\D/g, '').length;
    return numberLength > 7;
}
const numberLength = [checkDigits, 'phone number must have at least 8 digits.']
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'name must be atleast 3 characters long.'],
        unique: [true, 'name should be unique.'],
        required: [true, 'name is required.']
    },
    number: {
        type: String,
        validate: numberLength, // phone number must have at least 8 digits
        required: [true, 'number is required.']
    }
});
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
personSchema.plugin(uniqueValidator);
const Person = mongoose.model('Person', personSchema);


module.exports = Person;