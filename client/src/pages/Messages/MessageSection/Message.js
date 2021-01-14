import React, { useState, useRef, useEffect } from "react";
import useStyles from "./MessageSectionStyles";
import { Typography, Popover } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import MaterialTooltip from "../../../components/Tooltip";
import moment from "moment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useMutation } from "@apollo/client";
import { REACT_TO_MESSAGE } from "../../constants/GqlQueries";
import Linkify from "react-linkify";
import { ReactTinyLink } from "react-tiny-link";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

function Index({ message }) {
	const [showOptions, setShowOptions] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const { user } = useAuthState();
	const messageContentAnchorRef = useRef(null);
	const eachMessageContainer2Ref = useRef(null);

	const [anchor, setAnchor] = useState(null);

	const sent = message.from === user.username;
	const received = !sent;

	const reactionIcons = [...new Set(message.reactions.map((r) => r.content))];

	const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
		onError: (err) => console.log(err),
		onCompleted: (data) => console.log(data),
	});

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
		const anchorTags = messageContentAnchorRef?.current?.children;

		if (anchorTags.length >= 1) {
			setAnchor(anchorTags[0].href);
		}
		for (let i = 0; i < anchorTags.length; i++) {
			anchorTags[i].target = "_blank";
		}
	}, [messageContentAnchorRef]);

	return (
		<div
			className={classes.firstMessageContainer}
			onMouseEnter={() => setShowOptions(true)}
			onMouseLeave={() => setShowOptions(false)}>
			<div
				style={{
					display: "flex",
					flexFlow: "column",
					justifyContent: "center",
				}}
				className={
					sent
						? classes.eachMessageContainer1
						: classes.eachMessageContainer1Other
				}>
				{sent && reactButton}
				<div
					ref={eachMessageContainer2Ref}
					className={
						sent
							? classes.eachMessageContainer2
							: classes.eachMessageContainer2Other
					}>
					{message.reactions.length > 0 && (
						<div style={{ color: "#777777" }} className={classes.emojiPlace}>
							{reactionIcons}
							{message.reactions.length}
						</div>
					)}
					<MaterialTooltip
						title={moment(message.createdAt).format("MMMM DD, YYYY, h:mm a")}
						placement={sent ? "left" : "right"}>
						<Typography variant='body1' component='p'>
							<Linkify>
								<div
									ref={messageContentAnchorRef}
									className={classes.styleAnchor}>
									{message.content}
								</div>
							</Linkify>
						</Typography>
					</MaterialTooltip>
				</div>
				{received && reactButton}
				{anchor && (
					<div>
						<ReactTinyLink
							cardSize='small'
							showGraphic={true}
							maxLine={2}
							onError={() => setAnchor(false)}
							minLine={1}
							url={anchor}
						/>
					</div>
				)}
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
