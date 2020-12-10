import classes from "./App.module.css";
import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";

import NavBar from "./components/NavBar";
import { useAuthState } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";

function App() {
	const state = useAuthState();
	console.log(state);
	return (
		<Router>
			<div>
				{localStorage.getItem("token") && (
					<div className={classes.NavBar}>
						<NavBar />
					</div>
				)}
				<div className={classes.App}>
					<Switch>
						<DynamicRoute exact path='/' component={Home} authenticated />
						<DynamicRoute path='/register' component={Register} guest />
						<DynamicRoute path='/login' component={Login} guest />
						<DynamicRoute path='/messages' component={Messages} authenticated />
						<DynamicRoute path='/profile' component={Profile} authenticated />

						<Redirect to='/' component={Home} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
