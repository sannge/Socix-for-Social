import React from "react";
import { CircularProgress } from "@material-ui/core";

function Loading(props) {
	return (
		<div>
			<CircularProgress size={props.size} color={props.color} />
		</div>
	);
}

export default Loading;
