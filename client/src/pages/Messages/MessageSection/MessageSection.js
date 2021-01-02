import React from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState } from "../../../context/message";

function MessageSection({ messagesLoading }) {
	const classes = useStyles();
	const { users, selectedUser } = useMessageState();
	const messagesData = users?.find((u) => u.username === selectedUser?.username)
		?.messages;

	return (
		<div className={classes.MessageSection}>
			{messagesLoading ? (
				<div className={classes.messagesLoadingContainer}>
					<Loading size={30} />
				</div>
			) : (
				<div>
					{messagesData && messagesData.length > 0 ? (
						messagesData.map((message) => (
							<p key={message.uuid}>{message.content}</p>
						))
					) : (
						<div>You are now connected!</div>
					)}
				</div>
			)}
		</div>
	);
}

export default MessageSection;
