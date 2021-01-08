import React, { useState, useEffect } from "react";
import useStyles from "./MessageSectionStyles";
import { Typography, Popover } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import { useMessageDispatch } from "../../../context/message";
import MaterialTooltip from "../../../components/Tooltip";
import moment from "moment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useMutation, useSubscription } from "@apollo/client";
import { REACT_TO_MESSAGE, NEW_REACTION } from "../../constants/GqlQueries";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

function Index({ message }) {
	const [showOptions, setShowOptions] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const { user } = useAuthState();
	const messageDispatch = useMessageDispatch();

	const sent = message.from === user.username;
	const received = !sent;

	const reaectionIcons = [...new Set(message.reactions.map((r) => r.content))];

	const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
		onError: (err) => console.log(err),
		onCompleted: (data) => console.log(data),
	});

	const { data: reactionData, error: reactionError } = useSubscription(
		NEW_REACTION
	);
	//style
	const classes = useStyles();

	const open = Boolean(anchorEl);

	const handlePopUpClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setShowOptions(false);
	};

	const react = (reaction) => {
		reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
		setAnchorEl(null);
		setShowOptions(false);
	};

	const reactButton = (
		<div
			onClick={handlePopUpClick}
			style={{
				marginRight: "10px",
				marginLeft: "10px",
				cursor: "pointer",
				color: showOptions ? "black" : "transparent",
			}}>
			<InsertEmoticonIcon style={{ opacity: ".2" }} />
		</div>
	);

	useEffect(() => {
		if (reactionError) {
			console.log(reactionError);
		}
		if (reactionData) {
			const reaction = reactionData.newReaction;
			const otherUser =
				user.username === reaction.message.to
					? reaction.message.from
					: reaction.message.to;
			messageDispatch({
				type: "ADD_REACTION",
				payload: { username: otherUser, reaction },
			});
		}
	}, [reactionError, reactionData]);

	return (
		<div
			className={classes.firstMessageContainer}
			onMouseEnter={() => setShowOptions(true)}
			onMouseLeave={() => setShowOptions(false)}>
			<div
				style={{ display: "flex", alignItems: "center" }}
				className={
					sent
						? classes.eachMessageContainer1
						: classes.eachMessageContainer1Other
				}>
				{sent && reactButton}
				<div
					className={
						sent
							? classes.eachMessageContainer2
							: classes.eachMessageContainer2Other
					}>
					{message.reactions.length > 0 && (
						<div style={{ color: "#777777" }} className={classes.emojiPlace}>
							{reaectionIcons}
							{message.reactions.length}
						</div>
					)}
					<MaterialTooltip
						title={moment(message.createdAt).format("MMMM DD, YYYY, h:mm a")}
						placement={sent ? "left" : "right"}>
						<Typography variant='body1' component='p'>
							{message.content}
						</Typography>
					</MaterialTooltip>
				</div>
				{received && reactButton}
			</div>
			<Popover
				classes={{
					paper: classes.paper,
				}}
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
				}}>
				<div style={{ display: "flex" }}>
					{reactions.map((r) => (
						<div
							className={classes.eachReaction}
							onClick={() => react(r)}
							key={r}>
							{r}
						</div>
					))}
				</div>
			</Popover>
		</div>
	);
}

export default Index;
