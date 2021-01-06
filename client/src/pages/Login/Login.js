import React, { useState } from "react";
import Brand from "../../assets/twitter_header_photo_1.png";
import { gql, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../../context/auth";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

import {
	Button,
	Container,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	formContainer: {
		marginTop: theme.spacing(10),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	brand: {
		width: "55%",
		alignSelf: "center",
		marginLeft: "13%",
	},
	form: {
		width: "90%",
	},
	outlineColor: {
		"& .MuiInputLabel-root": {
			marginTop: "-7px",
		},
		"& .MuiOutlinedInput-input:-webkit-autofill": {
			padding: "10px",
		},
		"& .MuiOutlinedInput-root": {
			padding: "0",
			height: "40px",
			"& fieldset": {
				borderRadius: "7px",
			},
			"&.Mui-focused fieldset": {
				borderColor: theme.palette.primary.main,
				borderWidth: "2px",
			},
		},
	},
	button: {
		borderRadius: "5px",
		marginTop: "15px",
		paddingTop: "12px",
		paddingBottom: "12px",
	},
	toLogin: {
		marginTop: "15px",
	},
	link: {
		textDecoration: "none",
	},
}));

const LOGIN_USER = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			username
			email
			token
			imageUrl
			createdAt
		}
	}
`;

function Login({ history }) {
	const [variables, setVariables] = useState({
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState({});

	const [displayError, setDisplayError] = useState(false);

	const dispatch = useAuthDispatch();

	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: (err) => {
			if (
				err &&
				err.graphQLErrors[0] &&
				err.graphQLErrors[0].extensions &&
				err.graphQLErrors[0].extensions.errors
			) {
				setErrors(err.graphQLErrors[0].extensions.errors);
			} else {
				setDisplayError(true);
			}
			console.log(err);
		},
		onCompleted: (data) => {
			dispatch({ type: "LOGIN", payload: data.login });
			window.location.href = "/";
		},
	});

	const submitLoginForm = (e) => {
		e.preventDefault();
		loginUser({ variables });
	};

	const classes = useStyles();

	return (
		<Container component='main' maxWidth='sm'>
			<div className={classes.formContainer}>
				<img className={classes.brand} src={Brand} alt='' />
				<Error display={displayError} setDisplay={setDisplayError} />
				{/* <Typography component='h1' variant='h5'>
					Sign in
				</Typography> */}
				<form onSubmit={submitLoginForm} className={classes.form}>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						error={errors.email}
						id='email'
						label={
							errors.email && variables.email === "" ? "" : "Email Address"
						}
						name='email'
						helperText={errors.email}
						autoComplete='email'
						type='email'
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, email: null });
							setVariables({ ...variables, email: e.target.value });
						}}
						value={variables.email}
						autoFocus
					/>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						error={errors.password}
						id='password'
						label={
							errors.password && variables.password === "" ? "" : "Password"
						}
						name='password'
						type='password'
						helperText={errors.password}
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, password: null });
							setVariables({ ...variables, password: e.target.value });
						}}
						value={variables.password}
					/>

					<Button
						onClick={submitLoginForm}
						className={classes.button}
						variant='contained'
						color='primary'
						fullWidth>
						{loading ? <Loading size={18} color='white' /> : "Log in"}
					</Button>
				</form>
				<div className={classes.toLogin}>
					<Typography variant='body1'>
						Don't have an account?{" "}
						<Link className={classes.link} to='/register'>
							Register Here
						</Link>
					</Typography>
				</div>
			</div>
		</Container>
	);
}

export default Login;
