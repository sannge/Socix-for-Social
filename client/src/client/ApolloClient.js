import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
	HttpLink,
	split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { getMainDefinition } from "@apollo/client/utilities";

import { WebSocketLink } from "@apollo/client/link/ws";

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
		console.log(graphQLErrors);
		if (
			graphQLErrors &&
			graphQLErrors[0] &&
			graphQLErrors[0].message === "Unauthenticated"
		) {
			dispatch({ type: "LOGOUT" });
		}
	});

	const wsLink = new WebSocketLink({
		uri: "ws://localhost:4000/graphql",
		options: {
			reconnect: true,
			connectionParams: {
				Authorization: localStorage.getItem("token"),
			},
		},
	});

	const linkWithHeader = authLink.concat(httpLink);

	const linkWithHeaderAndError = errorLink.concat(linkWithHeader);

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" &&
				definition.operation === "subscription"
			);
		},
		errorLink.concat(wsLink),
		linkWithHeaderAndError
	);

	const client = new ApolloClient({
		//this is very very very important to write this way
		//concat errorLink different way then concating with concat()
		//it will occur error

		link: splitLink,
		cache: new InMemoryCache(),
	});
	//not adding the logout on networkError 401 because
	//it is not stable. Trying to apply refreshing token method
	//into the project
	return <Provider client={client} {...props} />;
}
