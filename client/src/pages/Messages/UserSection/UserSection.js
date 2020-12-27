import React from "react";
import useStyles from "./UserSectionStyle";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, Typography } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";

function UserSection({
	timeOutputHandler,
	data,
	selectedUser,
	setSelectedUser,
}) {
	const classes = useStyles();
	const authState = useAuthState();

	return (
		<div className={classes.userSection}>
			<div className={classes.searchBar}>
				<SearchIcon className='icon' />
				<input type='text' placeholder={`Search`} />
			</div>
			{data.getUsers.map((user) => (
				<div onClick={() => setSelectedUser(user.username)} key={user.username}>
					<div className={classes.userContainer}>
						<div
							className={[
								selectedUser === user.username && classes.backgroundSelected,
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
												{user.latestMessage?.from === authState.user.username &&
													"You: "}
												{user.latestMessage?.content}
											</Typography>
										</div>
										<div style={{ width: "40px" }}>
											<Typography variant='body2' style={{ color: "#666" }}>
												{user.latestMessage &&
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
