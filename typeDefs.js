const {gql} = require('apollo-server-express');

const typeDefs = gql`

scalar DateTime

    type Admin {
        _id:ID!
        firstname: String 
        lastname: String 
        email: String 
        login: String 
        password: String 
        confirmpassword: String 
        privilege: String 
        confirm: Int 
        token: String 
        image: String
        role: String
    }

    type Users {
        _id:ID!
        firstname: String
        lastname: String
        email: String
        login: String
        password: String
        confirmpassword: String
        group: String
        privilege: Int
        confirm: Int
        role: String
        token: String
        image: String
    }

    type Professors {
        _id:ID!
        firstname: String
        lastname: String
        email: String
        login: String
        password: String
        privilege: Int
        fieldOfInterest:String
        confirm: Int
        token: String
        schedule: [DateTime]
        appointments: [Appointments]
        image:String
        coordinator: Boolean
    }

    type Appointments {
        date: DateTime 
        groupID: ID 
    }

    type Schedule {
        time: [DateTime]
        groupname: String
    }

    type Group {
        _id:ID
        groupName: String
        groupProject: String
        projectField: String
        memberCount: Int
        members: [Users!]!
        appointments: [Appointments]
    } 
    
    input UserInput {
        firstname: String
        lastname: String
        email: String
        login: String
        password: String
        group: String
    }

    input ProfessorInput {
        firstname: String
        lastname: String
        email: String
        login: String
        password: String
        fieldOfInterest:String
        coordinator: Boolean
    }

    input ProfessorScheduleInput {
        time: DateTime
    }

    input addToGroup {
        id:ID
        groupname: String
    }

    input RegisterInput {
        firstname: String
        lastname: String
        login: String
        email: String
        password: String
        confirmpassword: String
    }

    input loginInput {
        email: String
        password: String
    }

    input confirmEmail {
        email: String
    }

    input resetPassword {
        email:String
        password:String
        confirmPassword: String
    }

    input groupInfo {
        groupName: String
        groupProject: String 
        projectField: String 
    }

    input groupSchedule {
        appointmentTime: DateTime

    }

    type Query {
        getUser(ID:ID!) : Users!
        getProfessor(ID:ID!) : Professors!
        getAllProfessors : [Professors!]
        getAllUsers :[Users!]
        getAllGroups :[Group!]
        getAdmins : Admin!
    }

    type Mutation {
        createProfessorSchedule(ID:ID!,professorScheduleInput:ProfessorScheduleInput):Boolean
        deleteUser(ID:ID!):Users!
        deleteProfessor(ID:ID!):Professors!
        editUser(ID:ID!, userInput:UserInput):Users! 
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors!
        registerUser(registerInput: RegisterInput) : Users
        loginUser(loginInput: loginInput): Users
        confirmEmail(confirmEmail: confirmEmail):Boolean
        resetPassword(resetPassword: resetPassword):Boolean
        addGroupMember(addToGroup:addToGroup): Boolean
        createGroup(groupInfo: groupInfo): Group
        createGroupSchedule(groupSchedule: groupSchedule): Boolean
        
    }
`

module.exports = typeDefs;