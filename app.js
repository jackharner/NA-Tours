const express = require('express');
const morgan = require('morgan'); // logging functionality, 3rd party middleware example

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(express.json()); // middleware that allows us to access the body of the request (it's not present without this line)
app.use(express.static(`${__dirname}/public`)); // middleware that gives us access to static files like HTML files

app.use((req, res, next) => { // custom middleware example
    console.log('Hello from the middleware');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
