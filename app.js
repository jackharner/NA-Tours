const express = require('express');
const morgan = require('morgan'); // logging functionality, 3rd party middleware example

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(express.json()); // middleware that allows us to access the body of the request (it's not present without this line)
app.use(express.static(`${__dirname}/public`)); // middleware that gives us access to static files like HTML files

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => { // middleware to deal with the situation where no previous routes were reached (so send a 404 error)
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // when something is passed into next(), express reads it as an error and skips all other middlewares to global middleware handler
});

app.use(globalErrorHandler); // this is error handling middleware only called when an error occurs

module.exports = app;
