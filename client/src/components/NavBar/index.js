import React, { useState, useEffect } from "react";
import classes from "./NavBar.module.css";
import Logo from "../../assets/twitter_header_photo_1.png";
import { NavLink } from "react-router-dom";
import { useAuthState, useAuthDispatch } from "../../context/auth";
import MenuTwoToneIcon from "@material-ui/icons/MenuTwoTone";
import ChatBubbleOutlineTwoToneIcon from "@material-ui/icons/ChatBubbleOutlineTwoTone";
import PersonOutlineTwoToneIcon from "@material-ui/icons/PersonOutlineTwoTone";
import ExitToAppTwoToneIcon from "@material-ui/icons/ExitToAppTwoTone";
import { Avatar } from "@material-ui/core";

function NavBar() {
	const authState = useAuthState();
	const dispatch = useAuthDispatch();

	const [showToggler, setShowToggler] = useState(false);
	const [togglerMenuActive, setTogglerMenuActive] = useState(false);

	useEffect(() => {
		const resizer = () => {
			if (window.innerWidth >= 768) {
				setShowToggler(false);
				setTogglerMenuActive(true);
			} else {
				setShowToggler(true);
			}
		};

		resizer();
		window.addEventListener("resize", resizer);

		return () => {
			window.removeEventListener("resize", resizer);
		};
	}, []);

	const toggleHandler = () => {
		if (window.innerWidth < 768) {
			setTogglerMenuActive((prev) => !prev);
		}
	};

	const logoutHandler = () => {
		dispatch({ type: "LOGOUT" });
	};

	return (
		<div className={classes.NavBar}>
			<div className={classes.NavBarContainer}>
				<div className={classes.Logo}>
					<NavLink to='/'>
						<img src={Logo} alt='' />
					</NavLink>
				</div>
				{showToggler && (
					<div className={classes.toggler} onClick={toggleHandler}>
						<MenuTwoToneIcon style={{ fontSize: "2.2rem" }} />
					</div>
				)}
				{togglerMenuActive && (
					<div onClick={toggleHandler} className={classes.Menu}>
						<NavLink
							exact
							to='/profile'
							activeClassName={classes.underLined}
							className={classes.Link}>
							<div className={classes.eachMenu}>
								{authState.user.imageUrl ? (
									<Avatar src={authState.user.imageUrl} />
								) : (
									<Avatar />
								)}
								<p style={{ marginLeft: "10px" }}>{authState.user.username}</p>
							</div>
						</NavLink>
						<NavLink
							exact
							activeClassName={classes.underLined}
							to='/messages'
							className={classes.Link}>
							<div className={classes.eachMenu}>
								<ChatBubbleOutlineTwoToneIcon style={{ marginRight: "5px" }} />
								<p>Messages</p>
							</div>
						</NavLink>
						<button onClick={logoutHandler}>
							<div className={classes.eachMenu}>
								<ExitToAppTwoToneIcon style={{ marginRight: "5px" }} />
								<p>Logout</p>
							</div>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default NavBar;
