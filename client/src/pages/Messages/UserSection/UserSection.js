import React from "react";
import useStyles from "./UserSectionStyle";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, Typography } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import { useMessageState, useMessageDispatch } from "../../../context/message";
import TypingIndicator from "../../../components/TypingIndicator";

function UserSection({ timeOutputHandler, users, showTyping, typing }) {
	const classes = useStyles();
	const authState = useAuthState();

	const { selectedUser } = useMessageState();
	const messageDispatch = useMessageDispatch();

	return (
		<div className={classes.userSection}>
			<div className={classes.searchBar}>
				<SearchIcon className='icon' />
				<input type='text' placeholder={`Search`} />
			</div>
			{users &&
				users.map((user) => (
					<div
						onClick={() =>
							messageDispatch({
								type: "SET_SELECTED_USER",
								payload: user.username,
							})
						}
						key={user.username}>
						<div className={classes.userContainer}>
							<div
								className={[
									selectedUser?.username === user.username &&
										classes.backgroundSelected,
									classes.userInnerContainer,
								].join(" ")}>
								<Avatar
									sizes='xl'
									className={classes.avatar}
									src={user.imageUrl}
								/>
								{window.innerWidth < 960 ? (
									""
								) : (
									<div className={classes.latestMessageContainer}>
										<Typography variant='body1'>{user.username}</Typography>
										<div className={classes.messageAndTime}>
											<div style={{ width: "220px" }}>
												<Typography
													style={{ color: "#666" }}
													variant='body2'
													noWrap>
													{showTyping &&
													typing.userTyping.from === user.username
														? ""
														: user.latestMessage?.from ===
																authState.user.username && "You: "}
													{showTyping &&
													typing.userTyping.from === user.username ? (
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
													) : user.latestMessage &&
													  user.latestMessage.content ? (
														user.latestMessage.content
													) : (
														"You are now connected!"
													)}
												</Typography>
											</div>
											<div style={{ width: "40px" }}>
												<Typography variant='body2' style={{ color: "#666" }}>
													{!showTyping &&
														user.latestMessage &&
														timeOutputHandler(user.latestMessage.createdAt)}
												</Typography>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}

export default UserSection;
