const supertest = require("supertest");
const mongoose = require("mongoose");

const blogHelper = require("./helper-blogs");
const userHelper = require("./helper-users");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);


beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = blogHelper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});


describe("verify", () => {
    test("all blogs are returned", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveLength(blogHelper.initialBlogs.length);
    });

    test("the unique identifier of the blog posts is 'id'", async () => {
        // TODO: use api call to single ID (/api/blogs :id)
        // Instead of all (/api/blogs)
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body[0].id).toBeDefined();
    });
});


describe("creating a blog post", () => {
    let validToken;
    beforeAll(async () => {
        const loginResponse = await api
            .post("/api/login")
            .send(userHelper.validLoginCredentials);

        validToken = `Bearer ${loginResponse.body.token}`;
    });


    test("that is valid, returns 201 and the blog is stored", async () => {
        const newBlog = {
            title: "What Kind of Introvert Are You?",
            author: " Scott Barry Kaufman",
            url: "https://bit.ly/3x3VR1U",
            likes: 22
        };
        const response = await api
            .post("/api/blogs")
            .set("Authorization", validToken)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const updatedBlogs = await blogHelper.getAllInDB();
        expect(updatedBlogs).toHaveLength(blogHelper.initialBlogs.length + 1);

        const contents = updatedBlogs.map(blog => blog.content);
        expect(contents).toContain(response.body.content);
    });

    test("with missing 'likes' property, will default it to zero", async () => {
        const newBlog = {
            title: "What Kind of Introvert Are You?",
            author: " Scott Barry Kaufman",
            url: "https://bit.ly/3x3VR1U",
        };
        const response = await api
            .post("/api/blogs")
            .set("Authorization", await validToken)
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toBe(0);
    });

    test("without required properties, returns 400 status code",
        async () => {
            const newBlog = {
                author: " Scott Barry Kaufman",
                likes: 22
            };

            await api
                .post("/api/blogs")
                .set("Authorization", await validToken)
                .send(newBlog)
                .expect(400);
        });

    test("with a missing token, returns 401 status code",
        async () => {
            const newBlog = {
                title: "What Kind of Introvert Are You?",
                author: " Scott Barry Kaufman",
                url: "https://bit.ly/3x3VR1U",
                likes: 22
            };
            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(401);
        });
});


afterAll(() => {
    mongoose.connection.close();
});