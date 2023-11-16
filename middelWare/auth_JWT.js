 import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'megobb';

const jwtMiddleware = async (req, res) => {
  //console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    console.log('Token not provided');
    return res.status(401).json({ error: 'Token not provided' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // If the token is valid, the execution reaches here
    console.log({user: decoded});
    res.json({ isValid: true, user: decoded });
  } catch (error) {
    console.log('Invalid token');
    // If the token is invalid, respond with a 401 status
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default jwtMiddleware






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
