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
        confirmpassword: String,
        group: String,
        privilege: Int,
        confirm: Int,
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
        confirm: Int,
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
        password: String,
        confirmpassword: String
    }

    input loginInput{
        email: String,
        password: String
    }

    input confirmEmail{
        email: String,
    }

    input resetPassword{
        email:String
        password:String
        confirmPassword: String
    }

    type Query{
        getUser(ID:ID!):Users!
        getProfessor(ID:ID!):Professors!
        getAllProfessors: [Professors!]
        getAllUsers:[Users!]
    }

    type Mutation{
        createProfessorSchedule(ID:ID!,professorScheduleInput:ProfessorScheduleInput):Boolean
        deleteUser(ID:ID!):Users!
        deleteProfessor(ID:ID!):Professors!
        editUser(ID:ID!, userInput:UserInput):Users! 
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors!
        registerUser(registerInput: RegisterInput) : Users
        loginUser(loginInput: loginInput): Users
        confirmEmail(confirmEmail: confirmEmail):Boolean
        resetPassword(resetPassword: resetPassword):Boolean
    }
`

module.exports = typeDefs;