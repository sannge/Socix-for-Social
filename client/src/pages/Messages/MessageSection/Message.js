import React from "react";
import useStyles from "./MessageSectionStyles";
import { Typography } from "@material-ui/core";
import { useAuthState } from "../../../context/auth";
import MaterialTooltip from "../../../components/Tooltip";
import moment from "moment";

function Index({ message }) {
	const { user } = useAuthState();
	const sent = message.from === user.username;
	const received = !sent;
	//style
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
				<MaterialTooltip
					title={moment(message.createdAt).format("MMMM DD, YYYY, h:mm a")}
					placement={sent ? "bottom-end" : "bottom-end"}>
					<Typography variant='body1' component='p'>
						{message.content}
					</Typography>
				</MaterialTooltip>
			</div>
		</div>
	);
}

export default Index;
