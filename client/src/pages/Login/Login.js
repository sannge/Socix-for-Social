import React, { useState } from "react";
import classes from "./Login.module.css";
import Loading from "../../components/ButtonLoading/index";
import Brand from "../../assets/twitter_header_photo_1.png";
import FormButton from "../../components/Buttons/FormButton";
import { gql, useLazyQuery } from "@apollo/client";
import { useAuthDispatch } from "../../context/auth";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

const LOGIN_USER = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			username
			email
			token
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

	const dispatch = useAuthDispatch();

	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: (err) => {
			setErrors(err.graphQLErrors[0].extensions.errors);
		},
		onCompleted: (data) => {
			dispatch({ type: "LOGIN", payload: data.login });
			history.push("/");
		},
	});

	const submitLoginForm = (e) => {
		e.preventDefault();
		loginUser({ variables });
	};

	return (
		<div>
			<form className={classes.form}>
				<img className={classes.brand} src={Brand} alt='' />

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

				<FormButton onClick={submitLoginForm} disabled={loading} type='submit'>
					{loading ? (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Loading />
						</div>
					) : (
						"Login"
					)}
				</FormButton>
				<div className={classes.toRegister}>
					Don't have an account?{" "}
					<span>
						<Link to='/register' className={classes.link}>
							Register Here
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
}

export default Login;
