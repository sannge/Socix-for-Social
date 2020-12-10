import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider as Provider,
	HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { useAuthDispatch } from "../context/auth";

export default function ApolloProvider(props) {
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

	const client = new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
	});
	return <Provider client={client} {...props} />;
}
