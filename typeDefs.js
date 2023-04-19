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
        userId: ID
        notificationEmail: String
        email: String
        coordinator: ID
    }

    type Users {
        _id:ID
        userFName: String
        userLName: String
        groupNumber:Int
        role: String
        coordinatorId:ID
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
        appointment: [ID]
        isSponsor: Boolean
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

    input profDataInput {
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

    type coordData {
        time: DateTime
    }

    type something {
        room: String
        CID: ID
        name: String
    }

    type getAllCoordScheduleFormat2 {
        _id:DateTime
        uniqueId: ID
        coordinator:something
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
        room: String
        time: DateTime
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

    type File {
        groupNumber: String 
        groupName: String
    }

    type attendingProfessors {
        _id: ID
        fullName: String
    }
    
    type fancy {
        datetime: String
        room: String
        attending: [attendingProfessors]
        group: [Group]
        coordinator: [coordinatorDetails]
    }

    type test {
        _id: String
        info: [fancy]
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
        getAllCoordinatorSchedule(ID: ID):[getAllCoordScheduleFormat]
        getCoordinatorSchedule(CID: String): [CoordSchedule2]
        refreshToken(id : String, privilege:String) : String
        getProfessorsAppointments (profId: String ) : [userAppointments]
        getGroupAppointment(studentId: String) : CoordSchedule2
        getCoordinatorTimeRange(CID: String) : [DateTime]
        getAllGroups : [Group]
        getFullTimeRange: [getAllCoordScheduleFormat2]
        getColleagueSchedule(ID: ID):[getAllCoordScheduleFormat]
        getAllCoordinatorScheduleFancy: [test]
    }

    type Mutation {
        createProfessorSchedule(ID:ID!,privilege: String! ,time:[String]): Boolean
        deleteUser(ID:ID!):Users
        deleteProfessor(ID:ID!):Professors
        editUser(ID:ID!, userInput:UserInput):Users!
        editProfessor(ID:ID!, professorInput:ProfessorInput):Professors
        makeAppointment(AppointmentEdit:appointmentEdit):CoordSchedule
        groupSelectAppointmentTime(CID:ID!, GID:ID!, time: DateTime): Boolean
        RandomlySelectProfessorsToAGroup(CID:ID!, fullName: String) : Boolean
        roomChange(CID:ID!, newRoom:String):[CoordSchedule]
        registerUser(registerInput: RegisterInput) : UserLogin
        registerCoordinator(registerInput: RegisterInput): UserLogin
        loginUser(loginInput: loginInput): UserLogin2
        confirmEmail(confirmEmail: confirmEmail):Boolean
        resetPassword(resetPassword: resetPassword):Boolean
        createGroupSchedule(groupSchedule: groupSchedule): Boolean
        createCoordinatorSchedule(coordinatorSInput: coordinatorSInput):Boolean
        cancelAppointment(cancelation:cancelation):Boolean
        setRole(CID:String!, role:String!):Boolean
        updateProfilePic(ID:ID!, ppURL:String!):String
        editNotificationEmail(ID:String!,email:String!): Boolean
        deleteProfessorAppointment(professorId:String, scheduleId:String) : Boolean
        sendEventEmail(ID: String!, email: String!, privilege: String!) : Boolean
        updatePassword (ID: String!, oldPassword: String!, newPassword: String!, confirmedPassword: String!) : Boolean
        deleteGroup(groupId:ID):Boolean
        deleteAllGroups(CID:ID):Boolean
        createAccounts(CID:ID, groupNumber:Int, groupName: String, userLogin: String, password: String, firstname: String, lastname: String, role:String, isSponsor: Int) : Boolean
        generateGroupAppointment (CID:ID): Boolean
        forgotPassword(email: String): Boolean
        restPasswordPreLogin(email: String, password: String, confirmPassword: String): Boolean
        deleteCoordiantorSchedule(CID: ID) : Boolean
        updateProfessorAvailSchedule(PID:ID, time: String): Boolean
    }
`

module.exports = typeDefs;