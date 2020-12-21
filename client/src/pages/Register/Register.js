import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import Brand from "../../assets/twitter_header_photo_1.png";
import FormButton from "../../components/Buttons/FormButton";
import Loading from "../../components/ButtonLoading";

import { gql, useMutation } from "@apollo/client";
import {
	Button,
	Container,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";

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

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		//first one is caches
		update: (_, __) => {
			props.history.push("/login");
		},
		onError: (err) => {
			setErrors(
				err.graphQLErrors &&
					err.graphQLErrors[0] &&
					err.graphQLErrors[0].extensions &&
					err.graphQLErrors[0].extensions.errors
			);
		},
	});

	const submitRegisterForm = (e) => {
		e.preventDefault();
		registerUser({ variables });
	};

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
			marginLeft: "16%",
		},
		form: {
			width: "90%",
		},
		outlineColor: {
			"& .MuiInputLabel-root": {
				marginTop: "-7px",
			},
			"& .MuiOutlinedInput-root": {
				padding: "0",
				height: "40px",
				"& fieldset": {
					borderRadius: "5px",
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

	const classes = useStyles();

	return (
		// <div>
		// 	<form>
		// 		hi
		// 		{/* <img className={classes.brand} src={Brand} alt='' /> */}
		// 		{/* <h3>Sign Up</h3> */}
		// 		{/* <div className={classes.eachField}>
		// 			<label
		// 				className={errors.username && classes.textRed}
		// 				htmlFor='username'>
		// 				{errors.username ?? "Username"}
		// 			</label>
		// 			<input
		// 				className={errors.username && classes.boxRed}
		// 				name='username'
		// 				type='text'
		// 				value={variables.username}
		// 				onChange={(e) => {
		// 					setErrors({ ...errors, username: null });
		// 					setVariables({ ...variables, username: e.target.value });
		// 				}}
		// 				required={errors.username}
		// 			/>
		// 		</div>

		// 		<div className={classes.eachField}>
		// 			<label className={errors.email && classes.textRed} htmlFor='email'>
		// 				{errors.email ?? "Email"}
		// 			</label>
		// 			<input
		// 				className={errors.email && classes.boxRed}
		// 				name='email'
		// 				value={variables.email}
		// 				onChange={(e) => {
		// 					setErrors({ ...errors, email: null });
		// 					setVariables({ ...variables, email: e.target.value });
		// 				}}
		// 				type='text'
		// 			/>
		// 		</div>

		// 		<div className={classes.eachField}>
		// 			<label
		// 				className={errors.password && classes.textRed}
		// 				htmlFor='password'>
		// 				{errors.password ?? "Password"}
		// 			</label>
		// 			<input
		// 				className={errors.password && classes.boxRed}
		// 				name='password'
		// 				value={variables.password}
		// 				onChange={(e) => {
		// 					setErrors({ ...errors, password: null });
		// 					setVariables({ ...variables, password: e.target.value });
		// 				}}
		// 				type='password'
		// 			/>
		// 		</div>

		// 		<div className={classes.eachField}>
		// 			<label
		// 				className={errors.confirmPassword && classes.textRed}
		// 				htmlFor='confirmPassword'>
		// 				{errors.confirmPassword ?? "Confirm Password"}
		// 			</label>
		// 			<input
		// 				className={errors.confirmPassword && classes.boxRed}
		// 				name='confirmPassword'
		// 				value={variables.confirmPassword}
		// 				onChange={(e) => {
		// 					setErrors({ ...errors, confirmPassword: null });
		// 					setVariables({ ...variables, confirmPassword: e.target.value });
		// 				}}
		// 				type='password'
		// 			/>
		// 		</div>

		// 		<FormButton
		// 			onClick={submitRegisterForm}
		// 			disabled={loading}
		// 			type='submit'>
		// 			{loading ? (
		// 				<div style={{ display: "flex", justifyContent: "center" }}>
		// 					<Loading />
		// 				</div>
		// 			) : (
		// 				"Register"
		// 			)}
		// 		</FormButton>

		// 		<div className={classes.toLogin}>
		// 			Already have an account?{" "}
		// 			<span>
		// 				<Link className={classes.link} to='/login'>
		// 					Login Here
		// 				</Link>
		// 			</span>
		// 		</div> */}
		// 	</form>
		// </div>

		<Container component='main' maxWidth='sm'>
			<div className={classes.formContainer}>
				<img className={classes.brand} src={Brand} alt='' />
				{/* <Typography component='h1' variant='h5'>
					Sign in
				</Typography> */}
				<form className={classes.form}>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						// error
						id='username'
						label='Username'
						name='username'
						// helperText='Incorrect Entry'
						autoComplete='name'
						className={classes.outlineColor}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						id='email'
						label='Email Address'
						name='Email'
						autoComplete='email'
						className={classes.outlineColor}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						id='password'
						label='Password'
						name='password'
						autoComplete='password'
						className={classes.outlineColor}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						fullWidth
						id='confirmPassword'
						label='Confirm Password'
						name='confirmPassword'
						autoComplete='password'
						className={classes.outlineColor}
					/>

					<Button
						className={classes.button}
						variant='contained'
						color='primary'
						fullWidth>
						Sign in
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
