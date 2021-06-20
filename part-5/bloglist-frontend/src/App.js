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
      message: `successfully logged out`,
      status: "success"
    });
    setTimeout(() => setNotification({}), 5000);
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs = blogs.sort((a, b) => b.likes - a.likes)
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
    />
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
      <BlogForm setBlogs={setBlogs} setNotification={setNotification} />

      {blogs.map(blog =>
        <Blog key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          user={user}
        />
      )}
    </div>
  )
}


export default App;