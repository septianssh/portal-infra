import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    if (!err.isOperational) {
        logger.error('Unexpected error:', err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';

    logger.error(`Error: ${message}`, { stack: err.stack });

    res.status(statusCode).json({
        status: 'error',
        message,
    });
};

export default errorHandler;
