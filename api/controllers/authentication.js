var jwt = require('jsonwebtoken');

const JWT_SECRET = 'Z0smexYoo8NnDQ3WqDEVw0YX+MSy6EiLZ4APjfLNXkA=';


const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the provided username and password match your single user's credentials
  if (username === 'dhaval' && password === 'notes@186333') {
		const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
		const expiresIn = 3600 * 24 * 7; // 7 days in seconds
		const expirationTimestamp = currentTimestamp + expiresIn;
    // Create a JWT token and send it in the response
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: expiresIn }); // Change the secret and expiration as needed
    return res.json({ token, expiry: expirationTimestamp});
  }

};

const authenticationMiddleware = async (req, res, next) => {
	const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      return next();
    });
  } else {
    res.status(401).json({ message: 'Token not provided' });
  }
};

module.exports = {
	login,
	authenticationMiddleware,
};
