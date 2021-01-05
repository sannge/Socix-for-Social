import React from "react";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	tooltip: {
		zIndex: "10000",
		padding: "8px",
		background: "rgba(0,0,0,0.8)",
		borderRadius: "10px",
		fontSize: "12px",
	},
}));

function MaterialTooltip(props) {
	const classes = useStyles();
	return <Tooltip classes={{ tooltip: classes.tooltip }} {...props} />;
}

export default MaterialTooltip;
