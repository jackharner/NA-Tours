const dontenv = require('dotenv');
const app = require('./app');

dontenv.config({ path: './config.env' });



// console.log(process.env);

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
