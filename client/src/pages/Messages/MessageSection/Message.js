import React from "react";
import useStyles from "./MessageSectionStyles";
import { Typography } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";

function Index({ message }) {
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const received = !sent;

	const classes = useStyles();
	return (
		<div
			className={
				sent
					? classes.eachMessageContainer1
					: classes.eachMessageContainer1Other
			}>
			<div
				className={
					sent
						? classes.eachMessageContainer2
						: classes.eachMessageContainer2Other
				}>
				<Typography variant='body1' component='p'>
					{message.content}
				</Typography>
			</div>
		</div>
	);
}

export default Index;
