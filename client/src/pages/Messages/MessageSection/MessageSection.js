import React from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";

function MessageSection({ messagesData, messagesLoading }) {
	const classes = useStyles();

	return (
		<div className={classes.MessageSection}>
			{messagesLoading ? (
				<div className={classes.messagesLoadingContainer}>
					<Loading size={30} />
				</div>
			) : (
				<div>
					{messagesData && messagesData.getMessages.length > 0 ? (
						messagesData.getMessages.map((message) => (
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
