import { gql } from "@apollo/client";

export const GET_USERS = gql`
	query getUsers {
		getUsers {
			username
			createdAt
			imageUrl
			latestMessage {
				uuid
				from
				to
				content
				createdAt
			}
		}
	}
`;

export const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			content
			createdAt
			reactions {
				uuid
				content
			}
		}
	}
`;

export const SEND_MESSAGE = gql`
	mutation sendMessage($to: String!, $content: String!) {
		sendMessage(to: $to, content: $content) {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export const NEW_MESSAGE = gql`
	subscription newMessage {
		newMessage {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export const REACT_TO_MESSAGE = gql`
	mutation reactToMessage($uuid: String!, $content: String!) {
		reactToMessage(uuid: $uuid, content: $content) {
			uuid
			content
			createdAt
		}
	}
`;

export const NEW_REACTION = gql`
	subscription newReaction {
		newReaction {
			uuid
			content
			message {
				uuid
				from
				to
			}
		}
	}
`;

export const USER_TYPING = gql`
	mutation userTyping($from: String!, $to: String!) {
		userTyping(from: $from, to: $to)
	}
`;

export const USER_TYPING_SUB = gql`
	subscription userTyping {
		userTyping {
			from
			to
		}
	}
`;
