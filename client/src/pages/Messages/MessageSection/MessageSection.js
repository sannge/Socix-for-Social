import React, { useState, useRef, useEffect } from "react";
import Loading from "../../../components/Loading";
import useStyles from "./MessageSectionStyles";
import { useMessageState, useMessageDispatch } from "../../../context/message";
import Message from "./Message";
import { Fragment } from "react";
import { IconButton, Typography, Popover, InputBase } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MaterialTooltip from "../../../components/Tooltip";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../constants/GqlQueries";
import EmojiPicker from "../../../components/EmojiPicker";
import SendIcon from "@material-ui/icons/Send";
import moment from "moment";
import TypingIndicator from "../../../components/TypingIndicator";
import { useAuthState } from "../../../context/auth";

function MessageSection({
	messagesLoading,
	showTyping,
	userTyping,
	typing,
	newMessageData,
}) {
	// const [textAreaFocused, setTextAreaFocused] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const lastMessageRef = useRef(null);

	const [cur, setCur] = useState(0);

	const [pendingMessages, setPendingMessages] = useState([]);
	const [showRetry, setShowRetry] = useState(false);
	const [failedMessages, setFailedMessages] = useState([]);

	const open = Boolean(anchorEl);

	const classes = useStyles();

	const { users, selectedUser } = useMessageState();

	const selectedUserIndex = users?.findIndex(
		(u) => u.username === selectedUser?.username
	);

	const messageDispath = useMessageDispatch();

	const { user } = useAuthState();

	const inputRef = useRef(null);
	const submitRef = useRef(null);

	const messagesData = users?.find((u) => u.username === selectedUser?.username)
		?.messages;

	const [sendMessage, { loading: sendMessageLoading }] = useMutation(
		SEND_MESSAGE,
		{
			onError: (err) => {
				console.log(err);
				const copyPendingMessages = [...pendingMessages];
				for (let i = 0; i < copyPendingMessages.length; i++) {
					copyPendingMessages[i] = { ...copyPendingMessages[i] };
				}
				setFailedMessages(copyPendingMessages);
				setShowRetry(true);
			},
			//Add a unique id like Date.now() or something so that we can match those two and delete the one from pending
			onCompleted: (data) => {
				const sentMessage = { ...data.sendMessage };

				let copyPendingMessages = [...pendingMessages];

				const sentMessageIndex = copyPendingMessages.findIndex(
					(m) => m.pendingID === sentMessage.pendingID
				);
				copyPendingMessages.splice(sentMessageIndex, 1);
				setPendingMessages(copyPendingMessages);
			},
		}
	);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.selectionEnd = cur;
		}
	}, [setCur, cur]);

	useEffect(() => {
		let time = null;
		if (
			(newMessageData?.newMessage?.from === selectedUser?.username ||
				newMessageData?.newMessage?.to === selectedUser?.username) &&
			lastMessageRef.current &&
			lastMessageRef.current.scrollTop
		) {
			time = setTimeout(() => {
				lastMessageRef.current.scrollTop = lastMessageRef.current?.scrollHeight;
			}, 200);
		}
		return () => clearTimeout(time);
	}, [newMessageData]);

	useEffect(() => {
		let time = null;
		if (
			typing?.userTyping.from === selectedUser?.username &&
			lastMessageRef.current &&
			lastMessageRef.current.scrollTop
		) {
			time = setTimeout(() => {
				lastMessageRef.current.scrollTop = lastMessageRef.current?.scrollHeight;
			}, 100);
		}
		return () => clearTimeout(time);
	}, [typing]);

	const submitMessageHandler = (e) => {
		e.preventDefault();
		if (users[selectedUserIndex].previewContent.trim() === "") return;

		//deep copying pending message
		setPendingMessages((prevMessages) => {
			let copyPrevMessages = [...prevMessages];
			for (let i = 0; i < copyPrevMessages.length; i++) {
				copyPrevMessages[i] = { ...copyPrevMessages[i] };
			}
			let newPendingMessageObject = {
				from: user.username,
				to: selectedUser.username,
				content: users[selectedUserIndex].previewContent,
				reactions: [],
				pendingID: Date.now(),
			};
			copyPrevMessages.push(newPendingMessageObject);

			return copyPrevMessages;
		});

		messageDispath({
			type: "CLEAR_PREVIEWCONTENT",
			payload: {
				index: selectedUserIndex,
				previewContent: users[selectedUserIndex].previewContent,
			},
		});

		sendMessage({
			variables: {
				to: selectedUser.username,
				content: users[selectedUserIndex].previewContent,
				pendingID: "" + Date.now(),
			},
		});
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
		const start = users[selectedUserIndex].previewContent.substring(
			0,
			ref.selectionStart
		);
		const end = users[selectedUserIndex].previewContent.substring(
			ref.selectionStart
		);
		const text = start + emoji + end;
		messageDispath({
			type: "SET_PREVIEWCONTENT",
			payload: { selectedUser, previewContent: text },
		});
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
		if (
			users[selectedUserIndex].previewContent.length !== 0 &&
			users[selectedUserIndex].previewContent.length % 5 === 0
		) {
			userTyping({
				variables: { from: user.username, to: selectedUser.username },
			});
		}
	};

	const messageRetryHandler = (message) => {
		const {
			to: messageTo,
			content: messageContent,
			pendingID: messagePendingID,
		} = message;
		let copyPendingMessages = [...pendingMessages];
		const copyPendingMessageIndex = copyPendingMessages.findIndex((m) => {
			return m.pendingID === messagePendingID;
		});

		copyPendingMessages.splice(copyPendingMessageIndex, 1);

		//set the fail message without the last pending message
		let copyOfCopyPendingMessages = [...copyPendingMessages];
		for (let i = 0; i < copyOfCopyPendingMessages.length; i++) {
			copyOfCopyPendingMessages[i] = { ...copyOfCopyPendingMessages[i] };
		}
		setFailedMessages(copyOfCopyPendingMessages);

		copyPendingMessages.push(message);
		//for pending messages, that will also include the last message
		let copyOfCopyPendingMessages2 = [...copyPendingMessages];
		for (let i = 0; i < copyOfCopyPendingMessages2.length; i++) {
			copyOfCopyPendingMessages2[i] = { ...copyOfCopyPendingMessages2[i] };
		}
		setPendingMessages(copyOfCopyPendingMessages2);

		sendMessage({
			variables: {
				to: messageTo,
				content: messageContent,
				pendingID: "" + Date.now(),
			},
		});
	};

	return (
		<div className={classes.MessageSection}>
			{messagesLoading ? (
				<div className={classes.messagesLoadingContainer}>
					<Loading size={30} />
				</div>
			) : (
				<>
					<div ref={lastMessageRef} className={classes.messageBox}>
						{showTyping && selectedUser?.username === typing.userTyping.from && (
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
						{/* Pending messages and failed messages area */}
						{showRetry && (
							<div>
								{failedMessages?.map((m) => {
									return (
										<Message
											ref={lastMessageRef}
											messageRetryHandler={messageRetryHandler}
											noShow={selectedUser.username !== m.to}
											key={m.pendingID}
											pending
											showRetry={showRetry}
											message={m}
										/>
									);
								})}
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
				</>
			)}
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
						{users && users[selectedUserIndex] && (
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
									value={users[selectedUserIndex].previewContent}
									onChange={(e) => {
										messageDispath({
											type: "SET_PREVIEWCONTENT",
											payload: {
												selectedUser,
												previewContent: e.target.value,
											},
										});
										callTypingIndicator();
									}}
								/>
							</form>
						)}
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
		</div>
	);
}

export default MessageSection;
