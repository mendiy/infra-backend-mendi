import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

// Middleware to conditionally verify JWT for routes other than /register and /login
const verifyToken = (req, res, next) => {
  // Extract the token from the request headers, query parameters, or cookies
  const token = req.headers.authorization;

  // List of routes where JWT verification is not required
  const excludedRoutes = ['/register', '/login'];

  if (!excludedRoutes.includes(req.path)) {
    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Continue to the next middleware or route handler
      } catch (error) {
        res.status(401).json({ error: 'JWT verification failed' });
      }
    } else {
      res.status(401).json({ error: 'JWT token is missing' });
    }
  } else {
    next(); // Continue to the next middleware or route handler (no verification for excluded routes)
  }
};


export default verifyToken;






// import { expressjwt } from 'express-jwt';

// // Set the JWT secret
// const jwt_secret = process.env.JWT_SECRET || 'megobb';

// const token = 'eyJhbGciOiJIUzI1NiJ9.aGhAampqampqampqampqampqamouY29t.UlR8638RE8BEet0A-gXX4CjFi95x4-1ENnOmvvk1L8g';

// // Middleware for JWT validation
// const jwtMiddleware = expressjwt({
//   secret: jwt_secret,
//   algorithms: ['HS256'],
//   function (req, res) {
//     if (!req.auth.admin) return res.sendStatus(401);
//     res.sendStatus(200);
//   }
// }).unless({ path: ['/register'] });


// export {jwtMiddleware}
