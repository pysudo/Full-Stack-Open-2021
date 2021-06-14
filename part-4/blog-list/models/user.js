const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
    name: String,
    username: { type: String, minLength: 3, unique: true, required: true },
    password: { type: String, required: true },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }]
});
userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (documents, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    }
});


module.exports = mongoose.model("User", userSchema);