const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getMe = (req, res, next) => { //middleware to allow getUser to have req.params.id populated
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req.body);

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
    }

    // 2) Filtered out unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });


    res.status(200).json({
        status: 'success',
        user: updatedUser
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined! Please use /signup instead'
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User); // Do NOT update passwords with this (validations won't work)!
exports.deleteUser = factory.deleteOne(User);