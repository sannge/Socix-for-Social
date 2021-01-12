const { Message, User, Reaction } = require("../../models");

const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
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
					include: [{ model: Reaction, as: "reactions" }],
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
		reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
			const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
			try {
				if (!reactions.includes(content)) {
					throw new UserInputError("Invalid reaction");
				}

				const username = user ? user.username : "";
				user = await User.findOne({ where: { username } });

				if (!user) {
					throw new AuthenticationError("Unauthenticated");
				}

				const message = await Message.findOne({ where: { uuid } });

				if (!message) {
					throw new UserInputError("message not found");
				}

				if (message.from !== user.username && message.to !== user.username) {
					throw new ForbiddenError("Unauthorized");
				}

				let reaction = await Reaction.findOne({
					where: { messageId: message.id, userId: user.id },
				});

				if (reaction) {
					reaction.content = content;
					await reaction.save();
				} else {
					reaction = await Reaction.create({
						messageId: message.id,
						userId: user.id,
						content,
					});
				}
				// console.log("FROM reactTOMessage: ", pubsub, reaction.toJSON());
				pubsub.publish("REACTION_SUB", { newReaction: reaction.toJSON() });
				return reaction;
			} catch (err) {
				throw err;
			}
		},
		userTyping: (_, { to }, { user, pubsub }) => {
			if (!user) {
				throw new AuthenticationError("Unauthenticated");
			}
			pubsub.publish("USER_TYPING", { userTyping: to });

			return true;
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
		newReaction: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user) {
						throw new AuthenticationError("Unauthenticated");
					}
					return pubsub.asyncIterator(["REACTION_SUB"]);
				},
				async ({ newReaction }, _, { user }) => {
					try {
						const message = await Message.findOne({
							where: { id: newReaction.messageId },
						});

						if (
							message.from === user.username ||
							message.to === user.username
						) {
							return true;
						}
						return false;
					} catch (err) {
						console.log(err);
					}
				}
			),
		},

		userTyping: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user) {
						throw new AuthenticationError("Unauthenticated");
					}
					return pubsub.asyncIterator(["USER_TYPING"]);
				},
				({ userTyping }, _, { user }) => {
					if (userTyping === user.username) {
						console.log(userTyping);
						return true;
					} else {
						return false;
					}
				}
			),
		},
	},
};
