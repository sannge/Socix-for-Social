import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";
import { IconButton, Typography, Popover, InputBase } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MaterialTooltip from "../../../components/Tooltip";
import { useMutation, useSubscription } from "@apollo/client";
import {
	SEND_MESSAGE,
	USER_TYPING,
	USER_TYPING_SUB,
} from "../../constants/GqlQueries";
import EmojiPicker from "../../../components/EmojiPicker";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";
import TypingIndicator from "../../../components/TypingIndicator";

function MessageSection({ messagesLoading }) {
	// const [textAreaFocused, setTextAreaFocused] = useState(false);
	const [content, setContent] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [showTyping, setShowTyping] = useState(false);
	const [cur, setCur] = useState(0);

	const open = Boolean(anchorEl);

	const classes = useStyles();

	const { users, selectedUser } = useMessageState();

	const inputRef = useRef(null);
	const submitRef = useRef(null);

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

	const [userTyping] = useMutation(USER_TYPING);

	const { data: typing, error: typingError } = useSubscription(USER_TYPING_SUB);

	useEffect(() => {
		inputRef.current.selectionEnd = cur;
	}, [setCur, cur]);

	useEffect(() => {
		console.log(typing);
		let time = null;
		if (typing) {
			console.log("Typing");
			setShowTyping(true);
			time = setTimeout(() => setShowTyping(false), 2000);
		}
		return () => clearTimeout(time);
	}, [typing, typingError]);

	const submitMessageHandler = (e) => {
		e.preventDefault();
		if (content.trim() === "") return;
		setContent("");
		sendMessage({ variables: { to: selectedUser.username, content } });
	};

	const emojiHandler = (e) => {
		inputRef.current.focus();
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onEmojiClick = (e, { emoji }) => {
		e.preventDefault();
		//for selecting textarea
		const ref = inputRef.current.children[0];
		const start = content.substring(0, ref.selectionStart);
		const end = content.substring(ref.selectionStart);
		const text = start + emoji + end;
		setContent(text);
		setCur(start.length + emoji.length);
	};

	const handleKeyDown = (e) => {
		if (e.which === 13) {
			e.preventDefault();
			const textArea = inputRef.current.children[0];
			textArea.style.height = "auto"; //<------resize text area
			submitRef.current.click();
		}
	};

	const callTypingIndicator = () => {
		if (content.length !== 0 && content.length % 5 === 0) {
			userTyping({ variables: { to: selectedUser.username } });
		}
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
						{showTyping && (
							<div className={classes.firstMessageContainer}>
								<div className={classes.eachMessageContainer1Other}>
									<div className={classes.eachMessageContainer2Other}>
										<div className={classes.typingIndicator}>
											<TypingIndicator />
										</div>
									</div>
								</div>
							</div>
						)}

						{messagesData?.length > 0 ? (
							messagesData.map((message, index) => (
								<Fragment key={message.uuid}>
									<Message message={message} />

									{/* {index === messagesData.length - 1 && (
									<div className={classes.invisible}>
										<hr style={{ margin: "0", color: "white" }} />
									</div>
								)} */}

									{(index === messagesData.length - 1 ||
										(messagesData[index + 1] &&
											(new Date(message.createdAt) -
												new Date(messagesData[index + 1].createdAt)) /
												1000 /
												60) > 60) && (
										<div className={classes.apartDate}>
											{moment(message.createdAt).format("MM/DD/YYYY, h:mm a")}
										</div>
									)}
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

					<div className={classes.sendAreaContainer}>
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
									<InputBase
										onKeyDown={handleKeyDown}
										className={classes.textInputBase}
										multiline
										ref={inputRef}
										type='text'
										placeholder='Aa'
										// onFocus={() => setTextAreaFocused(true)}
										// onBlur={() => setTextAreaFocused(false)}
										value={content}
										onChange={(e) => {
											setContent(e.target.value);
											callTypingIndicator();
										}}
									/>
								</form>
							</div>

							{
								<div className={classes.sendButton}>
									<MaterialTooltip title='Send the message'>
										<IconButton
											ref={submitRef}
											onClick={submitMessageHandler}
											className={[classes.sendAreaIcons, classes.sendIcon].join(
												" "
											)}>
											<SendIcon />
										</IconButton>
									</MaterialTooltip>
								</div>
							}
						</div>
					</div>
					<div className={classes.fillArea}></div>
				</>
			)}
		</div>
	);
}

export default MessageSection;
