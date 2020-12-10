import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import classes from "./Register.module.css";

import Brand from "../../assets/twitter_header_photo_1.png";
import FormButton from "../../components/Buttons/FormButton";
import Loading from "../../components/ButtonLoading";

import { gql, useMutation } from "@apollo/client";

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
			console.log(err.graphQLErrors[0].extensions.errors);
			setErrors(err.graphQLErrors[0] && err.graphQLErrors[0].extensions.errors);
		},
	});

	const submitRegisterForm = (e) => {
		e.preventDefault();
		registerUser({ variables });
	};
	if (localStorage.getItem("token")) {
		return <Redirect to='/' />;
	}
	return (
		<div className={classes.register}>
			<form className={classes.form}>
				<img className={classes.brand} src={Brand} alt='' />
				{/* <h3>Sign Up</h3> */}
				<div className={classes.eachField}>
					<label
						className={errors.username && classes.textRed}
						htmlFor='username'>
						{errors.username ?? "Username"}
					</label>
					<input
						className={errors.username && classes.boxRed}
						name='username'
						type='text'
						value={variables.username}
						onChange={(e) => {
							setErrors({ ...errors, username: null });
							setVariables({ ...variables, username: e.target.value });
						}}
						required={errors.username}
					/>
				</div>

				<div className={classes.eachField}>
					<label className={errors.email && classes.textRed} htmlFor='email'>
						{errors.email ?? "Email"}
					</label>
					<input
						className={errors.email && classes.boxRed}
						name='email'
						value={variables.email}
						onChange={(e) => {
							setErrors({ ...errors, email: null });
							setVariables({ ...variables, email: e.target.value });
						}}
						type='text'
					/>
				</div>

				<div className={classes.eachField}>
					<label
						className={errors.password && classes.textRed}
						htmlFor='password'>
						{errors.password ?? "Password"}
					</label>
					<input
						className={errors.password && classes.boxRed}
						name='password'
						value={variables.password}
						onChange={(e) => {
							setErrors({ ...errors, password: null });
							setVariables({ ...variables, password: e.target.value });
						}}
						type='password'
					/>
				</div>

				<div className={classes.eachField}>
					<label
						className={errors.confirmPassword && classes.textRed}
						htmlFor='confirmPassword'>
						{errors.confirmPassword ?? "Confirm Password"}
					</label>
					<input
						className={errors.confirmPassword && classes.boxRed}
						name='confirmPassword'
						value={variables.confirmPassword}
						onChange={(e) => {
							setErrors({ ...errors, confirmPassword: null });
							setVariables({ ...variables, confirmPassword: e.target.value });
						}}
						type='password'
					/>
				</div>

				<FormButton
					onClick={submitRegisterForm}
					disabled={loading}
					type='submit'>
					{loading ? (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Loading />
						</div>
					) : (
						"Register"
					)}
				</FormButton>

				<div className={classes.toLogin}>
					Already have an account?{" "}
					<span>
						<Link className={classes.link} to='/login'>
							Login Here
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
}

export default Register;
