const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};

// Doctor approval check
const isApprovedDoctor = (req, res, next) => {
    if (req.user.role === 'doctor' && !req.user.isApproved) {
        return res.status(403).json({
            success: false,
            message: 'Doctor account not approved by admin'
        });
    }
    next();
};

module.exports = { authorize, isApprovedDoctor };