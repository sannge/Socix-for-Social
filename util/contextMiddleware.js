const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const { AuthenticationError, PubSub } = require("apollo-server");

const pubsub = new PubSub();
pubsub.ee.setMaxListeners(30);

module.exports = (context) => {
	let token;

	if (context.req && context.req.headers.authorization) {
		token = context.req.headers.authorization;
	} else if (context.connection && context.connection.context.Authorization) {
		token = context.connection.context.Authorization;
	}

	if (token) {
		jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
			context.user = decodedToken;
		});
	}

	context.pubsub = pubsub;

	return context;
};
