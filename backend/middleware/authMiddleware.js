import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Debug logging: show decoded token
            try {
                console.log('[protect] decoded token:', decoded);
            } catch (logErr) {
                console.error('[protect] failed to log decoded token', logErr);
            }

            // Support both new flat payload ({ id, role }) and older nested payload ({ user: { id, role } })
            const userId = decoded.id || decoded.user?.id;
            const userRole = decoded.role || decoded.user?.role;

            if (!userId) {
                console.warn('[protect] no user id found in token payload');
                return res.status(401).json({ message: 'Not authorized - invalid token payload' });
            }

            // Get user from token
            req.user = await User.findById(userId).select('-password');

            // If user found, ensure req.user.role exists; if not, consider attaching role from token
            if (req.user && !req.user.role && userRole) {
                req.user.role = userRole;
            }

            // Debug logging: show found user role (if any)
            try {
                console.log('[protect] req.user:', req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : null);
            } catch (logErr) {
                console.error('[protect] failed to log req.user', logErr);
            }

            return next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ message: 'Not authorized - invalid token' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if user is an NGO
export const isNGO = (req, res, next) => {
    if (req.user && req.user.role === 'ngo') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. NGO only.' });
    }
};

// Middleware to check if user is a donor
export const isDonor = (req, res, next) => {
    if (req.user && req.user.role === 'donor') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Donor only.' });
    }
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};