import React from "react";
import LastMessageTimeView from './LastMessageTimeView';

function EachUser({
	messageDispatch,
	user,
	classes,
	selectedUser,
	Avatar,
	Typography,
	showTyping,
	typing,
	authState,
	TypingIndicator,
	timeOutputHandler,
}) {
	return (
		<div
			onClick={() =>
				{
					if(user.username !== selectedUser.username) {
						messageDispatch({
							type: "SET_SELECTED_USER",
							payload: user.username,
						})
					}
				}
			}>
			<div className={classes.userContainer}>
				<div
					className={[
						selectedUser?.username === user.username &&
							classes.backgroundSelected,
						classes.userInnerContainer,
					].join(" ")}>
					<Avatar sizes='xl' className={classes.avatar} src={user.imageUrl} />
					{window.innerWidth < 960 ? (
						""
					) : (
						<div className={classes.latestMessageContainer}>
							<Typography variant='body1'>{user.username}</Typography>
							<div className={classes.messageAndTime}>
								<div style={{ width: "220px" }}>
									<Typography style={{ color: "#666" }} variant='body2' noWrap>
										{showTyping && typing.userTyping.from === user.username
											? ""
											: user.latestMessage?.from === authState.user.username &&
											  "You: "}
										{showTyping && typing.userTyping.from === user.username ? (
											<div
												style={{
													background: "#ccc",
													padding: "3px",
													width: "30px",
													borderRadius: "20px",
													display: "flex",
													justifyContent: "center",
												}}>
												<TypingIndicator />
											</div>
										) : user.latestMessage && user.latestMessage.content ? (
											user.latestMessage.content
										) : (
											"You are now connected!"
										)}
									</Typography>
								</div>
								<div style={{ width: "40px" }}>
									<Typography variant='body2' style={{ color: "#666" }}>
										{showTyping && typing.userTyping.from === user.username
											? ""
											: user.latestMessage &&
											 <LastMessageTimeView  timeOutputHandler={timeOutputHandler} timeOutput={user.latestMessage.createdAt}/>}
									</Typography>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default EachUser;
