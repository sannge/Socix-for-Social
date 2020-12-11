import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
	HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { useAuthDispatch } from "../context/auth";
import { onError } from "@apollo/client/link/error";

export default function ApolloProvider(props) {
	//will need to add WebsocketLink in the future for subscription
	const dispatch = useAuthDispatch();

	const httpLink = new HttpLink({ uri: "http://localhost:4000" });

	const authLink = setContext((_, { headers }) => {
		const token = localStorage.getItem("token");
		return {
			headers: {
				...headers,
				authorization: token ? token : "",
			},
		};
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		console.log(graphQLErrors && graphQLErrors[0] && graphQLErrors[0].message);
		if (graphQLErrors?.[0]?.message === "Unauthenticated") {
			dispatch({ type: "LOGOUT" });
		}
	});

	const client = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
	});
	//not adding the logout on networkError 401 because
	//it is not stable. Trying to apply refreshing token method
	//into the project
	return <Provider client={client} {...props} />;
}
