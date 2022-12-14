const Users = require('./models/Users.model');
const Professors = require('./models/Professors.model');
const {ApolloError} = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {
    Query:{
        getUser: async(_,{ID}) =>{
            return await Users.findById(ID);
        },
        getAllUsers: async () =>{
            return await Users.find();
        },
        getProfessor: async(_,{ID}) => {
            return await Professors.findById(ID);
        },
        getAllProfessors: async () =>{
            return await Professors.find();
        },
    },
    Mutation:{
        registerUser: async(_,{registerInput: {firstname,lastname,login, email, password}}) =>{
            // See if an old user exists with Email attempting to Register
            const oldUser = await Users.findOne({email});
    
            if(oldUser){
                // throw an error 
                throw new ApolloError("A user is already reigstered with the email" + email, "USER_ALREADY_EXISTS");
            }
    
            // Encrypt password using bcryptjs
            var encryptedPassword = await bcrypt.hash(password,10);
    
            // Build out mongoose model 
            const newUser = new Users({
                firstname:firstname,
                lastname:lastname,
                login:login,
                email: email.toLowerCase(),
                password: encryptedPassword
            });
    
            // create JWT (attach to user model)
            const token = jwt.sign(
                {id : newUser._id, email}, 
                "UNSAFE_STRING", // stored in a secret file 
                {
                    expiresIn: "2h"
                }
            );
            
            // front end wants to see this token
            // They will attach this token to the user when logging in.
            newUser.token = token;
            
            // Save user in MongoDB
            const res = await newUser.save();
    
            return{
                id:res.id,
                ...res._doc
            }
        },
        loginUser: async (_,{loginInput: {email, password}}) => {

            // see if user exists with the email
            const user = await Users.findOne({email});

            // check if the entered password = encrypted password - use bcrypt
            if(user && (await bcrypt.compare(password, user.password))){
                // create a new token ( when you login you give user a new token )
                const token = jwt.sign(
                    {id : user._id, email}, 
                    "UNSAFE_STRING", // stored in a secret file 
                    {
                        expiresIn: "2h"
                    }
                );

                // attach token to user model that we found if user exists 
                user.token = token;

                return {
                    id: user.id,
                    ...user._doc
                }


            }else{
                // if user doesn't exists, return error
                throw new ApolloError("Incorrect Password", "INCORRECT_PASSWORD");
            }

        },
        createUser: async(_,{userInput:{firstname,lastname,email,login,password, group}}) =>{
            const createdUser = new Users({
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login,
                password:password,
                group:group
            });

            const res = await createdUser.save();

            return {
                id:res.id,
                ...res._doc // take all properties from result
            }
        },
        createProfessor: async(_,{professorInput:{firstname,lastname,email,login,password,fieldOfInterest}}) =>{
            const createdProfessor = new Professors({
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login,
                password:password,
                fieldOfInterest:fieldOfInterest
            });
            const professor = await createdProfessor.save();

            return {
                id:professor.id,
                ...professor._doc
            }
        },
        createProfessorSchedule: async(_,{ID,professorScheduleInput:{time}}) => {
            const date = new Date(time).toISOString();
            const isoDate = new Date(date);
            const createdDate = (await Professors.findByIdAndUpdate({_id:ID},{$push:{schedule:isoDate}})).modifiedCount;
            return createdDate;
        },
        deleteUser: async(_,{ID}) => {
            const wasDeletedUser = (await Users.deleteOne({_id:ID})).deletedCount;
            return wasDeletedUser;
        },
        deleteProfessor: async(_,{ID}) =>{
            const wasDeletedProfessor = (await Professors.deleteOne({_id:ID})).deletedCount;
            return wasDeletedProfessor;
        },
        editUser: async(_,{ID,userInput:{firstname,lastname,email,login}})=>{
            const  userEdited = (await Users.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login
            })).modifiedCount;
            return userEdited;
        },
        editProfessor: async (_,{ID,professorInput:{firstname,lastname,email,login}})=>{
            const professorEdit = (await Professors.updateOne({_id:ID},{
                firstname:firstname,
                lastname:lastname,
                email:email,
                login:login
            })).modifiedCount;
            return professorEdit;
        }

    }
}

module.exports = resolvers;
