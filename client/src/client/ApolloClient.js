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
		if (
			graphQLErrors &&
			graphQLErrors[0] &&
			graphQLErrors[0].message === "Unauthenticated"
		) {
			dispatch({ type: "LOGOUT" });
		}
	});
	const linkWithHeader = authLink.concat(httpLink);
	const client = new ApolloClient({
		//this is very very very important to write this way
		//concat errorLink different way then concating with concat()
		//it will occur error

		link: errorLink.concat(linkWithHeader),
		cache: new InMemoryCache(),
	});
	//not adding the logout on networkError 401 because
	//it is not stable. Trying to apply refreshing token method
	//into the project
	return <Provider client={client} {...props} />;
}
