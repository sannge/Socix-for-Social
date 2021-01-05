import React from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";

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
				<div className={classes.messageBox}>
					{messagesData && messagesData.length > 0 ? (
						messagesData.map((message, index) => (
							<Fragment>
								<Message key={message.uuid} message={message} />

								{/* {index === messagesData.length - 1 && (
									<div className={classes.invisible}>
										<hr style={{ margin: "0", color: "white" }} />
									</div>
								)} */}
							</Fragment>
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
