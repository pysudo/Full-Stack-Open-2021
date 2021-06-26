import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";


import Blog from "./Blog";
import { BlogForm } from "./Form";


describe("<Blog />", () => {
    let component, handleLikes;
    beforeEach(() => {
        const blog = {
            title: "Hardy Boys",
            author: "Franklin W. Dixon",
            url: "http://hardyboys.us/",
            likes: "100"
        };
        handleLikes = jest.fn();
        component = render(
            <Blog blog={blog} handleLikes={handleLikes} />
        );
    });

    test("initially displays the blog's title and author only", () => {
        const div = component.container.querySelector(".showDetails");

        expect(div).toHaveStyle("display: none");
    });

    test("displays rest of the blog's detail after button press", () => {
        const button = component.getByText("view");
        fireEvent.click(button);

        const div = component.container.querySelector(".showDetails");
        expect(div).not.toHaveStyle("display: none");
    });

    test("clicking like twice, calls the prop's event handler twice", () => {
        const likeButton = component.getByText("like");
        fireEvent.click(likeButton);
        fireEvent.click(likeButton);

        expect(handleLikes.mock.calls).toHaveLength(2);
    });
});


describe("<BlogForm />", () => {
    test("calls and event handler passed with right details", () => {
        const createBlog = jest.fn();
        const component = render(
            <BlogForm createBlog={createBlog} />
        );

        const form = component.container.querySelector("form");
        const [title, author, url] = component
            .container.querySelectorAll("input");

        fireEvent.change(title, { target: { value: "Hardy Boys" } });
        fireEvent.change(author, { target: { value: "Franklin W. Dixon" } });
        fireEvent.change(url, { target: { value: "http://hardyboys.us" } });
        fireEvent.submit(form);

        console.log(createBlog.mock.calls[0]);
        expect(createBlog.mock.calls).toHaveLength(1);
        expect(createBlog.mock.calls[0])
            .toEqual(
                ["Hardy Boys", "Franklin W. Dixon", "http://hardyboys.us"]
            );
    });
});
