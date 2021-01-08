import React, { useState } from "react";
import useStyles from "./MessageSectionStyles";
import { Typography, Popover, IconButton } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import MaterialTooltip from "../../../components/Tooltip";
import moment from "moment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { useMutation } from "@apollo/client";
import { REACT_TO_MESSAGE } from "../../constants/GqlQueries";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

function Index({ message }) {
	const [showOptions, setShowOptions] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const { user } = useAuthState();

	const sent = message.from === user.username;
	const received = !sent;

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

	const react = (reaction) => {};

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
