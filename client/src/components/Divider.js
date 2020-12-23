import React from "react";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	divider: {
		"&.MuiDivider-root": {
			height: "10px",
			backgroundColor: "rgba(0,0,0,0)",
		},
	},
});

function Index() {
	const classes = useStyles();

	return <Divider className={classes.divider} />;
}

export default Index;
