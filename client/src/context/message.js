import React, { createContext, useReducer, useContext } from "react";
const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
	//reducer actions
	let usersCopy, userIndex;
	const { username, message, messages } = action.payload;

	switch (action.type) {
		case "SET_USERS":
			return {
				...state,
				users: action.payload,
			};
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
			let newUser = {
				...usersCopy[userIndex],
				messages: [message, ...usersCopy[userIndex].messages],
			};

			usersCopy[userIndex] = newUser;

			return {
				...state,
				users: usersCopy,
			};
		}

		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
};

export const MessageProvider = ({ children }) => {
	const [state, dispatch] = useReducer(messageReducer, {
		selectedUser: null,
		users: null,
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
