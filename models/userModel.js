const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// 1) Create schema
// 2) Create model out of the schema
// 3) Export
// name, email, photo, password, passwordConfirm


const userSchema = new mongoose.Schema({
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
        minLength: 8,
        select: false
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
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next(); // only run this function if password was modified

    this.password = await bcrypt.hash(this.password, 12); // hash the password with cost of 12

    this.passwordConfirm = undefined; // Delete the passwordConfirm field value
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) { //instance method available on all user documents
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    // False means not changed
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
