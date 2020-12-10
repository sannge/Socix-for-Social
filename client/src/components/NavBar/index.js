import React from "react";
import classes from "./NavBar.module.css";
import Logo from "../../assets/twitter_header_photo_1.png";
import { NavLink } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../../context/auth";

function NavBar() {
	const authState = useAuthState();
	const dispatch = useAuthDispatch();
	console.log(authState);

	const logoutHandler = () => {
		dispatch({ type: "LOGOUT" });
	};

	return (
		<div className={classes.NavBar}>
			<div className={classes.NavBarContainer}>
				<div className={classes.Logo}>
					<img src={Logo} alt='' />
				</div>
				<div className={classes.Menu}>
					<NavLink to='' className={classes.Link}>
						{authState.user.username}
					</NavLink>
					<NavLink to='' className={classes.Link}>
						Messages
					</NavLink>
					<button onClick={logoutHandler}>Logout</button>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
