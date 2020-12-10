const { Message } = require("../../models");
const { User } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");

module.exports = {
	Query: {
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated!");

				const otherUser = await User.findOne({
					where: {
						email: from,
					},
				});

				if (!otherUser) throw new UserInputError("User not found");

				const emails = [user.email, otherUser.email];

				const messages = await Message.findAll({
					where: {
						from: { [Op.in]: emails },
						to: { [Op.in]: emails },
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
		sendMessage: async (_, { to, content }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");

				const recipient = await User.findOne({
					where: {
						email: to,
					},
				});
				if (!recipient) throw new UserInputError("User not found");

				if (content.trim() === "") {
					throw new UserInputError("Message is empty");
				}

				const message = await Message.create({
					from: user.email,
					to,
					content,
				});

				return message;
			} catch (err) {
				console.log(err);
			}
		},
	},
};
