const { Message } = require("../../models");
const { User } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
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
		sendMessage: async (_, { to, content }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");

				const recipient = await User.findOne({
					where: {
						email: to,
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
