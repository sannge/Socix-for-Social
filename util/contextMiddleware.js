const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
	const token = context.req.headers.authorization || "";

	let info = null;
	if (token) {
		jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
			info = decodedToken;
		});

		context.user = info;
		return context;
	}
};
