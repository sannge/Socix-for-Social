const userResolvers = require("./UserResolvers");
const messageResolvers = require("./MessageResolvers");
const { Message, User } = require("../../models");

module.exports = {
	//Message resolver
	Message: {
		createdAt: (parent) => {
			// console.log(
			// 	"Message PARENT.CREATEDAT: ",
			// 	parent.createdAt,
			// 	parent.createdAt.toISOString()
			// );
			if (typeof parent.createdAt !== "string") {
				return parent.createdAt.toISOString();
			}
			return parent.createdAt;
		},
	},
	Reaction: {
		createdAt: (parent) => {
			console.log("PARENT.CREATEDAT: ", parent.createdAt);
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
