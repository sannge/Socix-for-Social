import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	userSection: {
		marginTop: "10px",
		background: "white",
		border: "1px solid #ccc",
		borderTop: "none",
		borderBottom: "none",
		width: "90px",
		height: "84vh",
		minWidth: "100px",
		display: "flex",
		flexFlow: "column",
		paddingTop: "10px",
		overflowY: "scroll",
		[theme.breakpoints.up("md")]: {
			width: "600px",
		},
		// [theme.breakpoints.down("md")]: {

		// },
		overflowY: "scroll",
		overflowX: "hidden",
	},
	userContainer: {
		width: "400px",
	},
	userInnerContainer: {
		display: "flex",
		padding: "20px",
		paddingBottom: "10px",
		cursor: "pointer",
		margin: "10px",
		borderRadius: "12px",
		"&:hover": {
			background: "rgba(100,100,100,0.1)",
		},
		[theme.breakpoints.down("md")]: {
			margin: "5px",
		},
	},
	avatar: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	latestMessageContainer: {
		marginLeft: "10px",
		width: "263px",
	},
	messageAndTime: {
		display: "flex",
	},
	searchBar: {
		justifySelf: "center",
		alignSelf: "center",
		position: "relative",
		display: "flex",
		"& input": {
			width: "50px",
			paddingLeft: "24px",
			border: "none",
			background: "#eee",
			padding: "10px",
			borderRadius: "20px",
			outline: "none",
			[theme.breakpoints.up("md")]: {
				width: "300px",
			},
		},
		"& .icon": {
			position: "absolute",
			top: "9px",
			left: "4px",
			color: "#888",
			fontSize: "1.2em",
		},
	},
	backgroundSelected: {
		background: "rgba(100,100,100,0.1)",
	},
}));

export default useStyles;
