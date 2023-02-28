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
const cookie = require("cookie");
const Auth = require('./models/Auth.model');
const Users = require('./models/Users.model');
const Mongoose = require('mongoose');
const path = require('path');
const jwt = require("jsonwebtoken");

require('dotenv').config();


async function startServer(){

    const app = express();

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
    });


    await server.start();

    app.set('view engine', 'ejs');
    

    app.use(
        '/graphql',
        cors({
            origin: ['http://localhost:3000','http://localhost:8080/graphql', 'http://localhost:19006' ,'https://studio.apollogrpahql.com'],
            credentials: true,
        }),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({req}) => {
                const token = req.headers.authorization || " ";

                return token;
                
                // if(req.headers.authorization){
                //     try{
                //         const decode = jwt.verify(token.replace(/^bearer /i,""),'UNSAFE_STRING')   
                //         // console.log("Access Token");
                //         // console.log(decode);   

                //         if(decode.exp * 1000 < Date.now()){
                //             // console.log("Out of Date");
                //         }

                //         const isValidUser = await Auth.findOne({userId:decode.id});
                //         // console.log("Refresh token");
                //         // console.log(isValidUser.token);
                //         const decodedRefreshToken = jwt.verify(isValidUser.token,"UNSAFE_STRING");
                //         // console.log(decodedRefreshToken);
                //         // console.log("1");
                //         if(decode.id == decodedRefreshToken.id && decode.privilege == decodedRefreshToken.privilege){
                //             // console.log("2");
                //             // we want to send a new access token.
                //             const newAccessToken = jwt.sign(
                //                 {
                //                     id : decodedRefreshToken.id, 
                //                     email: decodedRefreshToken.email, 
                //                     firstname: decodedRefreshToken.firstname, 
                //                     lastname: decodedRefreshToken.lastname,
                //                     privilege: decodedRefreshToken.privilege
                //                 }, 
                //                 "UNSAFE_STRING", // stored in a secret file 
                //                 {expiresIn: "2h"}
                //                 );

                //             // console.log("My new access token");
                //             // console.log(newAccessToken);

                //             return newAccessToken
                    //     }                        
                    // }catch(e){
                    //     throw new AuthenticationError("User Not Authentication");
                    // }
                //}

                // console.log("My cookie")
                // console.log(userCookie);
                // if(!userCookie){
                //     return {req,res}
                // }else{
                //     const isValidUser = await Auth.findOne({token:userCookie});
                //     console.log(isValidUser);
                //     return isValidUser;
                // }


            // const cookies = cookie.parse(req.headers.cookie);
            // console.log("My cookie");
            // console.log(cookies);

            // return {req,res}

            },
            listen:{port:8080},
        }
        ),
        
    );

    // app.use(express.static(path.join(__dirname, "Web/client", "build")));

    // app.use((req, res, next) => {
    //     res.sendFile(path.join(__dirname, "Web/client", "build", "index.html"));
    // });
    

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongoose Connected...");
    await new Promise((resolve) => httpServer.listen({port:8080}, resolve));

    console.log(`🚀 Server ready at` + 8080);

 }

startServer();

