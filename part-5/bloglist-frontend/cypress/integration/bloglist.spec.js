describe("Blog app", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/testing/reset");

        const user = {
            username: "johndoe123",
            password: "qwerty",
            name: "John Doe"
        };
        cy.request("POST", "http://localhost:3001/api/users", user);

        cy.visit("http://localhost:3000/");
    });


    it("Login form is shown", function () {
        cy.contains("Log in to application");
        cy.get("#txtUsername").parent().contains("username");
        cy.get("#txtPassword").parent().contains("password");

        cy.get("html").find("button").contains("login");
    });


    describe("Login", function () {
        it("succeeds with correct credentials", function () {
            cy.get("#txtUsername").type("johndoe123");
            cy.get("#txtPassword").type("qwerty");
            cy.get("#login-button").click();

            cy.get(".success").should("contain", "successfully logged in");
        });

        it("fails with wrong credentials", function () {
            cy.get("#txtUsername").type("johndoe123");
            cy.get("#txtPassword").type("wrong");
            cy.get("#login-button").click();

            cy.get(".error").should("contain", "invalid username or password")
                .and("have.css", "color", "rgb(255, 0, 0)");
        });
    });


    describe("when logged in", function () {
        beforeEach(function () {
            cy.login({ username: "johndoe123", password: "qwerty" });

            for (let i = 1; i <= 2; i++) {
                cy.createBlog({
                    title: `This is a Blog ${i}`,
                    author: `Some Author ${i}`,
                    url: `www.blog-${i}.com`,
                });
            }
            cy.visit("http://localhost:3000/");
        });


        it("a new blog can be created", function () {
            // Initially should contain only 2 blogs
            cy.get(".blog").should("have.length", 2);

            const title = "Bobby Brooks was here!";
            const author = "Bobby Brooks";
            const url = "www.bobbyisbest.com";

            cy.get("#btnToggleBlogForm").click();

            cy.get("#title").type(title);
            cy.get("#author").type(author);
            cy.get("#url").type(url);

            cy.get("#btnCreateNote").click();

            cy.get(".success")
                .should("contain", `a new blog ${title} by ${author} added`);

            // After creating another blog, there should be 3 blogs in total
            cy.get(".blog").should("have.length", 3).then(blogs => {
                cy.wrap(blogs[3]).contains(`${title} - ${author}`);
            });
        });

        it("a user can like a blog", function () {
            cy.get(".blog").then(blogs => {
                cy.wrap(blogs[0]).contains("view").click();
                cy.wrap(blogs[0]).contains("like").click();
                cy.wrap(blogs[0]).contains("likes 1");
            });
        });

        it("blogs can only be deleted by the user who created it", function () {
            cy.get(".blog").then(blogs => {
                cy.wrap(blogs[0]).contains("delete").click();
                cy.get(".blog").should("have.length", 1);
            });
        });

        it("a user cannot delete other user's blog", function () {
            cy.get("#btnLogout").click();

            const user = {
                username: "billyboblol",
                password: "password123",
                name: "Billy Bob"
            };
            cy.request("POST", "http://localhost:3001/api/users", user);

            cy.login({ username: "billyboblol", password: "password123" });

            cy.get(".blog > button").then(buttons => {
                buttons.map((_, button) => {
                    if (button.innerText === "delete") {
                        cy.wrap(button).should("have.css", "display", "none");
                    }
                });
            });
        });

        it("blogs are ordered in the descending order of likes", function () {
            const maxBlogs = 5;
            const multiplier = 100;
            for (let i = 1; i <= maxBlogs; i++) {
                cy.createBlog({
                    title: `Blog ${i}`,
                    author: `Author ${i}`,
                    url: `www.blogwebsite-${i}.com`,
                    likes: i * multiplier
                });
            }
            cy.visit("http://localhost:3000/");

            cy.get(".blog").then(blogs => {
                let temp = maxBlogs * multiplier;

                blogs.map((_, blog) => {
                    cy.wrap(blog).find("div > span.likes", { "force": true })
                        .then(likes => {
                            expect(temp >= parseInt(likes[0].innerText))
                                .to.eq(true);
                            temp = parseInt(likes[0].innerText);
                        });
                });
            });
        });
    });
});