const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const { sequelize } = require("./models");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: (ctx) => contextMiddleware(ctx),
});

const PORT = process.env.PORT || 4000;

server
	.listen(PORT)
	.then(({ url }) => console.log(`🚀  Server ready at PORT:${url}`))
	.catch((err) => console.log(err));
sequelize
	.authenticate()
	.then(() => console.log(`Database Connected!`))
	.catch((error) => console.log(`err`));
