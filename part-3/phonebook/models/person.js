const mongoose = require('mongoose');

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


const personSchema = new mongoose.Schema({
    name: String,
    number: String
});
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
const Person = mongoose.model('Person', personSchema);


module.exports = Person;