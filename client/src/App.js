import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";

import NavBar from "./components/NavBar";
import { useAuthState } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";

import { useMessageState, useMessageDispatch } from "./context/message";

import { useSubscription } from "@apollo/client";
import { NEW_MESSAGE, NEW_REACTION } from "./pages/constants/GqlQueries";

function App() {
	const { user } = useAuthState();
	const { users, selectedUser } = useMessageState();

	const [showTyping, setShowTyping] = useState(false);

	const messageDispatch = useMessageDispatch();

	const { data: newMessageData, error: newMessageError } = useSubscription(
		NEW_MESSAGE
	);

	const { data: reactionData, error: reactionError } = useSubscription(
		NEW_REACTION
	);

	useEffect(() => {
		if (newMessageError) {
			console.log(newMessageError);
		}
		if (newMessageData) {
			if (newMessageData.newMessage.from === selectedUser?.username) {
				setShowTyping(false);
			}
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
		if (reactionError) {
			console.log(reactionError);
		} else if (reactionData) {
			console.log("reactionData: ", reactionData.newReaction);
			const reaction = reactionData.newReaction;
			const otherUser =
				user.username === reaction.message.to
					? reaction.message.from
					: reaction.message.to;
			messageDispatch({
				type: "ADD_REACTION",
				payload: { username: otherUser, reaction },
			});
		}
	}, [reactionError, reactionData]);

	return (
		<Router>
			<div>
				{localStorage.getItem("token") && (
					<div className={classes.NavBar}>
						<NavBar />
					</div>
				)}
				<div className={classes.App}>
					<Switch>
						<DynamicRoute exact path='/' component={Home} authenticated />
						<DynamicRoute path='/register' component={Register} guest />
						<DynamicRoute path='/login' component={Login} guest />
						<DynamicRoute
							path='/messages'
							render={() => (
								<Messages
									reactionData={reactionData}
									reactionError={reactionError}
									showTyping={showTyping}
									setShowTyping={setShowTyping}
									newMessageData={newMessageData}
									newMessageError={newMessageError}
								/>
							)}
							authenticated
						/>
						<DynamicRoute path='/profile' component={Profile} authenticated />

						<Redirect to='/' component={Home} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
