import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";
import { IconButton, Typography, Popover } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MaterialTooltip from "../../../components/Tooltip";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../constants/GqlQueries";
import EmojiPicker from "../../../components/EmojiPicker";

function MessageSection({ messagesLoading }) {
	// const [textAreaFocused, setTextAreaFocused] = useState(false);
	const [content, setContent] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [cur, setCur] = useState(0);

	const open = Boolean(anchorEl);

	const classes = useStyles();

	const { users, selectedUser } = useMessageState();

	const inputRef = useRef(null);

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

	useEffect(() => {
		console.log("triggered");
		inputRef.current.selectionEnd = cur;
	}, [setCur, cur]);

	const submitMessageHandler = (e) => {
		e.preventDefault();
		if (content.trim() === "") return;
		setContent("");
		sendMessage({ variables: { to: selectedUser.username, content } });
	};

	const emojiHandler = (e) => {
		inputRef.current.focus();
		console.log(inputRef.current);
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onEmojiClick = (e, { emoji }) => {
		e.preventDefault();
		const ref = inputRef.current;
		console.log(ref.selectionStart, ref.selectionEnd);
		const start = content.substring(0, ref.selectionStart);
		const end = content.substring(ref.selectionStart);
		const text = start + emoji + end;
		setContent(text);
		setCur(start.length + emoji.length);
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
					{/* {showEmojis && ( */}
					<Popover
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
						classes={{ paper: classes.emojiPicker }}>
						<EmojiPicker pickEmoji={onEmojiClick} />
					</Popover>
					{/* )} */}
					<div className={classes.sendArea}>
						<div className={classes.facility}>
							{
								<MaterialTooltip title='Attach a photo or video'>
									<IconButton className={classes.sendAreaIcons}>
										<ImageIcon />
									</IconButton>
								</MaterialTooltip>
							}
							<MaterialTooltip title='Choose an emoji'>
								<IconButton
									onClick={(e) => emojiHandler(e)}
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
									ref={inputRef}
									type='text'
									placeholder='Aa'
									// onFocus={() => setTextAreaFocused(true)}
									// onBlur={() => setTextAreaFocused(false)}
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
