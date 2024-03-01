import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from '../models/user.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from 'bcryptjs';
import getResetPasswordTemplate from "../utils/emailTemplates.js";


export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });
    sendToken(user, 201, res)
});

// login user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    // Return JWTToken
    sendToken(user, 201, res)
});

// Login user => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httponly: true,
    });
    res.status(200).json({
        message: "Logged Out",
    })
})

// Forget password => api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find user in the database
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler('User not found with this email', 404));
        }

        // Get reset password token
        const resetToken = user.getResetPasswordToken();

        // Create reset password URL
        const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

        // Generate reset password email template
        const template = getResetPasswordTemplate(user.username, resetUrl);

        // Send reset password email
        await sendEmail({
            email: user.email,
            subject: 'E-COM Password Recovery',
            message: template,
        });

        // Save user after successfully sending the email
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + process.env.RESET_PASSWORD_EXPIRES * 60 * 1000;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        // If there's an error sending the email, handle it
        console.error('Error sending reset password email:', error);

        // Send a generic error message
        return next(new ErrorHandler('Failed to send reset email', 500));
    }
});

// Get current user profile => /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req?.user?._id);

        if (!user) {
            return next(new ErrorHandler('User profile not found', 404));
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || 'Failed to fetch user profile', 500));
    }
});

// Update Password => /api/v1/password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    // Find the user by ID and select the password field
    const user = await User.findById(req?.user?._id).select("+password");

    // Check if the user exists
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if both old and new passwords are provided
    const oldPasswordFromUser = req.body.oldPassword;
    const newPasswordFromUser = String(req.body.newPassword); // Convert to string

    if (!oldPasswordFromUser || !newPasswordFromUser) {
        return next(new ErrorHandler('Old or new password is missing', 400));
    }

    // Check if the provided current password is correct
    const isPasswordMatched = await user.comparePassword(oldPasswordFromUser);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    // Hash the new password before updating
    try {
        const newPasswordHash = await bcrypt.hash(newPasswordFromUser, 10);
        user.password = newPasswordHash;
    } catch (error) {
        console.error('Error hashing new password:', error);
        return next(new ErrorHandler('Error updating password', 500));
    }

    // Save the user after updating the password
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully',
    });
});


// Update User Profile => /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    try {
        const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user // Send updated user data in the response
        });
    } catch (error) {
        console.error('Error updating profile:', error); // Log the specific error
        return next(new ErrorHandler('Failed to update profile', 500)); // Handle update error
    }
});

//Get all User - Admin => /api/v1/admin/users
export const allUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.find(req.params.id);

    res.status(200).json({
        user,
    })

})


//Get all User - Admin => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id:${req.params.id}`, 404))
    }
    res.status(200).json({
        user,
    })

})

// Update User Details= ADMIN => /api/v1/admin/user/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role // Assuming the role is passed in the request body as "role"
    };

    try {
        const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
            new: true,
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'User Details updated successfully',
            data: user // Send updated user data in the response
        });
    } catch (error) {
        console.error('Error updating profile:', error); // Log the specific error
        return next(new ErrorHandler('Failed to update profile', 500)); // Handle update error
    }
});


// Delete User Details= ADMIN => /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id); // Removed unnecessary parameters

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    await user.deleteOne(); // Remove the user document

    //  TODO  -Remove user avatar from cloudinaryk

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
