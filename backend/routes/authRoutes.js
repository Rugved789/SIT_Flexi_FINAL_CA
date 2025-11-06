import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import pkg from "express-validator";
const { body, validationResult } = pkg;
import { registerValidation } from "../middleware/validators.js";

const router = express.Router();

// Login validation
const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),
    
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
];

// Register route
router.post("/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Sign a flat payload with id and role so middleware that expects decoded.id works
        const payload = {
            id: user.id,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "5h" },
            (err, token) => {
                if (err) throw err;
                // return token and user info for client
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name
                    },
                    token,
                    message: "Registration successful"
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Login route
router.post("/login", validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Sign a flat payload with id and role so middleware that expects decoded.id works
        const payload = {
            id: user.id,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "5h" },
            (err, token) => {
                if (err) throw err;
                res.json({
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name
                    },
                    token,
                    message: "Login successful"
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

import { protect } from "../middleware/authMiddleware.js";

// Get user profile (protected)
router.get("/profile", protect, async (req, res) => {
    try {
        // req.user is populated by protect middleware
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const user = await User.findById(req.user.id || req.user._id).select("-password");
        return res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Update user profile (protected)
router.put(
    "/profile",
    protect,
    [
        // optional validations
        body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
        body("email").optional().isEmail().withMessage("Invalid email").normalizeEmail(),
        body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("contact").optional().trim(),
        body("address").optional().trim(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized" });
            }

            const userId = req.user.id || req.user._id;
            const { name, email, password, contact, address } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            // If updating email, ensure it's not used by another account
            if (email && email !== user.email) {
                const existing = await User.findOne({ email });
                if (existing && existing.id !== userId) {
                    return res.status(400).json({ message: "Email already in use" });
                }
                user.email = email;
            }

            if (name) user.name = name;
            if (contact !== undefined) user.contact = contact;
            if (address !== undefined) user.address = address;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            await user.save();

            const sanitized = await User.findById(userId).select("-password");
            return res.json({ user: sanitized, message: "Profile updated" });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    }
);

export default router;