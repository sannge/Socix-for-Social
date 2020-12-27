import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import ApolloProvider from "./client/ApolloClient";
import { theme } from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";

ReactDOM.render(
	<AuthProvider>
		<MessageProvider>
			<ApolloProvider>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</ApolloProvider>
		</MessageProvider>
	</AuthProvider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
