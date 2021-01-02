import { makeStyles } from "@material-ui/core";

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
		height: "100%",
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
		margin: "12px 15px",
		marginLeft: "auto",
		maxWidth: "70%",
	},
	eachMessageContainer1Other: {
		display: "flex",
		margin: "12px 15px",
		marginRight: "auto",
		maxWidth: "70%",
	},
	eachMessageContainer2: {
		padding: "8px 12px",
		borderRadius: "12px 0px 15px 12px",
		color: "black",
		background: "rgb(0, 130, 255)",
		color: "#f4f4f4",
	},
	eachMessageContainer2Other: {
		background: "#ddd",
		padding: "8px 12px",
		borderRadius: "0px 12px 12px 15px",
	},
}));

export default useStyles;
