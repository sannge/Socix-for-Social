import React from "react";
import { Redirect } from "react-router-dom";
import classes from "./Home.module.css";

function Home() {
	if (localStorage.getItem("token")) {
		return <div className={classes.Home}>Home</div>;
	} else {
		return <Redirect to='/login' />;
	}
}

export default Home;
