import React, { createContext, useReducer, useContext } from "react";
const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
	//reducer actions
	let usersCopy, userIndex;
	const {
		username,
		message,
		messages,
		reaction,
		previewContent,
		pendingID
	} = action.payload;

	switch (action.type) {
		case "SET_USERS":
			let previewUsers = [];
			for (let i = 0; i < action.payload.length; i++) {
				let previewUser = { ...action.payload[i] };
				previewUser.previewContent = "";
				previewUsers.push(previewUser);
			}
			console.log("BEING CALLED");
			return {
				...state,
				users: previewUsers,
			};

		case "SET_PREVIEWCONTENT": {
			usersCopy = [...state.users];
			let userCopyIndex = usersCopy.findIndex(
				(u) => u.username === state.selectedUser.username
			);
			let userCopy = { ...usersCopy[userCopyIndex] };
			userCopy.previewContent = previewContent;
			usersCopy[userCopyIndex] = { ...userCopy };
			return {
				...state,
				users: [...usersCopy],
			};
		}

		case "CLEAR_PREVIEWCONTENT": {
			usersCopy = [...state.users];
			let userCopy = { ...usersCopy[action.payload.index] };
			userCopy.previewContent = "";
			usersCopy[action.payload.index] = userCopy;

			return {
				...state,
				users: usersCopy,
			};
		}

		case "SET_SELECTED_USER": {
			usersCopy = state.users.map((user) => ({
				...user,
				selected: user.username === action.payload,
			}));
			//added selectedUser key value pair so that when we leave the tab, and come
			//back to it, the states will still kept in here.
			return {
				...state,
				users: usersCopy,
				selectedUser: state.users.find((u) => u.username === action.payload),
			};
		}

		//for choosing user selected message or default start message on component mount
		case "SET_USER_MESSAGES": {
			usersCopy = [...state.users];
			userIndex = usersCopy.findIndex((u) => u.username === username);
			usersCopy[userIndex] = {
				...usersCopy[userIndex],
				messages,
			};
			return {
				...state,
				users: usersCopy,
			};
		}

		case "ADD_MESSAGE": {
			usersCopy = [...state.users];
			userIndex = usersCopy.findIndex((u) => u.username === username);

			message.reactions = [];

			let newUser = {
				...usersCopy[userIndex],
				messages: usersCopy[userIndex]?.messages
					? [message, ...usersCopy[userIndex].messages]
					: null,
				latestMessage: message,
			};

			usersCopy[userIndex] = newUser;

			return {
				...state,
				users: usersCopy,
			};
		}

		case "ADD_REACTION": {
			usersCopy = [...state.users];
			userIndex = usersCopy.findIndex((u) => u.username === username);
			//Make a shallow Copy of User
			let userCopy = { ...usersCopy[userIndex] };

			//find the index of the message that this reaction pertains to
			const messageIndex = userCopy.messages?.findIndex(
				(m) => m.uuid === reaction.message.uuid
			);

			//Make a shallow Copy of User Messages
			if (messageIndex > -1) {
				let messagesCopy = [...userCopy.messages];

				let reactionsCopy = [...messagesCopy[messageIndex].reactions];

				const reactionIndex = reactionsCopy.findIndex(
					(r) => r.uuid === reaction.uuid
				);

				if (reactionIndex > -1) {
					//Reaction exists, update it
					reactionsCopy[reactionIndex] = reaction;
				} else {
					//New reaction, add it
					reactionsCopy = [...reactionsCopy, reaction];
				}

				messagesCopy[messageIndex] = {
					...messagesCopy[messageIndex],
					reactions: reactionsCopy,
				};

				userCopy = {
					...userCopy,
					messages: messagesCopy,
				};

				usersCopy[userIndex] = userCopy;

				return {
					...state,
					users: usersCopy,
				};
			}
		}

		case "SET_PENDING_MESSAGE": {
			const copyPendingMessages = [...state.pendingMessages];

			for (let i = 0; i < copyPendingMessages.length; i++) {
				copyPendingMessages[i] = { ...copyPendingMessages[i] };
			}

			let newPendingMessageObject = {
				from: username,
				to: state.selectedUser.username,
				content: message,
				reactions: [],
				pendingID,
			};

			copyPendingMessages.push(newPendingMessageObject);
			
			return {
				...state,
				pendingMessages: copyPendingMessages
			}
		
		}

		case "REMOVE_PENDING_MESSAGE": {
			const sentMessage = { ...message };

				let copyPendingMessages = [...state.pendingMessages];

				const sentMessageIndex = copyPendingMessages.findIndex(
					(m) => m.pendingID === sentMessage.pendingID
				);
				copyPendingMessages.splice(sentMessageIndex, 1);
				
				return {
					...state,
					pendingMessages: copyPendingMessages,
				}
		}

		case "SET_PENDING_MESSAGES": {
			//for pending messages, that will also include the last message
			return {
				...state,
				pendingMessages: messages,
			}
		}

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
};

export const MessageProvider = ({ children }) => {
	const [state, dispatch] = useReducer(messageReducer, {
		selectedUser: null,
		users: null,
		pendingMessages: []
	});
	return (
		<MessageDispatchContext.Provider value={dispatch}>
			<MessageStateContext.Provider value={state}>
				{children}
			</MessageStateContext.Provider>
		</MessageDispatchContext.Provider>
	);
};

export const useMessageState = () => useContext(MessageStateContext);

export const useMessageDispatch = () => useContext(MessageDispatchContext);
