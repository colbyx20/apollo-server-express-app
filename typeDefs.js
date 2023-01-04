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

    type Group{
        id:ID,
        groupName: String,
        groupProject: String,
        projectField: String,
        memberCount: Int,
        members: [ID]
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

    input groupName{
        name:String
    }

    input groupInfo{
        groupName: String
        groupProject: String 
        projectField: String 
    }

    type Query{
        getUser(ID:ID!):Users!
        getProfessor(ID:ID!):Professors!
        getAllProfessors: [Professors!]
        getAllUsers:[Users!]
        getAllGroups:[Group!]
        getAllGroupsAndMembers:[Group!]
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
        addGroupMember(ID:ID!, groupName: groupName): Boolean
        createGroup(groupInfo: groupInfo): Group
        
    }
`

module.exports = typeDefs;