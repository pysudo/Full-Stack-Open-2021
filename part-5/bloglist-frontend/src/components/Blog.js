import React, { useState } from 'react'

import blogService from "../services/blogs";


const Blog = ({ blog, blogs, setBlogs, user }) => {
  const [visibility, setVisibility] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = async (id) => {
    const currentBlogs = blogs.slice();

    let updatedBlog = await blogService.update({ likes: blog.likes + 1 }, id);
    const index = blogs.findIndex((blog) => blog.id === updatedBlog.id);
    updatedBlog = { ...updatedBlog, user: currentBlogs[index].user }
    currentBlogs[index] = updatedBlog;

    if (
      index !== 0
      && currentBlogs[index].likes > currentBlogs[index - 1].likes
    ) {
      const temp = currentBlogs[index];
      currentBlogs[index] = currentBlogs[index - 1];
      currentBlogs[index - 1] = temp;
    }

    setBlogs(currentBlogs);
  };


  const handleDelete = async (id) => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      await blogService.remove(id);
      const currentBlogs = blogs.filter((blog) => blog.id !== id)

      setBlogs(currentBlogs);
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button
        type="button"
        onClick={() => setVisibility(!visibility)}
      >
        {visibility ? "hide" : "view"}
      </button>
      <div style={{ display: visibility ? "" : "none" }}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLikes(blog.id)}>
            like
          </button>
        </div>
        <div>
          {blog.user ? blog.user.name : ""}
        </div>
        <div
          style={{
            display: (blog.user && (blog.user.username === user.username))
              ? ""
              : "none"
          }}
        >
          <button
            type="button"
            onClick={() => handleDelete(blog.id)}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  )
}


export default Blog