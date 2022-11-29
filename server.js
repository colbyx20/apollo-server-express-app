const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const typeDefs = require("./typeDefs");
const resolvers = require("./resolver");
const mongoose = require("mongoose");

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
    });

    await mongoose.connect("mongodb+srv://m001-student:pass123@sandbox.xkmg7i0.mongodb.net/colbydb?retryWrites=true&w=majority")
    console.log("Mongoose Connected...");
    app.listen(4000,() => console.log("Server is running on port 4000"));


}

startServer();


