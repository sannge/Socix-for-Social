import React, { useState } from "react";
import classes from "./Messages.module.css";
import { GET_USERS } from "../constants/GqlQueries";
import { useQuery } from "@apollo/client";
import ErrorComponent from "../../components/Error";
import Loading from "../../components/Loading";

function Messages() {
	const { data, loading, error } = useQuery(GET_USERS);
	const [Error, setError] = useState(true);

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

	return (
		<div className={classes.Messages}>
			<div className={classes.MessagesContainer}>
				{loading ? (
					<div className={classes.error}>
						<Loading color='white' size={20} />
					</div>
				) : error ? (
					<div className={classes.error}>
						<ErrorComponent display />
					</div>
				) : (
					<div className={classes.secondContainer}>
						<div className={classes.chats}></div>
						<div className={classes.chatbox}></div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Messages;
