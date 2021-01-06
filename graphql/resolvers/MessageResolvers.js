const { Message } = require("../../models");
const { User } = require("../../models");
const {
	UserInputError,
	AuthenticationError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");

module.exports = {
	Query: {
		//FROM has to be username
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated!");

				const otherUser = await User.findOne({
					where: {
						username: from,
					},
				});

				const thisUser = await User.findOne({
					where: {
						email: user.email,
					},
				});

				if (!otherUser || !thisUser)
					throw new UserInputError("User not found.");

				const usernames = [user.username, otherUser.username];

				const messages = await Message.findAll({
					where: {
						from: { [Op.in]: usernames },
						to: { [Op.in]: usernames },
					},
					order: [["createdAt", "DESC"]],
				});

				return messages;
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},

	Mutation: {
		sendMessage: async (_, { to, content }, { user, pubsub }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");

				const recipient = await User.findOne({
					where: {
						username: to,
					},
				});
				if (!recipient) throw new UserInputError("User not found");
				else if (recipient.email === user.email) {
					throw new UserInputError("You cannot message yourself.");
				}
				if (content.trim() === "") {
					throw new UserInputError("Message is empty");
				}

				const message = await Message.create({
					from: user.username,
					to,
					content,
				});

				pubsub.publish("NEW_MESSAGE", { newMessage: message });

				return message;
			} catch (err) {
				console.log(err);
			}
		},
	},

	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user) {
						throw new AuthenticationError("Unauthenticated");
					}
					return pubsub.asyncIterator(["NEW_MESSAGE"]);
				},
				({ newMessage }, _, { user }) => {
					if (
						newMessage.from === user.username ||
						newMessage.to === user.username
					) {
						return true;
					}
					return false;
				}
			),
		},
	},
};
