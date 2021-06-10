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


// Delete a blog from the blog list
blogsRouter.delete("/:id", async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);

    response.status(204).end();
});


// Updating the properties of an individual blog post
blogsRouter.put("/:id", async (request, response) => {
    const body = request.body;

    const blog = {
        likes: body.likes
    };
    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true });

    response.json(updatedBlog);
});


module.exports = blogsRouter;