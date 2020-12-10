import React from "react";
import classes from "./Messages.module.css";
import { GET_USERS } from "../constants/GqlQueries";
import { useQuery } from "@apollo/client";

function Messages() {
	const { data, loading, error } = useQuery(GET_USERS);

	if (error) {
		console.log(error);
	}
	if (data) {
		console.log(data);
	}

	return <div className={classes.Messages}>Messages</div>;
}

export default Messages;
