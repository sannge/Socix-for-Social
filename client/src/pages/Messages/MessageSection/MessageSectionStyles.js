import { makeStyles } from "@material-ui/core";

//MessageSection and Message component's styles

const useStyles = makeStyles((theme) => ({
	MessageSection: {
		marginTop: "10px",
		padding: "10px",
		marginLeft: "5px",
		width: "100%",
		background: "white",
		height: "87vh",
		minWidth: "300px",
	},
	messagesLoadingContainer: {
		display: "flex",
		height: "77.33vh",
		justifyContent: "center",
		alignItems: "center",
	},
	messageBox: {
		paddingBottom: "7px",
		height: "88%",
		display: "flex",
		flexDirection: "column-reverse",
		overflowY: "scroll",
		overflowX: "hidden",
		scrollbarWidth: "none",
		"&::-webkit-scrollbar": {
			display: "none",
		},
	},
	firstMessageContainer: {
		display: "flex",
		width: "100%",
		justifyContent: "flex-end",
	},
	eachMessageContainer1: {
		display: "flex",
		margin: "5px 15px",
		marginLeft: "auto",
		maxWidth: "60%",
		wordBreak: "break-word",
	},
	eachMessageContainer1Other: {
		display: "flex",
		margin: "5px 15px",
		marginRight: "auto",
		maxWidth: "60%",
		wordBreak: "break-word",
	},
	eachMessageContainer2: {
		padding: "8px 12px",
		borderRadius: "10px 10px 5px 5px",
		background: "rgb(0, 130, 255)",
		color: "#f4f4f4",
		position: "relative",
		fontWeight: "100",
	},
	eachMessageContainer2Other: {
		background: "rgba(232, 235, 233,0.7)",
		padding: "8px 12px",
		fontWeight: "lighter",
		borderRadius: "10px 10px 5px 5px",
		position: "relative",
		color: "#242424",
	},
	sendAreaContainer: {
		position: "relative",
		width: "100%",
		paddingBottom: "10px",
	},
	styleAnchor: {
		"& a": {
			color: "white",
			textDecoration: "underlined",
		},
	},
	styleAnchorOther: {
		"& a": {
			color: "rgb(0, 130, 255)",
			textDecoration: "underlined",
		},
	},
	sendArea: {
		display: "flex",
		width: "100%",
		maxHeight: "100px",
		background: "white",
		paddingTop: "5px",
		alignItems: "flex-end",
		zIndex: "1000",
	},
	facility: {
		width: "85px",
		display: "flex",
		transition: "all .1s ease-in-out",
	},
	sendAreaIcons: {
		color: "rgb(0, 130, 255)",
	},
	textArea: {
		alignSelf: "center",
		width: "100%",
		position: "relative",
		height: "100%",
	},
	textInputBase: {
		display: "inline-block",
		boxSizing: "border-box",
		width: "100%",
		border: "none",
		background: "#eee",
		padding: "10px 15px",
		marginLeft: "15px",
		outline: "none",
		borderRadius: "20px",
		height: "100%",
		maxHeight: "100px",
		overflowY: "scroll",
	},
	sendIcon: {
		marginLeft: "7px",
		transition: "all .1s ease-in-out",
	},
	paper: {
		borderRadius: "30px",
		alignItems: "center",
		maxHeight: "300px",
	},
	eachReaction: {
		fontSize: "1.7rem",
		padding: "3px",
		cursor: "pointer",
		transition: "font-size .25s ease-in-out",
		"&:hover": {
			fontSize: "2rem",
		},
	},
	emojiPlace: {
		background: "white",
		borderRadius: "20px",
		paddingLeft: "3px",
		paddingRight: "3px",
		position: "absolute",
		bottom: "-13px",
		right: "-10px",
		fontSize: ".9rem",
		zIndex: "1",
	},
	emojiPicker: {
		position: "absolute",
		bottom: "65px",
		left: "100px",
		maxHeight: "300px",
	},
	apartDate: {
		width: "100%",
		display: "flex",
		justifyContent: "center",
		paddingTop: "25px",
		paddingBottom: "13px",
		fontSize: ".8rem",
		color: "#666",
	},
	fillArea: {
		zIndex: "1000000000",
		height: "80px",
		background: "#eee",
		width: "110%",
		marginLeft: "-10px",
		padding: 0,
		margin: 0,
	},
	media: {
		paddingBottom: "25px",
	},
}));

export default useStyles;
