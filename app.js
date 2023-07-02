const express = require('express');
const morgan = require('morgan'); // logging functionality, 3rd party middleware example
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(helmet()); // Set security HTTP headers

if (process.env.NODE_ENV === 'development') { // Development logging
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!' 
});
app.use('/api', limiter);


app.use(express.json({ limit: '10kb' })); // middleware that allows us to access the body of the request (it's not present without this line); body parser, reads data from body into req.body

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss attacks
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

app.use(express.static(`${__dirname}/public`)); // middleware that allows us to serve static files like HTML files

app.use((req, res, next) => { // Test middleware
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
})

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => { // middleware to deal with the situation where no previous routes were reached (so send a 404 error)
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // when something is passed into next(), express reads it as an error and skips all other middlewares to global middleware handler
});

app.use(globalErrorHandler); // this is error handling middleware only called when an error occurs

module.exports = app;
