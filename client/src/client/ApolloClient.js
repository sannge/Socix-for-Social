import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
	HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { useAuthDispatch } from "../context/auth";

export default function ApolloProvider(props) {
	const dispatch = useAuthDispatch();

	const logoutLink = onError(({ networkError }) => {
		if (networkError && networkError.statusCode === 401) {
			console.log(networkError);
			dispatch({ type: "LOGOUT" });
		}
	});

	const httpLink = new HttpLink({ uri: "http://localhost:4000" });

	const authLink = setContext((_, { headers }) => {
		const token = localStorage.getToken("token");
		return {
			headers: {
				...headers,
				authorization: token ? token : "",
			},
		};
	});

	const client = new ApolloClient({
		link: logoutLink.concat(httpLink),
		cache: new InMemoryCache(),
	});
	return <Provider client={client} {...props} />;
}
