const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "ValidationError") {
        return response.status(400).send({ error: error.message });
    }
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};


const unknownEndpoint = (request, response) => {

    response.status(404).send({ error: "unknown endpoint" });
};


module.exports = { errorHandler, unknownEndpoint };