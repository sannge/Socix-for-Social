import React, { useState } from "react";
import { Link } from "react-router-dom";

import Brand from "../../assets/twitter_header_photo_1.png";

import { gql, useMutation } from "@apollo/client";
import {
	Button,
	Container,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";

import Loading from "../../components/Loading";
import Error from "../../components/Error";

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

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			username: $username
			email: $email
			password: $password
			confirmPassword: $confirmPassword
		) {
			username
			email
		}
	}
`;
//swapping Css with material ui components
function Register(props) {
	const [variables, setVariables] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({});
	const [displayError, setDisplayError] = useState(false);

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		//first one is caches
		update: (_, __) => {
			props.history.push("/login");
		},
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
		},
	});

	const submitRegisterForm = (e) => {
		e.preventDefault();
		registerUser({ variables });
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
				<form onSubmit={submitRegisterForm} className={classes.form}>
					<TextField
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								submitRegisterForm(e);
							}
						}}
						variant='outlined'
						margin='normal'
						fullWidth
						error={errors.username}
						id='username'
						label={
							errors.username && variables.username === "" ? "" : "Username"
						}
						name='username'
						autoFocus
						helperText={errors.username}
						autoComplete='name'
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, username: null });
							setVariables({ ...variables, username: e.target.value });
						}}
						value={variables.username}
					/>
					<TextField
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								submitRegisterForm(e);
							}
						}}
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
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, email: null });
							setVariables({ ...variables, email: e.target.value });
						}}
						value={variables.email}
					/>
					<TextField
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								submitRegisterForm(e);
							}
						}}
						variant='outlined'
						margin='normal'
						fullWidth
						error={errors.password}
						id='password'
						label={
							errors.password && variables.password === "" ? "" : "Password"
						}
						name='password'
						helperText={errors.password}
						type='password'
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, password: null });
							setVariables({ ...variables, password: e.target.value });
						}}
						value={variables.password}
					/>
					<TextField
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								submitRegisterForm(e);
							}
						}}
						variant='outlined'
						margin='normal'
						fullWidth
						error={errors.confirmPassword}
						id='confirmPassword'
						label={
							errors.confirmPassword && variables.confirmPassword === ""
								? ""
								: "Confirm Password"
						}
						name='confirmPassword'
						helperText={errors.confirmPassword}
						autoComplete='off'
						type='password'
						className={classes.outlineColor}
						onChange={(e) => {
							setErrors({ ...errors, confirmPassword: null });
							setVariables({ ...variables, confirmPassword: e.target.value });
						}}
						value={variables.confirmPassword}
					/>

					<Button
						onClick={submitRegisterForm}
						className={classes.button}
						variant='contained'
						color='primary'
						fullWidth>
						{loading ? <Loading size={18} color='white' /> : "Sign in"}
					</Button>
				</form>
				<div className={classes.toLogin}>
					<Typography variant='body1'>
						Already have an account?{" "}
						<Link className={classes.link} to='/login'>
							Login Here
						</Link>
					</Typography>
				</div>
			</div>
		</Container>
	);
}

export default Register;
