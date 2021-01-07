const userResolvers = require("./UserResolvers");
const messageResolvers = require("./MessageResolvers");
const { Message, User } = require("../../models");

module.exports = {
	//Message resolver
	Message: {
		createdAt: (parent) => {
			return parent.createdAt.toISOString();
		},
	},
	Reaction: {
		createdAt: (parent) => {
			return parent.createdAt.toISOString();
		},
		message: async (parent) => await Message.findByPk(parent.messageId),
		user: async (parent) =>
			await User.findByPk(parent.userId, {
				attributes: ["username", "imageUrl", "createdAt"],
			}),
	},
	User: {
		createdAt: (parent) => {
			return parent.createdAt.toISOString();
		},
	},

	Query: {
		...userResolvers.Query,
		...messageResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...messageResolvers.Mutation,
	},
	Subscription: {
		...messageResolvers.Subscription,
	},
};
