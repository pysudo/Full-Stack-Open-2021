const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

const User = require("../models/user");


// Get all users
usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", { user: 0 });

    response.json(users);
});


// Create a new user
usersRouter.post("/", async (request, response) => {
    if (!request.body.password || request.body.password.length < 3) {
        const customValidationError = new Error(
            "Password is required and must be 3 characters long"
        );
        customValidationError.name = "ValidationError";
        throw customValidationError;
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

    const user = {
        name: request.body.name,
        username: request.body.username,
        password: hashedPassword
    };

    const newUser = new User(user);
    await newUser.save();

    response.json(newUser);
});


module.exports = usersRouter;