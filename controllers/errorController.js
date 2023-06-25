const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {

    const value = Object.values(err.keyValue)[0]; // from course comment, not from jonas
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else { // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('Error', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => { // this is error handling middleware only called when an error occurs (specifying 4 paramaters tells express that this is error handling middleware)
    // console.log(err.stack);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
        console.debug(err);

    } else if (process.env.NODE_ENV === 'production') {
        let error = JSON.parse(JSON.stringify(err));

        // Operational errors that were created by code other than our own (like MongoDB or Mongoose errors)
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        
        sendErrorProd(error, res);
    }

    
}