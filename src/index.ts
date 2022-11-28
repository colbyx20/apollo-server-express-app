
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import pkg from 'body-parser';
const {json} = pkg;
// import {typeDefs} from './schema/typeDefs';
// import {resolvers} from './schema/resolvers';
import cors from 'cors';


 const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
`
const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

const resolvers = {
    Query: {
      books: () => books,
    },
  };


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
typeDefs,
resolvers,
plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>({ //origin: 
        // ['https://localhost:3000', 'https://studio.apollographql.com']
        origin: 'https://localhost:3000',
        credentials:true
    }),
    json(),
    expressMiddleware(server),
  );


  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);