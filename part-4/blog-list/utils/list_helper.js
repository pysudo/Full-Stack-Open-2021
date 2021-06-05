var _ = require("lodash");


const dummy = () => {

    return 1;
};


// Returns the total sum of likes in all of the blog posts
const totalLikes = (blogs) => {

    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};


// Returns the most liked blog on the bloglist
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    return blogs.reduce((maxLikedBlog, blog) => {
        if (maxLikedBlog.likes > blog.likes) {
            return maxLikedBlog;
        }

        return blog;
    }, blogs[0]);
};


// Returns the author has the largest amount of blogs written
const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    const blogListGroupedByAuthor = _.groupBy(blogs, "author");
    const author = Object.keys(blogListGroupedByAuthor)[0];
    const noOfBlogs = blogListGroupedByAuthor[author].length;
    const initialObj = { author, blogs: noOfBlogs };

    return _.reduce(
        blogListGroupedByAuthor,
        (authorWithMostBlogs, bloglist, author) => {
            if (authorWithMostBlogs.blogs < bloglist.length) {
                return { author, blogs: bloglist.length };
            }
            return authorWithMostBlogs;
        },
        initialObj
    );
};


// Returns author has the largest sum of all likes of their blogpost
const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {};
    }

    const blogListGroupedByAuthor = _.groupBy(blogs, "author");
    const author = Object.keys(blogListGroupedByAuthor)[0];
    const likes = blogListGroupedByAuthor[author].reduce((result, value) => {
        return result += value.likes;
    }, 0);
    const initialObj = { author, likes };

    return _.reduce(
        blogListGroupedByAuthor,
        (authorWithMostLikes, bloglist, author) => {
            const currentLikes = bloglist.reduce((a, b) => a += b.likes, 0);

            if (authorWithMostLikes.likes < currentLikes) {
                return { author, likes: currentLikes };
            }
            return authorWithMostLikes;
        },
        initialObj
    );
};


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
