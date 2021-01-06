const { gql } = require("apollo-server");

//omit emails from getUsers resolver
module.exports = gql`
	type User {
		username: String!
		email: String
		createdAt: String!
		token: String
		latestMessage: Message
		imageUrl: String
	}

	type Message {
		uuid: String!
		content: String!
		from: String!
		to: String!
		createdAt: String!
	}

	type Reaction {
		uuid: String!
		content: String!
		createdAt: String!
		Message: Message!
		User: User!
	}

	type Query {
		getUsers: [User]!
		login(email: String!, password: String!): User!
		getMessages(from: String!): [Message]!
	}

	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
		sendMessage(to: String!, content: String!): Message!
		reactToMessage(uuid: String!, content: String!): Reaction!
	}

	type Subscription {
		newMessage: Message!
		newReaction: Reaction!
	}
`;
