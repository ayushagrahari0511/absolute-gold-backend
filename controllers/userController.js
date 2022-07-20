const catchAsyncError = require('../middlewares/catchAsyncError')
const User = require('../models/userModel')
const sendToken = require('../utils/sendToken')
const ErrorHandler = require('../utils/errorHandler')


// Register a User-----------------------
// ---------------------
exports.registerUser = catchAsyncError(
    async (req, res, next) => {

        //Receiving user Input from body 
        const { userName, email, phone, password } = req.body

        // Checking if all the fields are filled properly
        if (!userName || !email || !phone || !password) {
            return next(new ErrorHandler("All fields are required", 405))
        }

        // Checking if user is already exist
        const emailExist = await User.findOne({ email })

        if (emailExist) {
            return next(new ErrorHandler("Email already registered.", 409))
        }

        const userNameExist = await User.findOne({
            userName
        })

        if(userNameExist) {
            return next(new ErrorHandler("Username is not available", 409))
        }

        const phoneExist = await User.findOne({
            phone
        })

        if(phoneExist) {
            return next(new ErrorHandler("Phone already registered", 409))
        }

        // Pushing user data to database
        const user = await User.create({
            userName,
            email,
            phone,
            password
        });

        // Sending response to the client
        res.status(201).json({
            success: true,
            user
        })
    }
)


// login -------------------------------
// -------------------------
exports.loginUser = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("All fields are mandatory", 405))
        }

        const user = await User.findOne({ $or: [{ email: email }, { userName: email }] }).select("+password")

        if (!user) {
            return next(new ErrorHandler("Invalid Credentials", 401))
        }

        const isPasswordMatched = user.comparePassword(password)

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Credentials", 401))
        }

        sendToken(user, 200, res)
    }
)

// Logout User ------------------------
// ---------------------------

exports.logoutUser = catchAsyncError(
    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    }
)


// Get user Detail ----------
// ---------------

exports.getUserDetails = catchAsyncError(
    async (req, res, next) => {
        const user = await User.findById(
            req.user.id
        )

        if(!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            success: true,
            user
        })
    }
)

// update user profile
// ---------------
exports.updateProfile = catchAsyncError(
    async (req, res, next) => {

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        }

        // We will add cloudinary later

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true
        })
    }
)
