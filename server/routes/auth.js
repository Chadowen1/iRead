import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/models.js';
import { validateEmail, validateName, validatePassword, validateAge } from '../utils/validators.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, birthdate } = req.body;
    // Basic validations
    if (!validateName(firstName) || !validateName(lastName)) {
        return res.status(400).json({ message: 'Invalid name' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!validateAge(birthdate)) {
        return res.status(400).json({ message: 'You must be at least 18 years old' });
    }
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            firstName,
            familyName: lastName,
            birthdate,
            email,
            passwordHash: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { email: user.email }, // Use email as the claim
            'admin',
            { expiresIn: '8h' }
        );
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
