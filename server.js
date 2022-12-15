// const express = require('express');
// const {ApolloServer} = require('apollo-server-express');
// const typeDefs = require("./typeDefs");
// const resolvers = require("./resolver");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyparser = require('body-parser');

const mongoose = require("mongoose");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const typeDefs = require("./typeDefs");
const resolvers = require("./resolver");

async function startServer(){
    const app = express();

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins:[ApolloServerPluginDrainHttpServer({httpServer})],
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
    

    await mongoose.connect("mongodb+srv://m001-student:pass123@sandbox.xkmg7i0.mongodb.net/colbydb?retryWrites=true&w=majority")
     console.log("Mongoose Connected...");
    //  app.listen(4000,() => console.log("Server is running on port 4000"));
    await new Promise((resolve) => httpServer.listen({port:4000}, resolve));

    console.log(`🚀 Server ready at http://localhost:4000/`);

 }

startServer();



// async function startServer(){
//     const app = express();
//     // app.use(cors());
//     const apolloServer = new ApolloServer({
//         typeDefs: typeDefs,
//         resolvers: resolvers
//     });
    
//     await apolloServer.start();

//     app.use('/graphql',cors(),json(),expressMiddleware(apolloServer));
    
//     // localhost:4000/graphql is our path
//     // apolloServer.applyMiddleware({app:app});
//     // app.use(cors());

//     // app.use((req,res) => {
//     //     res.send("Hello from express apollo server");
//     // });

//     await mongoose.connect("mongodb+srv://m001-student:pass123@sandbox.xkmg7i0.mongodb.net/colbydb?retryWrites=true&w=majority")
//     console.log("Mongoose Connected...");
//     app.listen(4000,() => console.log("Server is running on port 4000"));


// }

// startServer();


