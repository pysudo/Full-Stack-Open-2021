const jwt = require("jsonwebtoken");

const User = require("../models/user");
const logger = require("./logger");


const tokenExtractor = (request, response, next) => {
    const authorization = request.get("Authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        request.token = authorization.substring(7);
    }

    next();
};


const userExtractor = async (request, response, next) => {
    const decodedToken = !request.token
        ? false
        : jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" });
    }

    request.user = await User.findById(decodedToken.id);
    next();
};


const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "ValidationError") {
        return response.status(400).send({ error: error.message });
    }
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }
    if (error.name === "JsonWebTokenError") {
        return response.status(401).send({ error: error.message });
    }

    next(error);
};


const unknownEndpoint = (request, response) => {

    response.status(404).send({ error: "unknown endpoint" });
};


module.exports = {
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
};