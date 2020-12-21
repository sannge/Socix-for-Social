const userResolvers = require("./UserResolvers");
const messageResolvers = require("./MessageResolvers");

module.exports = {
	Message: {
		createdAt: (parent) => {
			return parent.createdAt.toISOString();
		},
	},
	// User: {
	// 	createdAt: (parent) => {
	// 		return parent.createdAt.toISOString();
	// 	},
	// },
	Query: {
		...userResolvers.Query,
		...messageResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...messageResolvers.Mutation,
	},
};
