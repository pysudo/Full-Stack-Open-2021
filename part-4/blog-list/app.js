require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");

const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");


const app = express();

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use(errorHandler);
app.use(unknownEndpoint);


module.exports = app;