module.exports = (err, req, res, next) => { // this is error handling middleware only called when an error occurs (specifying 4 paramaters tells express that this is error handling middleware)
    // console.log(err.stack);
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}