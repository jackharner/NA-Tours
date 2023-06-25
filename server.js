const mongoose = require('mongoose');
const dontenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNHANDLED EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1); // note: this makes "[nodemon] app crashed - waiting for file changes before starting..." message
});

dontenv.config({ path: './config.env' });
const app = require('./app');


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParse: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {console.log('DB connection successful!');});
// .catch(() => console.log('DB CONNECTION UNSUCCESSFUL'));


const port = process.env.port || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => { // handling unhandled promise rejection
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => { // server.close() allows current requests to finish before closing
        process.exit(1); // note: this makes "[nodemon] app crashed - waiting for file changes before starting..." message
    })
});

