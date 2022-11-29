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
        id:ID,
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

    input ProfessorScheduleInput{
        time: DateTime
    }

    type Query{
        getUser(ID:ID!):Users!
        getProfessor(ID:ID!):Professors!
        getAllProfessors: [Professors!]
        getAllUsers:[Users!]
    }

    type Mutation{
        createUser(userInput:UserInput):Users!
        createProfessor(professorInput:ProfessorInput):Professors!
        createProfessorSchedule(ID:ID!,professorScheduleInput:ProfessorScheduleInput):Boolean
        deleteUser(ID:ID!):Users!
        deleteProfessor(ID:ID!):Professors!
        editUser(ID:ID!, userInput:UserInput):Users! 
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors!
    }
`

module.exports = typeDefs;