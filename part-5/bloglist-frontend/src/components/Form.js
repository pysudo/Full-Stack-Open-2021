import React, { useState, useRef } from "react";

import Toggleable from "./Toggleable";
import loginService from "../services/login";
import blogService from "../services/blogs";


const LoginForm = ({ setUser, notification, setNotification }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login(
                { username, password }
            );
            window.localStorage.setItem(
                "blogAppUserDetails", JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUsername("");
            setPassword("");
            setUser(user);
            setNotification("successfully logged in");
            setNotification({
                message: "successfully logged in",
                status: "success"
            });
            setTimeout(() => setNotification({}), 5000);
        }
        catch (exception) {
            setNotification({
                message: exception.response.data.error,
                status: "error"
            });
            setTimeout(() => setNotification({}), 5000);
        }
    };

    return (
        <div>
            <h2>Log in to application</h2>

            <div className={notification.status}>
                <p>{notification.message}</p>
            </div>

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    );
};


const BlogForm = ({ setBlogs, setNotification, createBlog }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const blogFormRef = useRef();
    const handleBlogCreation = async (event) => {
        event.preventDefault();
        blogFormRef.current.setVisibility(false);

        try {
            await createBlog(title, author, url);
            setNotification({
                message: `a new blog ${title} by ${author} added`,
                status: "success"
            });
            setTimeout(() => setNotification({}), 5000);
            setTitle("");
            setAuthor("");
            setUrl("");
            blogService.getAll().then(blogs =>
                setBlogs(blogs)
            );
        }
        catch (exception) {
            setNotification({
                message: exception.response.data.error,
                status: "error"
            });
            setTimeout(() => setNotification({}), 5000);
        }
    };


    return (
        <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <form onSubmit={handleBlogCreation}>
                <div>
                    title:
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </Toggleable >
    );
};


export { LoginForm, BlogForm };