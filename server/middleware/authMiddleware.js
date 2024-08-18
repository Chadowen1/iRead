import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decodedToken = jwt.verify(token, 'admin'); // Use the same secret key as when you signed the token
        req.user = { email: decodedToken.email };
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default requireAuth;