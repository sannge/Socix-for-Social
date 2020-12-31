import React, { createContext, useReducer, useContext } from "react";
const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
	//reducer actions
	switch (action.type) {
		case "SET_USERS":
			return {
				...state,
				users: action.payload,
			};
		case "SET_SELECTED_USER": {
			return {
				...state,
				selectedUser: action.payload,
			};
		}

		//for choosing user selected message or default start message on component mount
		case "SET_USER_MESSAGES": {
			const { username, messages } = action.payload;
			return {
				...state,
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
