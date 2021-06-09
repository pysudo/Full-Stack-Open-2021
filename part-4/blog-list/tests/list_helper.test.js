const listHelper = require("../utils/list_helper");
const helper = require("./test-helper");


test("dummy returns one", () => {
    const result = listHelper.dummy(helper.initialBlogs);
    expect(result).toBe(1);
});


describe("total likes", () => {
    test("when list has more than one blog, equals sum of the likes", () => {
        const result = listHelper.totalLikes(helper.initialBlogs);
        expect(result).toBe(36);
    });
    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes([helper.initialBlogs[0]]);
        expect(result).toBe(7);
    });

    test("when list has no blogs, equals to zero", () => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    });
});


describe("most liked blog post", () => {
    test("when list has more than one blog, returns the first most liked blog",
        () => {
            const result = listHelper.favoriteBlog(helper.initialBlogs);
            expect(result).toEqual(helper.initialBlogs[2]);
        });

    test("when list has only one blog, returns that one blog itself", () => {
        const result = listHelper.favoriteBlog([helper.initialBlogs[0]]);
        expect(result).toEqual(helper.initialBlogs[0]);
    });

    test("when list has no blogs, returns an empty object", () => {
        const result = listHelper.favoriteBlog([]);
        expect(result).toEqual({});
    });
});


describe("author with largest amount of blogs posts", () => {
    test("when list has more than one blog, returns author with most blogs",
        () => {
            const result = listHelper.mostBlogs(helper.initialBlogs);
            expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
        });

    test("when list has only blogs of same author, number of blogs must match",
        () => {
            const result = listHelper.mostBlogs(helper.initialBlogs.slice(3));
            expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
        });

    test("when list has only one blog, returns author with blog value of 1",
        () => {
            const result = listHelper.mostBlogs([helper.initialBlogs[0]]);
            expect(result).toEqual({ author: "Michael Chan", blogs: 1 });
        });

    test("when list has no blogs, returns an empty object", () => {
        const result = listHelper.mostBlogs([]);
        expect(result).toEqual({});
    });
});


describe("author with largest amount of likes", () => {
    test("when list has more than one blog, returns author with most likes",
        () => {
            const result = listHelper.mostLikes(helper.initialBlogs);
            expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 });
        });

    test("when list has blogs of same author, total number of likes must match",
        () => {
            const result = listHelper.mostLikes(helper.initialBlogs.slice(3));
            expect(result).toEqual({ author: "Robert C. Martin", likes: 12 });
        });

    test("when list has only one blog, returns number of likes of that blog",
        () => {
            const result = listHelper.mostLikes([helper.initialBlogs[0]]);
            expect(result).toEqual({ author: "Michael Chan", likes: 7 });
        });

    test("when list has no blogs, returns an empty object", () => {
        const result = listHelper.mostLikes([]);
        expect(result).toEqual({});
    });
});

