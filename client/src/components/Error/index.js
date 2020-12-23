import React, { useState, useEffect } from "react";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	alert: {
		// "@keyframes blinker": {
		// 	from: {
		// 		opacity: 0,
		// 	},
		// 	to: {
		// 		opacity: 1,
		// 	},
		// },
		"&": {
			marginTop: "10px",
			marginBottom: "10px",
			opacity: "0",
		},
		"&.show": {
			opacity: "1",
		},
	},
	// show: {
	// 	"&": {
	// 		opacity: "1",
	// 		transition: "opacity 1s ease-in-out",
	// 	},
	// },
});

function Error({ display, setDisplay, alwaysDisplay }) {
	const [show, setShow] = useState(false);
	const [fullOpacity, setFullOpacity] = useState(false);
	useEffect(() => {
		let timeout;
		let timeout2;
		let timeout3;
		if (display) {
			setShow(true);
			timeout2 = setTimeout(() => {
				setFullOpacity(true);
			}, 150);
			timeout3 = setTimeout(() => {
				setFullOpacity(false);
			}, 2850);
			timeout = setTimeout(() => {
				setShow(false);
				setDisplay(false);
				setFullOpacity(false);
			}, 3000);
		}
		return () => {
			if (timeout2) {
				clearTimeout(timeout2);
			}
			if (timeout) {
				clearTimeout(timeout);
			}
			if (timeout3) {
				clearTimeout(timeout3);
			}
		};
	}, [display, setDisplay]);

	const classes = useStyles();
	return (
		<>
			{show ? (
				<Alert
					className={[classes.alert, fullOpacity && "show"].join(" ")}
					severity='error'>
					Something is wrong! Please try again later.
				</Alert>
			) : alwaysDisplay ? (
				<Alert
					style={{
						marginTop: "10px",
						marginBottom: "10px",
						padding: "20px",
						paddingLeft: "40px",
						paddingRight: "40px",
						borderRadius: "10px",
					}}
					severity='error'>
					Something is wrong! Please try again later.
				</Alert>
			) : (
				""
			)}
		</>
	);
}

export default Error;
