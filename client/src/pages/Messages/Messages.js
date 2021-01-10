import React, { useState, useEffect } from "react";
import { GET_USERS, GET_MESSAGES, NEW_MESSAGE } from "../constants/GqlQueries";
import { useQuery, useLazyQuery, useSubscription } from "@apollo/client";
import ErrorComponent from "../../components/Error";
import { Container } from "@material-ui/core";
import Loading from "../../components/Loading";
// import { useAuthState } from "../../context/auth";
import useStyles from "./MessagesStyle";
import UserSection from "./UserSection/UserSection";
import MessageSection from "./MessageSection/MessageSection";
import { useMessageDispatch, useMessageState } from "../../context/message";
import { useAuthState } from "../../context/auth";

function Messages() {
	const messageDispatch = useMessageDispatch();
	const { users, selectedUser } = useMessageState();

	const { user } = useAuthState();

	const { loading, error } = useQuery(GET_USERS, {
		onCompleted: (data) => {
			messageDispatch({ type: "SET_USERS", payload: data.getUsers });
		},
	});
	const [
		getMessages,
		{ loading: messagesLoading, data: messagesData },
	] = useLazyQuery(GET_MESSAGES);

	const [, setShowLatestMessage] = useState(window.innerWidth >= 960);

	const { data: newMessageData, error: newMessageError } = useSubscription(
		NEW_MESSAGE
	);

	useEffect(() => {
		if (newMessageError) {
			console.log(newMessageError);
		}
		if (newMessageData) {
			console.log("newMessageData: ", newMessageData.newMessage.content);
			const otherUser =
				user.username === newMessageData.newMessage.to
					? newMessageData.newMessage.from
					: newMessageData.newMessage.to;
			messageDispatch({
				type: "ADD_MESSAGE",
				payload: {
					username: otherUser,
					message: newMessageData.newMessage,
				},
			});
		}
	}, [newMessageData, newMessageError]);

	useEffect(() => {
		if (selectedUser && selectedUser.username) {
			getMessages({ variables: { from: selectedUser.username } });
		} else {
			if (users && users[0]) {
				messageDispatch({
					type: "SET_SELECTED_USER",
					payload: users[0].username,
				});
			}
		}
	}, [selectedUser, users]);

	useEffect(() => {
		if (messagesData) {
			messageDispatch({
				type: "SET_USER_MESSAGES",
				payload: {
					username: selectedUser?.username,
					messages: messagesData.getMessages,
				},
			});
		}
	}, [messagesData]);

	useEffect(() => {
		const showlatestMessageHandler = () => {
			if (window.innerWidth < 960) {
				setShowLatestMessage(false);
			} else {
				setShowLatestMessage(true);
			}
		};
		window.addEventListener("resize", showlatestMessageHandler);
	}, []);

	const timeOutputHandler = (date) => {
		const timeSoFar = new Date() - new Date(date);
		if (timeSoFar / 1000 < 1) {
			return " · 1s";
		} else if (timeSoFar / (1000 * 60) < 1) {
			return ` · ${Math.ceil(timeSoFar / 1000)}s`;
		} else if (timeSoFar / (1000 * 60 * 60) < 1) {
			return ` · ${Math.ceil(timeSoFar / (1000 * 60))}m`;
		} else if (timeSoFar / (1000 * 60 * 60 * 24) < 1) {
			return ` . ${Math.ceil(timeSoFar / (1000 * 60 * 60))}h`;
		} else if (timeSoFar / (1000 * 60 * 60 * 24 * 365) < 1) {
			return ` · ${Math.ceil(timeSoFar / (1000 * 60 * 60 * 24))}d`;
		} else {
			return ` · ${Math.ceil(timeSoFar / (1000 * 60 * 60 * 24 * 365))}y`;
		}
	};

	const classes = useStyles();

	return (
		<div style={{ background: "#eee" }}>
			<Container maxWidth='lg'>
				{loading ? (
					<div
						style={{
							width: "100%",
							height: "100vh",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}>
						<Loading size={40} />
					</div>
				) : error ? (
					<div
						style={{
							width: "100%",
							height: "40vh",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}>
						<ErrorComponent alwaysDisplay />
					</div>
				) : (
					// styling the getUsers section like messenger
					<div className={classes.messagesContainer} style={{ width: "100%" }}>
						<UserSection users={users} timeOutputHandler={timeOutputHandler} />
						<MessageSection messagesLoading={messagesLoading} />
					</div>
				)}
			</Container>
		</div>
	);
}

export default Messages;
