import React from "react";
import useStyles from "./UserSectionStyle";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, Typography } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import { useMessageState, useMessageDispatch } from "../../../context/message";
import TypingIndicator from "../../../components/TypingIndicator";
import EachUser from "./EachUser";

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
					<EachUser
						key={user.username}
						messageDispatch={messageDispatch}
						user={user}
						classes={classes}
						selectedUser={selectedUser}
						Avatar={Avatar}
						Typography={Typography}
						showTyping={showTyping}
						typing={typing}
						TypingIndicator={TypingIndicator}
						authState={authState}
						timeOutputHandler={timeOutputHandler}
					/>
				))}
		</div>
	);
}

export default UserSection;
