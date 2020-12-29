import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	MessageSection: {
		marginTop: "10px",
		marginLeft: "5px",
		width: "100%",
		background: "white",
		height: "90vh",
		minWidth: "300px",
	},
	messagesLoadingContainer: {
		display: "flex",
		height: "75vh",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export default useStyles;
