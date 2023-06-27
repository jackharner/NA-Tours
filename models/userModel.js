const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// 1) Create schema
// 2) Create model out of the schema
// 3) Export
// name, email, photo, password, passwordConfirm


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please tell us your name!']
        },
        email: {
            type:String,
            required: [true, 'Please tell us your email!'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minLength: 8
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                validator: function(el) {
                    return el === this.password; // "this" keyword points to current doc on NEW document, must use "Save", not findOneAndUpdate Will only work with update if you take a complex workaround
                },
                message: 'Passwords are not the same'
            }
        }
    }, 
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
);

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next(); // only run this function if password was modified

    this.password = await bcrypt.hash(this.password, 12); // hash the password with cost of 12

    this.passwordConfirm = undefined; // Delete the passwordConfirm field value
});

const User = mongoose.model('User', userSchema);

module.exports = User;
