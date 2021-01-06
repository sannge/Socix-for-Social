import React, { useState } from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState, useMessageDispatch } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";
import { IconButton, Typography } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import SendIcon from "@material-ui/icons/Send";
import MaterialTooltip from "../../../components/Tooltip";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../constants/GqlQueries";

function MessageSection({ messagesLoading }) {
	const [textAreaFocused, setTextAreaFocused] = useState(false);
	const [content, setContent] = useState("");

	const classes = useStyles();

	const { users, selectedUser } = useMessageState();
	const messageDispatch = useMessageDispatch();

	const messagesData = users?.find((u) => u.username === selectedUser?.username)
		?.messages;

	const [sendMessage] = useMutation(SEND_MESSAGE, {
		onError: (err) => console.log(err),
		// onCompleted: (data) =>
		// 	messageDispatch({
		// 		type: "ADD_MESSAGE",
		// 		payload: {
		// 			username: selectedUser.username,
		// 			message: data.sendMessage,
		// 		},
		// 	}),
	});

	const submitMessageHandler = (e) => {
		e.preventDefault();
		if (content.trim() === "") return;
		setContent("");
		sendMessage({ variables: { to: selectedUser.username, content } });
	};

	return (
		<div className={classes.MessageSection}>
			{messagesLoading ? (
				<div className={classes.messagesLoadingContainer}>
					<Loading size={30} />
				</div>
			) : (
				<>
					<div className={classes.messageBox}>
						{messagesData?.length > 0 ? (
							messagesData.map((message, index) => (
								<Fragment key={message.uuid}>
									<Message message={message} />

									{/* {index === messagesData.length - 1 && (
									<div className={classes.invisible}>
										<hr style={{ margin: "0", color: "white" }} />
									</div>
								)} */}
								</Fragment>
							))
						) : (
							<div
								style={{
									width: "100%",
									marginBottom: "10px",
									display: "flex",
									justifyContent: "center",
									color: "#666666",
								}}>
								<Typography variant='body2'>You are now connected!</Typography>
							</div>
						)}
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
								<IconButton
									onClick={() => {}}
									className={classes.sendAreaIcons}>
									<EmojiEmotionsIcon />
								</IconButton>
							</MaterialTooltip>
						</div>
						<div
							// style={{
							// 	marginRight: !textAreaFocused ? "10px" : "0",
							// }}
							style={{ marginRight: "20px" }}
							className={classes.textArea}>
							<form onSubmit={submitMessageHandler}>
								<input
									type='text'
									placeholder='Aa'
									onFocus={() => setTextAreaFocused(true)}
									onBlur={() => setTextAreaFocused(false)}
									value={content}
									onChange={(e) => setContent(e.target.value)}
								/>
							</form>
						</div>

						{/* {textAreaFocused && (
							<div className={classes.sendButton}>
								<MaterialTooltip title='Send the message'>
									<IconButton
										onClick={submitMessageHandler}
										className={[classes.sendAreaIcons, classes.sendIcon].join(
											" "
										)}>
										<SendIcon />
									</IconButton>
								</MaterialTooltip>
							</div>
						)} */}
					</div>
				</>
			)}
		</div>
	);
}

export default MessageSection;
