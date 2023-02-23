const { gql } = require('apollo-server-express');

const typeDefs = gql`

scalar DateTime

    type Admin {
        _id:ID!
        firstname: String 
        lastname: String 
        email: String 
        password: String 
        confirmpassword: String 
        privilege: String 
        confirm: Int 
        token: String 
        image: String
        role: String
    }
    type Appointment {
        Time: String
        Group: ID
        Attending:[ID]
    }
    type Coordinator {
        _id:ID!
        firstname: String
        lastname: String
        email: String
        password: String
        confirmpassword: String
        privilege: Int
        confirm: Int
        token: String
        image: String
        groups: [Group]
        schedule: [DateTime]
    }

    type Users {
        _id:ID
        userFName: String
        userLName: String
        email: String
        password: String
        confirmpassword: String
        group: String
        privilege: Int
        confirm: Int
        role: String
        token: String
        image: String
    }

    type UserLogin {
        _id:ID
        firstname: String 
        lastname: String
        email: String
        token:String
        privilege: String
        confirm: String
        password: String
    }

    type Auth {
        token: String
    }

    type Professors {
        _id:ID
        professorFName: String
        professorLName: String
        availSchedule: [DateTime]
        email: String
        password: String
        privilege: String
        confirm: Boolean
        token: String
    }

    type Appointments {
        date: DateTime 
        groupID: ID 
        Attending: [ID]
    }

    type Schedule {
        time: [DateTime]
        groupname: String
    }

    type Group {
        _id:ID!
        coordinatorId:ID
        groupName: String
        projectField: String
        groupNumber: Int
        memberCount: Int
    } 
    
    input UserInput {
        name: String
        lastname: String
        email: String
        password: String
        group: String
    }

    input ProfessorRequestInput {
        Request:ID!
    }

    input appointInput {
        firstname: String
        lastname: String
    }
    
    input ProfessorInput {
        firstname: String
        lastname: String
        email: String
        password: String
        fieldOfInterest:String
        coordinator: Boolean
    }

    input ProfessorScheduleInput {
        time: [DateTime]
    }

    input addToGroup {
        id:ID
        groupnumber: Int
    }

    input RegisterInput {
        firstname: String
        lastname: String
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
        coordinatorId: ID
        groupName: String
        projectField: String 
        groupNumber: Int
    }

    input groupSchedule {
        appointmentTime: [DateTime]
    }

    type availSchedule {
        _id: DateTime
    }
    type CoordSchedule {
        _id: ID
        coordinatorID:ID
        room:String
        groupId:ID
        time:DateTime
        attending:[ID]
    }

    type groupData {
        groupName: String
        groupNumber: Int
        projectField: String
    }

    type CoordSchedule2 {
        _id: ID
        room: String
        time: DateTime
        numberOfAttending: Int
        attending: [String]
        groupId: groupData
    }

    input coordinatorSInput {
        CID:ID
        Room:String
        Times:[DateTime]
    }

    input appointmentEdit {
        GID:ID
        professorsAttending:[ID]
        time: DateTime
        CID:ID
        SponCoordFlag:Boolean
    }

    type Cookie {
        getCookie: String
    }

    input coordinatorInput {
        coordinatorID: ID!
    }

    type Query {
        getUser(ID:ID!) : Users
        getProfessor(ID:ID!) : Professors
        getAllProfessors : [Professors]
        getAllUsers : [Users]
        getAllGroups :[Group]
        getAdmins : Admin
        availSchedule: DateTime
        availScheduleByGroup(date:DateTime!): DateTime
        getAllCoordinatorSchedule:[CoordSchedule2]
        getCoordinatorSchedule(coordinatorInput:coordinatorInput): [CoordSchedule2]
        refreshToken(ID:ID!, privilege:String) : String
    }

    type Mutation {
        createProfessorSchedule(ID:ID!,privilege: String! ,professorScheduleInput:ProfessorScheduleInput): Boolean
        deleteUser(ID:ID!):Users
        deleteProfessor(ID:ID!):Professors
        editUser(ID:ID!, userInput:UserInput):Users!
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors
        makeAppointment(ID:ID!,AppointmentEdit:appointmentEdit):CoordSchedule
        roomChange(CID:ID!, newRoom:String):[CoordSchedule]
        registerUser(registerInput: RegisterInput) : UserLogin
        registerCoordinator(registerInput: RegisterInput): UserLogin
        loginUser(loginInput: loginInput): UserLogin
        confirmEmail(confirmEmail: confirmEmail):Boolean
        resetPassword(resetPassword: resetPassword):Boolean
        createGroup(groupInfo: groupInfo): Group
        createGroupSchedule(groupSchedule: groupSchedule): Boolean
        createCoordinatorSchedule(coordinatorSInput: coordinatorSInput):CoordSchedule

    }
`

module.exports = typeDefs;