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
        group: String,
        token: String
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
        token: String,
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

    input RegisterInput{
        firstname: String,
        lastname: String,
        login: String,
        email: String,
        password: String
    }

    input loginInput{
        email: String,
        password: String
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
        registerUser(registerInput: RegisterInput) : Users!
        loginUser(loginInput: loginInput): Users!
    }
`

module.exports = typeDefs;