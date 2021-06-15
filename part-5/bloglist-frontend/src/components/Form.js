import React, { useState } from "react";

import loginService from "../services/login";
import blogService from "../services/blogs";


const LoginForm = props => {
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login(
                { username: props.username, password: props.password }
            );
            window.localStorage.setItem(
                "blogAppUserDetails", JSON.stringify(user)
            );
            blogService.setToken(user.token);
            props.setUser(user);
            props.setUsername("");
            props.setPassword("");
            props.setNotification("successfully logged in");
            props.setNotification({
                message: "successfully logged in",
                status: "success"
            });
            setTimeout(() => props.setNotification({}), 5000);
        }
        catch (exception) {
            props.setNotification({
                message: exception.response.data.error,
                status: "error"
            });
            setTimeout(() => props.setNotification({}), 5000);
        }
    };

    return (
        <div>
            <h2>Log in to application</h2>

            <div className={props.notification.status}>
                <p>{props.notification.message}</p>
            </div>

            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        value={props.username}
                        onChange={({ target }) => props.setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        value={props.password}
                        onChange={({ target }) => props.setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
};


const BlogForm = ({ setBlogs, setNotification }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleBlogCreation = async (event) => {
        event.preventDefault();
        try {
            await blogService.create({
                title,
                author,
                url
            });
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
            )
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
        <form onSubmit={handleBlogCreation}>
            <div>
                title:
                <input value={title} onChange={({ target }) => setTitle(target.value)} />
            </div>
            <div>
                author:
                <input value={author} onChange={({ target }) => setAuthor(target.value)} />
            </div>
            <div>
                url:
                <input value={url} onChange={({ target }) => setUrl(target.value)} />
            </div>
            <button type="submit">create</button>
        </form>
    )
}


export { LoginForm, BlogForm };