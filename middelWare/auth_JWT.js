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

  // List of routes where JWT verification is not required
  const excludedRoutes = ['/api/users/register', '/api/users/login', '/api/users/verifyToken'];

  if (!excludedRoutes.includes(req.path)) {
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        
        req.user = decoded; // Attach the decoded payload to the request object
        next();
      } catch (error) {
        return res.status(401).json({ error: 'JWT verification failed' });
      }
    } else {
      return res.status(401).json({ error: 'JWT token is missing' });
    }
  } else {
    next(); // Continue to the next middleware or route handler (no verification for excluded routes)
  }
};

export default verifyToken;