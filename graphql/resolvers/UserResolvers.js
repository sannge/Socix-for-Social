const { Message, User } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.json");
const { Op } = require("sequelize");

module.exports = {
	Query: {
		getUsers: async (_, __, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");
				let users = await User.findAll({
					attributes: ["username", "imageUrl", "createdAt"],
					where: {
						email: {
							[Op.ne]: user.email,
						},
					},
				});

				const userObject = await User.findOne({
					where: {
						email: user.email,
					},
				});

				//find all the messages in descedning time, meaning latest first,
				//where current user send to or receive from
				const allUserMessages = await Message.findAll({
					where: {
						[Op.or]: [
							{ from: userObject.username },
							{ to: userObject.username },
						],
					},
					order: [["createdAt", "DESC"]],
				});

				//this point, first message will be latest because of 'DESC',
				//add message to each user, and then return
				users = users.map((otherUser) => {
					const latestMessage = allUserMessages.find(
						(m) => m.from === otherUser.username || m.to === otherUser.username
					);
					otherUser.latestMessage = latestMessage;
					// console.log("LATEST MESSAGE: ", latestMessage);
					return otherUser;
				});

				//filter out the users that only have messaged at least once.
				// users = users.filter((user) => user.latestMessage !== undefined);
				// console.log("USERS: ", users);
				return users;
			} catch (err) {
				throw err;
			}
		},

		login: async (_, args) => {
			const { email, password } = args;
			let errors = {};

			try {
				if (email.trim() === "") errors.email = "username must not be empty";
				if (password === "") errors.password = "password must not be empty";

				if (Object.keys(errors).length > 0) {
					throw new UserInputError("bad input", { errors });
				}

				const user = await User.findOne({
					where: { email: email },
				});

				if (!user) {
					errors.email = "User not found!";
					throw new UserInputError("user not found", { errors });
				}

				const correctPassword = await bcrypt.compare(password, user.password);

				if (!correctPassword) {
					errors.password = "Password is incorrect!";
					throw new UserInputError("Password is incorrect", { errors });
				}

				const token = jwt.sign(
					{
						email: email,
						username: user.username,
						createdAt: user.createdAt.toISOString(),
						imageUrl: user.imageUrl,
					},
					JWT_SECRET,
					{ expiresIn: "1h" }
				);
				return {
					...user.toJSON(),
					token,
				};
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},

	Mutation: {
		register: async (_, args) => {
			let { username, email, password, confirmPassword } = args;
			let errors = {};
			try {
				//Validate input data
				if (email.trim() === "") errors.email = "Email must not be empty";
				if (username.trim() === "")
					errors.username = "Username must not be empty";
				if (password.trim() === "")
					errors.password = "Password must not be empty";
				if (confirmPassword.trim() === "")
					errors.confirmPassword = "Repeated Password must not be empty";
				//TODO validate email and password strictly

				//ToDO check if username/email exists
				// const userByUsername = await User.findOne({where: {username}})
				// const userByEmail = await User.findOne({where:{email}})

				// if(userByUsername) errors.username= "Username is taken"
				// if(userByEmail) errors.email = "Email is taken"

				if (password !== confirmPassword)
					errors.confirmPassword = "Password must match";

				if (Object.keys(errors).length > 0) {
					throw errors;
				}

				// hash password
				password = await bcrypt.hash(password, 6);

				const user = await User.create({
					username,
					email,
					password,
				});

				//TODO return user
				return user;
			} catch (err) {
				if (err.name === "SequelizeUniqueConstraintError") {
					err.errors.forEach((e) => {
						path = e.path.replace("users.", "");
						errors[path] = `${path} is already taken`;
					});
				} else if (err.name === "SequelizeValidationError") {
					err.errors.forEach((e) => (errors[e.path] = e.message));
				}
				throw new UserInputError("Bad input", { errors });
			}
		},
	},
};
