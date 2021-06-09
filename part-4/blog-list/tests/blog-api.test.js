const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test-helper");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);


beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});


test("returns all blogs", async () => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("verifies unique identifier of the blog posts is 'id'", async () => {
    // TODO: use api call to single ID (/api/blogs :id)
    // Instead of all (/api/blogs)
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body[0].id).toBeDefined();
});

test("creates a new blog post", async () => {
    const newBlog = {
        title: "What Kind of Introvert Are You?",
        author: " Scott Barry Kaufman",
        url: "https://bit.ly/3x3VR1U",
        likes: 22
    };
    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const updatedBlogs = await helper.getAllInDB();
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1);

    const contents = updatedBlogs.map(blog => blog.content);
    expect(contents).toContain(response.body.content);
});

test("incase missing 'likes' property, will default to zero", async () => {
    const newBlog = {
        title: "What Kind of Introvert Are You?",
        author: " Scott Barry Kaufman",
        url: "https://bit.ly/3x3VR1U",
    };
    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
});

test("bad POST request without required properties, returns 400 status code",
    async () => {
        const newBlog = {
            author: " Scott Barry Kaufman",
            likes: 22
        };
        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(400);
    });



afterAll(() => {
    mongoose.connection.close();
});