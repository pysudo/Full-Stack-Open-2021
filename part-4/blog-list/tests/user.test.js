const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./helper-users");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);


beforeEach(async () => {
    await User.deleteMany({});

    const userObjects = helper.initialUsers.map(user => new User(user));
    const promiseArray = userObjects.map(user => user.save());
    await Promise.all(promiseArray);
});


describe("username must be", () => {
    test("provided", async () => {
        const usersAtStart = await helper.getAllInDB();

        const newUser = {
            name: "John Doe",
            password: "qwerty"
        };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.getAllInDB();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

        expect(response.body.error).toBe(
            "User validation failed: username: Path `username` is required."
        );
    });

    test("atleast 3 characters long", async () => {
        const usersAtStart = await helper.getAllInDB();

        const newUser = {
            name: "Mr A",
            username: "a",
            password: "qwerty"
        };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.getAllInDB();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

        expect(response.body.error).toBe(
            "User validation failed: username: Path `username` " +
            `(\`${newUser.username}\`) is shorter than the minimum allowed ` +
            "length (3)."
        );
    });

    test("unique with no duplicate entires", async () => {
        const usersAtStart = await helper.getAllInDB();

        const newUser = {
            name: "D.K",
            username: "driftking", // Existing username
            password: "qwerty"
        };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.getAllInDB();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

        expect(response.body.error).toBe(
            "User validation failed: username: Error, expected `username` " +
            `to be unique. Value: \`${newUser.username}\``
        );
    });

});


describe("password must be", () => {
    test("provided", async () => {
        const usersAtStart = await helper.getAllInDB();

        const newUser = {
            name: "John Doe",
            username: "johndoe"
        };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.getAllInDB();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

        expect(response.body.error).toBe(
            "Password is required and must be 3 characters long"
        );
    });

    test("atleast 3 characters long", async () => {
        const usersAtStart = await helper.getAllInDB();

        const newUser = {
            name: "John Doe",
            username: "johndoe",
            password: "a"
        };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.getAllInDB();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);

        expect(response.body.error).toBe(
            "Password is required and must be 3 characters long"
        );
    });
});


afterAll(() => {
    mongoose.connection.close();
});