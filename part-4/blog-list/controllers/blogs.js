const blogsRouter = require("express").Router();
const Blog = require("../models/blog");


// GET all information about the blogs in the blog list
blogsRouter.get("/", (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs);
        });
});


// Add a blog to the blog list
blogsRouter.post("/", (request, response) => {
    const blog = new Blog(request.body);

    blog
        .save()
        .then(result => {
            response.status(201).json(result);
        });
});


module.exports = blogsRouter;