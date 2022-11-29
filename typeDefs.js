const {gql} = require('apollo-server-express');

const typeDefs = gql`

scalar DateTime

    type Users{
        id:ID,
        firstname: String,
        lastname: String,
        email: String,
        login: String,
        password: String,
        group: String
    }
    type Professors{
        firstname: String,
        lastname: String,
        email: String,
        login: String,
        password: String,
        privilege: Int,
        fieldOfInterest:String,
        schedule: [DateTime],
        appointments: [String]
    }
    
    input UserInput{
        firstname: String,
        lastname: String,
        email: String,
        login: String,
        password: String,
        group: String
    
    }
    input ProfessorInput{
        firstname: String,
        lastname: String,
        email: String,
        login: String,
        password: String,
        fieldOfInterest:String
    }

    type Query{
        getUser(ID:ID!):Users!
        getProfessor(ID:ID!):Professors!
        getAllProfessors: [Professors!]
        getAllUsers:[Users!]
    }
`

module.exports = typeDefs;