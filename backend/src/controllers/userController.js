const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;

            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({ success: false, message: 'Email already exists' });
                }
                user.email = req.body.email;
            }

            // Update doctor specific fields
            if (user.role === 'doctor' && req.body.specialization) {
                user.specialization = req.body.specialization;
                user.experience = req.body.experience;
                user.qualification = req.body.qualification;
                user.consultationFees = req.body.consultationFees;
                user.availableSlots = req.body.availableSlots || user.availableSlots;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    photo: updatedUser.photo,
                    isApproved: updatedUser.isApproved,
                    specialization: updatedUser.specialization,
                    experience: updatedUser.experience,
                    qualification: updatedUser.qualification,
                    consultationFees: updatedUser.consultationFees,
                    availableSlots: updatedUser.availableSlots,
                },
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'doctor-appointment/users',
            width: 300,
            crop: 'scale',
        });

        const user = await User.findById(req.user._id);
        user.photo = result.secure_url;
        await user.save();

        // Delete file from local storage
        fs.unlinkSync(req.file.path);

        res.json({ success: true, data: { photo: result.secure_url } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getApprovedDoctors = async (req, res) => {
    try {
        const { search, specialization, location, minPrice, maxPrice, rating } = req.query;

        let query = { role: 'doctor', isApproved: true, isBlocked: false };

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by specialization
        if (specialization) {
            query.specialization = specialization;
        }

        // Filter by consultation fees
        if (minPrice || maxPrice) {
            query.consultationFees = {};
            if (minPrice) query.consultationFees.$gte = Number(minPrice);
            if (maxPrice) query.consultationFees.$lte = Number(maxPrice);
        }

        // Filter by rating
        if (rating) {
            query.averageRating = { $gte: Number(rating) };
        }

        const doctors = await User.find(query).select('-password -resetPasswordToken -resetPasswordExpire');

        res.json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findOne({
            _id: req.params.id,
            role: 'doctor',
            isApproved: true,
            isBlocked: false
        }).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadProfilePhoto,
    getApprovedDoctors,
    getDoctorById,
};