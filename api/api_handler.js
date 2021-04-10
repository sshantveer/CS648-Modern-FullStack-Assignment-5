const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

/*const GraphQLDate = require('./graphql_date.js');*/
const about = require('./about.js');
const products = require('./product.js');

const resolvers = {
    Query: {
        about: () => about.getMessage,
        productList: products.productList,
        product: products.get,
    },
    Mutation: {
        setAboutMessage: about.setMessage,
        productAdd: products.productAdd,
        productUpdate: products.update,
        productDelete: products.delete,
    }
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});

function installHandler(app) {
    const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
    console.log('CORS setting:', enableCors);
    server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler };