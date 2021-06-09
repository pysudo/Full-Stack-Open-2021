const blogsRouter = require("express").Router();
const Blog = require("../models/blog");


// GET all information about the blogs in the blog list
blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});


// Add a blog to the blog list
blogsRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body);
    const newBlog = await blog.save();

    response.status(201).json(newBlog);
});


module.exports = blogsRouter;