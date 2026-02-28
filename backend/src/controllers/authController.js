const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role, specialization, experience, qualification, consultationFees } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Handle photo upload if present
        let photoUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; // Default avatar
        if (req.file) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'doctor-appointment/users',
                    width: 300,
                    height: 300,
                    crop: 'fill',
                    gravity: 'face'
                });
                photoUrl = result.secure_url;

                // Delete file from local storage
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Continue with default photo if upload fails
            }
        }

        const userData = {
            name,
            email,
            password,
            phone,
            role: role || 'patient',
            photo: photoUrl, // Add the photo URL
        };

        // Add doctor specific fields
        if (role === 'doctor') {
            userData.specialization = specialization;
            userData.experience = experience;
            userData.qualification = qualification;
            userData.consultationFees = consultationFees;
            userData.isApproved = false;
        }

        const user = await User.create(userData);

        // Send welcome email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Smart Doctor Appointment System',
                message: `
                    <h1>Welcome ${user.name}!</h1>
                    <p>Thank you for registering with Smart Doctor Appointment System.</p>
                    ${user.role === 'doctor' ? '<p>Your account is pending admin approval. You will be notified once approved.</p>' : ''}
                `,
            });
        } catch (error) {
            console.log('Email error:', error);
        }

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                photo: user.photo,
                isApproved: user.isApproved,
                token: generateToken(user._id, user.role),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: 'Your account has been blocked. Please contact admin.' });
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                photo: user.photo,
                isApproved: user.isApproved,
                token: generateToken(user._id, user.role),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message,
            });

            res.json({ success: true, message: 'Password reset email sent' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordMatch = await user.matchPassword(currentPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword,
};