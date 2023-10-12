var jwt = require('jsonwebtoken');
var config = require('../config');

const login = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		if (username === config.username && password === config.password) {
			const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
			const expiresIn = 3600 * 24 * 7; // 7 days in seconds
			const expirationTimestamp = currentTimestamp + expiresIn;
			const token = jwt.sign({ username }, config.jwtSecret, { expiresIn: expiresIn }); 
			res.json({ token, expiry: expirationTimestamp });
		}
		else {
			res.status(401).json({ error: 'Wrong credentials' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'Unable to login' });
	}

};

const authenticationMiddleware = async (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		jwt.verify(token, config.jwtSecret, (err, decoded) => {
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
