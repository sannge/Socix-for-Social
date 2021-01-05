import React, { useState } from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";
import { Grid, IconButton } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import MaterialTooltip from "../../../components/Tooltip";

function MessageSection({ messagesLoading }) {
	const [textAreaFocused, setTextAreaFocused] = useState(false);
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
				<>
					<div className={classes.messageBox}>
						{messagesData &&
							messagesData.length > 0 &&
							messagesData.map((message, index) => (
								<Fragment>
									<Message key={message.uuid} message={message} />

									{/* {index === messagesData.length - 1 && (
									<div className={classes.invisible}>
										<hr style={{ margin: "0", color: "white" }} />
									</div>
								)} */}
								</Fragment>
							))}
					</div>
					<div className={classes.sendArea}>
						<div
							style={{ width: `${textAreaFocused ? "40px" : "85px"}` }}
							className={classes.facility}>
							{!textAreaFocused && (
								<MaterialTooltip title='Attach a photo or video'>
									<IconButton className={classes.sendAreaIcons}>
										<ImageIcon />
									</IconButton>
								</MaterialTooltip>
							)}
							<MaterialTooltip title='Choose an emoji'>
								<IconButton className={classes.sendAreaIcons}>
									<EmojiEmotionsIcon />
								</IconButton>
							</MaterialTooltip>
						</div>
						<div className={classes.textArea}>
							<form onSubmit=''>
								<input
									type='text'
									placeholder='Aa'
									onFocus={() => setTextAreaFocused(true)}
									onBlur={() => setTextAreaFocused(false)}
								/>
							</form>
						</div>

						<div className={classes.sendButton}>
							<MaterialTooltip title='Send the message'>
								<IconButton
									className={[classes.sendAreaIcons, classes.sendIcon].join(
										" "
									)}>
									<SendIcon />
								</IconButton>
							</MaterialTooltip>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default MessageSection;
