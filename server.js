const mongoose = require('mongoose');
const dontenv = require('dotenv');
const app = require('./app');

dontenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParse: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {console.log('DB connection successful!');})
.catch(() => console.log('DB CONNECTION UNSUCCESSFUL'));

// console.log(process.env);

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
