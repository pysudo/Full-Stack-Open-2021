import React, { useState, useEffect } from "react";
import "./index.css";

import Blog from "./components/Blog";
import { LoginForm, BlogForm } from "./components/Form";
import blogService from "./services/blogs";


const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({});

    const handleLogout = () => {
        window.localStorage.clear();
        setUser(null);
        setNotification({
            message: "successfully logged out",
            status: "success"
        });
        setTimeout(() => setNotification({}), 5000);
    };

    const handleLikes = async (id, blog) => {
        const currentBlogs = blogs.slice();

        let updatedBlog = await blogService.update({ likes: blog.likes + 1 }, id);
        const index = blogs.findIndex((blog) => blog.id === updatedBlog.id);
        updatedBlog = { ...updatedBlog, user: currentBlogs[index].user };
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


    const handleDelete = async (id, blog) => {
        if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
            await blogService.remove(id);
            const currentBlogs = blogs.filter((blog) => blog.id !== id);

            setBlogs(currentBlogs);
        }
    };

    const createBlog = async (title, author, url) => {
        await blogService.create({
            title,
            author,
            url
        });
    };

    useEffect(() => {
        blogService.getAll().then(blogs => {
            blogs = blogs.sort((a, b) => b.likes - a.likes);
            return setBlogs(blogs);
        }
        );
    }, []);

    useEffect(() => {
        const userJSONDetails = window.localStorage.getItem("blogAppUserDetails");
        if (userJSONDetails) {
            const newUser = JSON.parse(userJSONDetails);
            setUser(newUser);
            blogService.setToken(newUser.token);
        }
    }, []);


    if (user === null) {
        return <LoginForm
            setUser={setUser}
            notification={notification}
            setNotification={setNotification}
        />;
    }
    return (
        <div>
            <h2>blogs</h2>

            <div className={notification.status}>
                <p>{notification.message}</p>
            </div>

            <div>
                <p>
                    {user.name} logged in
                    <button type="button" onClick={handleLogout}>
                        logout
                    </button>
                </p>
            </div>

            <h2>create new</h2>
            <BlogForm
                setBlogs={setBlogs}
                setNotification={setNotification}
                createBlog={createBlog}
            />

            {blogs.map(blog =>
                <Blog key={blog.id}
                    blog={blog}
                    user={user}
                    handleLikes={handleLikes}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    );
};


export default App;