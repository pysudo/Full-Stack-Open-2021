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
        <div style={blogStyle}>
            {blog.title} {blog.author}
            <button
                type="button"
                onClick={() => setVisibility(!visibility)}
            >
                {visibility ? "hide" : "view"}
            </button>
            <div
                className="showDetails"
                style={{ display: visibility ? "" : "none" }}
            >
                <div>
                    {blog.url}
                </div>
                <div>
                    likes {blog.likes}
                    <button onClick={() => handleLikes(blog.id, blog)}>
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
                        onClick={() => handleDelete(blog.id, blog)}
                    >
                        delete
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Blog;