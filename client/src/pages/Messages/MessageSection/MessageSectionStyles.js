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
		height: "75vh",
		justifyContent: "center",
		alignItems: "center",
	},
	messageBox: {
		height: "95%",
		display: "flex",
		flexDirection: "column-reverse",
		overflowY: "scroll",
		scrollbarWidth: "none",
		"&::-webkit-scrollbar": {
			display: "none",
		},
	},
	eachMessageContainer1: {
		display: "flex",
		margin: "5px 15px",
		marginLeft: "auto",
		maxWidth: "70%",
	},
	eachMessageContainer1Other: {
		display: "flex",
		margin: "5px 15px",
		marginRight: "auto",
		maxWidth: "70%",
	},
	eachMessageContainer2: {
		padding: "8px 12px",
		borderRadius: "20px 20px 20px 30px",
		background: "rgb(0, 130, 255)",
		color: "#f4f4f4",
	},
	eachMessageContainer2Other: {
		background: "#ddd",
		padding: "8px 12px",
		borderRadius: "20px 20px 20px 20px",
	},
	sendArea: {
		display: "flex",
		alignItems: "center",
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
		"& input": {
			boxSizing: "border-box",
			width: "100%",
			border: "none",
			background: "#eee",
			padding: "10px 15px",
			marginLeft: "15px",
			outline: "none",
			borderRadius: "20px",
		},
	},
	sendIcon: {
		marginLeft: "23px",
	},
}));

export default useStyles;
