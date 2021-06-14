const blogsRouter = require("express").Router();

const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");


// GET all information about the blogs in the blog list
blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { blogs: 0 });
    response.json(blogs);
});


// Add a blog to the blog list
blogsRouter.post("/", userExtractor, async (request, response) => {
    const newBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: request.user._id
    };
    const blog = new Blog(newBlog);
    const savedBlog = await blog.save();

    request.user.blogs = request.user.blogs.concat(savedBlog._id);
    await request.user.save();

    response.status(201).json(newBlog);
});


// Delete a blog from the blog list
blogsRouter.delete("/:id", userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() !== request.user._id.toString()) {
        return response.status(403).end();
    }

    await Blog.findByIdAndDelete(blog._id);

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