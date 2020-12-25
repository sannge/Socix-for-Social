import React, { useState } from "react";
import { GET_USERS } from "../constants/GqlQueries";
import { useQuery } from "@apollo/client";
import ErrorComponent from "../../components/Error";
import { Avatar, Container, Grid, Typography } from "@material-ui/core";
import Loading from "../../components/Loading";
import Divider from "../../components/Divider";

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
	console.log(data && data.getUsers);
	return (
		<Container maxWidth='lg'>
			{loading ? (
				<div
					style={{
						width: "100%",
						height: "100vh",
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
					}}>
					<Loading size={40} />
				</div>
			) : error ? (
				<div
					style={{
						width: "100%",
						height: "40vh",
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
					}}>
					<ErrorComponent alwaysDisplay />
				</div>
			) : (
				// styling the getUsers section like messenger
				<div style={{ width: "100%" }}>
					<Grid container>
						<Grid style={{ marginTop: "20px", flex: "0 0 auto" }} item xs={3}>
							{data?.getUsers?.map((user) => (
								<div style={{ width: "100%" }} key={user.username}>
									{/* <div
										style={{
											display: "flex",
										}}>
										<div>
											<Avatar alt={user.username} src={user.imageUrl} />
										</div>
										<div style={{ marginLeft: "12px" }}>
											<Typography variant='body1'>{user.username}</Typography>
											{user.content}
										</div>
									</div> */}
									{/* need to fix this part position fixed for user section, change content depending on screen width */}
									<Grid spacing={7} alignItems='center' container>
										<Grid item xs={2}>
											<Avatar alt={user.username} src={user.imageUrl} />
										</Grid>
										<Grid item xs={10}>
											<Typography variant='body1'>{user.username}</Typography>
											<Typography noWrap variant='body2'>
												Hello mY man, how are you, I am fine, and you?
											</Typography>
										</Grid>
									</Grid>
								</div>
							))}
						</Grid>
						{/* this can be grid as usual since this will grow and shrink */}
						<Grid style={{ flex: "1 1 auto" }} item xs={9}>
							<div
								style={{
									background: "orange",
									height: "100vh",
								}}></div>
						</Grid>
					</Grid>
				</div>
			)}
		</Container>
	);
}

export default Messages;
