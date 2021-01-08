import EmojiPicker from "emoji-picker-react";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
	container: {
		width: "100%",
		maxHeight: "100%",
		overflowY: "auto",
		backgroundColor: "white",
		borderRadius: "10px",
	},
}));

const EmojiPickerComponent = ({ pickEmoji }) => {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<EmojiPicker onEmojiClick={pickEmoji} />
		</div>
	);
};

export default EmojiPickerComponent;
