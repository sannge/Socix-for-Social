import React from "react";
import classes from "./ButtonLoading.module.css";

function Loading({ color }) {
	return (
		<div className={classes.skchase}>
			<div className={classes.skdot}></div>
			<div className={[classes.skdot, classes.addColor].join(" ")}></div>
			<div className={[classes.skdot, classes.addColor].join(" ")}></div>
			<div className={[classes.skdot, classes.addColor].join(" ")}></div>
			<div className={[classes.skdot, classes.addColor].join(" ")}></div>
			<div className={[classes.skdot, classes.addColor].join(" ")}></div>
		</div>
	);
}

export default Loading;
