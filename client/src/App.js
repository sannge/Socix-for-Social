import classes from "./App.module.css";
import Register from "./pages/Register/Register";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

import NavBar from "./components/NavBar";
import { useAuthState } from "./context/auth";

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
						<Route exact path='/' component={Home} />
						<Route path='/register' component={Register} />
						<Route path='/login' component={Login} />
						<Route path='/' component={Home} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
