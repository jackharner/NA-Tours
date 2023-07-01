const fs = require('fs');
const mongoose = require('mongoose');
const dontenv = require('dotenv');
const Tour = require('./../../models/tourModel');

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

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
        process.exit();
    } catch(err) {
        console.log(err);
    }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log(err);
    }
    process.exit();
};

if(process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// console.log(process.argv);