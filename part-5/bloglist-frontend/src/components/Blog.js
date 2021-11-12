import React, { useState } from "react";


const Blog = ({ blog, user, handleLikes, handleDelete }) => {
    const [visibility, setVisibility] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5
    };

    return (
        <div className="blog" style={blogStyle}>
            {blog.title} - {blog.author}
            <button
                type="button"
                onClick={() => setVisibility(!visibility)}
            >
                {visibility ? "hide" : "view"}
            </button>
            <button
                style={{
                    display: (
                        blog.user && (blog.user.username === user.username)
                    ) ? "" : "none"
                }}
                type="button"
                onClick={() => handleDelete(blog.id, blog)}
            >
                delete
            </button>

            <div
                className="showDetails"
                style={{ display: visibility ? "" : "none" }}
            >
                <div>
                    {blog.url}
                </div>
                <div>
                    likes <span className="likes">{blog.likes}</span>
                    <button onClick={() => handleLikes(blog.id, blog)}>
                        like
                    </button>
                </div>
                <div>
                    {blog.user ? blog.user.name : ""}
                </div>
            </div>
        </div>
    );
};


export default Blog;