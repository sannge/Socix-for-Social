import React, { useState, useEffect } from "react";
import { GET_USERS } from "../constants/GqlQueries";
import { useQuery } from "@apollo/client";
import ErrorComponent from "../../components/Error";
import { Avatar, Container, Grid, Typography } from "@material-ui/core";
import Loading from "../../components/Loading";
import Divider from "../../components/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	messagesContainer: {
		display: "flex",
	},

	userSection: {
		marginTop: "10px",
		background: "white",
		border: "1px solid #ccc",
		borderTop: "none",
		borderBottom: "none",
		width: "90px",
		height: "90vh",
		minWidth: "100px",
		[theme.breakpoints.up("md")]: {
			width: "600px",
		},
		// [theme.breakpoints.down("md")]: {

		// },
		overflowY: "scroll",
		overflowX: "hidden",
	},
	MessageSection: {
		marginTop: "10px",
		marginLeft: "5px",
		width: "100%",
		background: "white",
		height: "90vh",
	},
	userContainer: {
		width: "400px",
		display: "flex",
		padding: "20px",
		paddingBottom: "10px",
		cursor: "pointer",
		"&:hover": {
			background: "rgba(100,100,100,0.1)",
			borderRadius: "10px",
		},
	},
	avatar: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	latestMessageContainer: {
		marginLeft: "10px",
		width: "230px",
	},
}));

function Messages() {
	const { data, loading, error } = useQuery(GET_USERS);
	const [Error, setError] = useState(true);
	const [showLatestMessage, setShowLatestMessage] = useState(
		window.innerWidth >= 960
	);

	// if (error) {
	// 	// console.log(error);
	// 	// console.log(
	// 	// 	"HIHIHI:",
	// 	// 	error.graphQLErrors[0].message === "Unauthenticated"
	// 	// );
	// 	console.log(error);
	// }
	// if (data) {
	// 	console.log(data);
	// }

	useEffect(() => {
		const showlatestMessageHandler = () => {
			if (window.innerWidth < 960) {
				setShowLatestMessage(false);
			} else {
				setShowLatestMessage(true);
			}
		};
		window.addEventListener("resize", showlatestMessageHandler);
	}, []);

	console.log(data && data.getUsers);
	const classes = useStyles();

	return (
		<div style={{ background: "#eee" }}>
			<Container maxWidth='lg'>
				{loading ? (
					<div
						style={{
							width: "100%",
							height: "100vh",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}>
						<Loading size={40} />
					</div>
				) : error ? (
					<div
						style={{
							width: "100%",
							height: "40vh",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}>
						<ErrorComponent alwaysDisplay />
					</div>
				) : (
					// styling the getUsers section like messenger
					<div className={classes.messagesContainer} style={{ width: "100%" }}>
						<div className={classes.userSection}>
							{data.getUsers.map((user) => (
								<div key={user.username}>
									<div className={classes.userContainer}>
										<Avatar
											sizes='xl'
											className={classes.avatar}
											src={user.imageUrl}
										/>
										{window.innerWidth < 960 ? (
											""
										) : (
											<div className={classes.latestMessageContainer}>
												<Typography variant='body1'>{user.username}</Typography>
												<Typography
													style={{ color: "#666" }}
													variant='body2'
													noWrap={user.latestMessage?.content.length >= 20}>
													{user.latestMessage?.content}
												</Typography>
											</div>
										)}
									</div>
								</div>
							))}
							{data.getUsers.map((user) => (
								<div key={user.username}>
									<div className={classes.userContainer}>
										<Avatar
											sizes='xl'
											className={classes.avatar}
											src={user.imageUrl}
										/>
										{window.innerWidth < 960 ? (
											""
										) : (
											<div className={classes.latestMessageContainer}>
												<Typography variant='body1'>{user.username}</Typography>
												<Typography
													variant='body2'
													noWrap={user.latestMessage?.content.length >= 26}>
													{user.latestMessage?.content}
												</Typography>
											</div>
										)}
									</div>
								</div>
							))}
							{data.getUsers.map((user) => (
								<div key={user.username}>
									<div className={classes.userContainer}>
										<Avatar
											sizes='xl'
											className={classes.avatar}
											src={user.imageUrl}
										/>
										{window.innerWidth < 960 ? (
											""
										) : (
											<div className={classes.latestMessageContainer}>
												<Typography variant='body1'>{user.username}</Typography>
												<Typography
													variant='body2'
													noWrap={user.latestMessage?.content.length >= 26}>
													{user.latestMessage?.content}
												</Typography>
											</div>
										)}
									</div>
								</div>
							))}
							{data.getUsers.map((user) => (
								<div key={user.username}>
									<div className={classes.userContainer}>
										<Avatar
											sizes='xl'
											className={classes.avatar}
											src={user.imageUrl}
										/>
										{window.innerWidth < 960 ? (
											""
										) : (
											<div className={classes.latestMessageContainer}>
												<Typography variant='body1'>{user.username}</Typography>
												<Typography
													variant='body2'
													noWrap={user.latestMessage?.content.length >= 26}>
													{user.latestMessage?.content}
												</Typography>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						<div className={classes.MessageSection}></div>
					</div>
				)}
			</Container>
		</div>
	);
}

export default Messages;
