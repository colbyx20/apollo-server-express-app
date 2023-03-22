const { gql } = require('apollo-server-express');

const typeDefs = gql`

scalar DateTime

    type Appointment {
        Time: String
        Group: ID
        Attending:[ID]
    }
    type Coordinator {
        _id:ID!
        notificationEmail: String
    }

    type UserInfo {
        userId: ID!
        notificationEmail: String
        email: String
    }

    type Users {
        _id:ID
        userFName: String
        userLName: String
        groupNumber:Int
        role: String
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
        notificationEmail: String
    }

    type UserLogin2 {
        _id:ID
        firstname: String 
        lastname: String
        email: String
        token:String
        privilege: String
        confirm: String
        password: String
        image: String
    }
    type notificationEmail {
        newEmail:String
    }
    type Auth {
        token: String
    }

    type Professors {
        _id:ID
        professorFName: String
        professorLName: String
        availSchedule: [DateTime]
        appointments: [userAppointments]
    }

    type userAppointments {
        _id:ID
        time: DateTime
        room: String
        groupName: String
        groupNumber: Int
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
    } 
    
    input UserInput {
        name: String
        lastname: String
        email: String
        notificationEmail: String
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
        coordinatorID: ID
        room: String
        groupId: ID
        time: DateTime
        attending: [ID]
    }

    type groupData {
        groupName: String
        groupNumber: Int
        projectField: String
    }

    type profData {
        _id:ID!
        fullName: String
    }

    type coordinatorDetails {
        _id:ID
        coordinatorFName: String
        coordinatorLName: String
    }

    type CoordSchedule2 {
        _id: ID
        room: String
        time: DateTime
        numberOfAttending: Int
        attending: [String]
        attending2: [profData]
        groupId: groupData
    }

    type getAllCoordScheduleFormat {
        _id: ID
        room: String
        time: DateTime
        numberOfAttending: Int
        attending: [String]
        attending2: [profData]
        groupId: groupData
        coordinatorInfo: coordinatorDetails
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

    }

    input cancelation {
        CancelerID:ID
        ApID:ID
        reason:String
    }

    type Cookie {
        getCookie: String
    }

    input coordinatorInput {
        coordinatorID: String!
    }

    type groupMembers {
        _id: ID!
        userFName: String
        userLName: String
        role: String
    }
    type groups {
        _id: ID!
        groupName: String
        groupNumber: Int
        members: [groupMembers]
        coordinatorId:ID
    }

    type Query {
        getUser(ID:ID!) : Users
        getUserInfo(ID: String!): UserInfo
        getCoordinatorEmail(ID:ID!): Coordinator
        getProfessor(ID:ID!) : Professors
        getAllProfessors : [Professors]
        getAllUsers : [Users]
        getGroupsByCoordinator (coordinatorId: String) :[Group]
        getGroupMembers (studentId: String): groups
        availSchedule: DateTime
        availScheduleByGroup(date:DateTime!): DateTime
        availScheduleProfessor: DateTime
        getAllCoordinatorSchedule:[getAllCoordScheduleFormat]
        getCoordinatorSchedule(CID: String): [CoordSchedule2]
        refreshToken(id : String, privilege:String) : String
        getProfessorsAppointments (profId: String ) : [userAppointments]
        getGroupAppointment(studentId: String) : CoordSchedule2
    }

    type Mutation {
        createProfessorSchedule(ID:ID!,privilege: String! ,professorScheduleInput:ProfessorScheduleInput): Boolean
        deleteUser(ID:ID!):Users
        deleteProfessor(ID:ID!):Professors
        editUser(ID:ID!, userInput:UserInput):Users!
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors
        makeAppointment(AppointmentEdit:appointmentEdit):CoordSchedule
        groupSelectAppointmentTime(CID:ID!, GID:ID!, time: DateTime): Boolean
        RandomlySelectProfessorsToAGroup(CID:ID!) : Boolean
        roomChange(CID:ID!, newRoom:String):[CoordSchedule]
        registerUser(registerInput: RegisterInput) : UserLogin
        registerCoordinator(registerInput: RegisterInput): UserLogin
        loginUser(loginInput: loginInput): UserLogin2
        confirmEmail(confirmEmail: confirmEmail):Boolean
        resetPassword(resetPassword: resetPassword):Boolean
        createGroup(CID:ID!): Boolean
        createGroupSchedule(groupSchedule: groupSchedule): Boolean
        createCoordinatorSchedule(coordinatorSInput: coordinatorSInput):CoordSchedule
        cancelAppointment(cancelation:cancelation):CoordSchedule
        createStudentAccounts(CID:ID!): Boolean
        setRole(CID:String!, role:String!):Boolean
        updateProfilePic(ID:ID!, ppURL:String!):String
        editNotificationEmail(ID:String!,email:String!): Boolean
        deleteProfessorAppointment(professorId:String, scheduleId:String) : Boolean
        sendEventEmail(ID: String!, email: String!, privilege: String!) : Boolean
        updatePassword (ID: String!, oldPassword: String!, newPassword: String!, confirmedPassword: String!) : Boolean
    }
`

module.exports = typeDefs;