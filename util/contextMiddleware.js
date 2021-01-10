const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const { AuthenticationError } = require("apollo-server");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const { PubSub } = require("apollo-server");
//For Production

const Redis = require("ioredis");

const options = {
	host: "127.0.0.1",
	port: "6379",
	retry_strategy: (options) => {
		return Math.max(options.attempt * 100, 3000);
	},
};

const pubsub = new RedisPubSub({
	publisher: new Redis(options),
	subscriber: new Redis(options),
});

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
