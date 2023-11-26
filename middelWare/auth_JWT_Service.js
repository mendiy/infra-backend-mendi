import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const jwtSecret = process.env.JWT_SECRET;

// Middleware to conditionally verify JWT for routes other than /register and /login
const verifyToken = (req, res, next) => {
    // Extract the token from the request headers, query parameters, or cookies
    const token = req.headers.authorization;

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded; // Attach the decoded payload to the request object
            return res.status(200).json({ message: 'JWT verification verified', verified: true });
        } catch (error) {
            return res.status(401).json({ error: 'JWT verification failed', verified: false });
        }
    } else {
        return res.status(401).json({ error: 'JWT token is missing' });
    }
}

export default verifyToken;