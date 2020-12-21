import React from "react";
import classes from "./Error.module.css";

function Error({ display }) {
	return (
		<div className={[classes.error, display && classes.display].join(" ")}>
			Something went wrong. Please try again later!
		</div>
	);
}

export default Error;
