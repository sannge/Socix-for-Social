import React, { useState, useEffect } from "react";
import { GET_USERS } from "../constants/GqlQueries";
import { useQuery } from "@apollo/client";
import ErrorComponent from "../../components/Error";
import SearchIcon from "@material-ui/icons/Search";
import {
	Avatar,
	Container,
	Input,
	TextField,
	Typography,
} from "@material-ui/core";
import Loading from "../../components/Loading";
import Divider from "../../components/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthState, useAuthDispatch } from "../../context/auth";

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
		display: "flex",
		flexFlow: "column",
		paddingTop: "10px",
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
		// border: "none",
		// padding: "10px",
		// background: "#eee",
		// width: "70px",
		// borderRadius: "20px",
		// outline: "none",
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
}));

function Messages() {
	const { data, loading, error } = useQuery(GET_USERS);
	const [Error, setError] = useState(true);
	const [showLtestMessage, setShowLatestMessage] = useState(
		window.innerWidth >= 960
	);
	console.log("GETTING USERS: ", data);
	const authState = useAuthState();

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

	const timeOutputHandler = (date) => {
		const timeSoFar = new Date() - new Date(date);
		if (timeSoFar / 1000 < 1) {
			return " · 1s";
		} else if (timeSoFar / (1000 * 60) < 1) {
			return ` · ${Math.ceil(timeSoFar / 1000)}s`;
		} else if (timeSoFar / (1000 * 60 * 60) < 1) {
			return ` · ${Math.ceil(timeSoFar / (1000 * 60))}m`;
		} else if (timeSoFar / (1000 * 60 * 60 * 24) < 1) {
			return ` . ${Math.ceil(timeSoFar / (1000 * 60 * 60))}h`;
		} else if (timeSoFar / (1000 * 60 * 60 * 24 * 365) < 1) {
			return ` · ${Math.ceil(timeSoFar / (1000 * 60 * 60 * 24))}d`;
		} else {
			console.log(Math.ceil(timeSoFar / (1000 * 60 * 60 * 24 * 365)));
			return ` · ${Math.ceil(timeSoFar / (1000 * 60 * 60 * 24 * 365))}y`;
		}
	};

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
							<div className={classes.searchBar}>
								<SearchIcon className='icon' />
								<input type='text' placeholder={`Search`} />
							</div>
							{data.getUsers.map((user) => (
								<div key={user.username}>
									<div className={classes.userContainer}>
										<div className={classes.userInnerContainer}>
											<Avatar
												sizes='xl'
												className={classes.avatar}
												src={user.imageUrl}
											/>
											{window.innerWidth < 960 ? (
												""
											) : (
												<div className={classes.latestMessageContainer}>
													<Typography variant='body1'>
														{user.username}
													</Typography>
													<div className={classes.messageAndTime}>
														<div style={{ width: "220px" }}>
															<Typography
																style={{ color: "#666" }}
																variant='body2'
																noWrap>
																{user.latestMessage?.from ===
																	authState.user.username && "You: "}
																{user.latestMessage?.content}
															</Typography>
														</div>
														<div style={{ width: "40px" }}>
															<Typography
																variant='body2'
																style={{ color: "#666" }}>
																{user.latestMessage &&
																	timeOutputHandler(
																		user.latestMessage.createdAt
																	)}
															</Typography>
														</div>
													</div>
												</div>
											)}
										</div>
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
