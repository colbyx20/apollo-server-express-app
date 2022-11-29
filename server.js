const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = gql`
    type Query{
        hello: String
    }
`

const resolvers = {
    Query:{
        hello:() => {
            return "Hello World";
        },
    },
}

async function startServer(){
    const app = express();
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
    });

    await apolloServer.start();

    // localhost:4000/graphql is our path
    apolloServer.applyMiddleware({app:app});

    app.use((req,res) => {
        res.send("Hello from express apollo server");
    })

    app.listen(4000,() => console.log("Server is running on port 4000"));


}

startServer();


