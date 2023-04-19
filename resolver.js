const Users = require('./models/Users.model');
const Professors = require('./models/Professors.model');
const Group = require('./models/Group.model');
const Coordinator = require('./models/Coordinator.model');
const Auth = require('./models/Auth.model');
const UserInfo = require('./models/UserInfo.model');
const CoordSchedule = require('./models/CoordSchedule.model');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const STUDENT_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@k(nights)?nights\.ucf\.edu$');
const PROFESSOR_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$');

const resolvers = {

    Query: {
        getUser: async (_, { ID }) => {
            const userId = Mongoose.Types.ObjectId(ID)
            return await Users.findById({ _id: userId });
        },
        getUserInfo: async (_, { ID }) => {
            const userId = Mongoose.Types.ObjectId(ID)
            const [userInfo, User] = await Promise.all([
                UserInfo.findOne({ userId: userId }),
                Users.findOne({ _id: ID })
            ])

            return {
                email: userInfo.email,
                notificationEmail: userInfo.notificationEmail,
                coordinator: User?.coordinatorId
            }
        },
        getCoordinatorEmail: async (_, { ID }) => {
            const CID = Mongoose.Types.ObjectId(ID);
            return UserInfo.findOne({ userId: CID });
        },
        getAllUsers: async () => {
            return await Users.find();
        },
        getProfessor: async (_, { ID }) => {
            return await Professors.findById(ID)
                .select({
                    availSchedule: {
                        $map: {
                            input: "$availSchedule",
                            as: "schedule",
                            in: {
                                $dateToString: { format: "%m/%d/%Y %H:%M", date: "$$schedule" }
                            }
                        }
                    }
                })
                .lean()
                .then(doc => {
                    doc.availSchedule.sort((a, b) => new Date(a) - new Date(b));
                    return doc;
                });
        },
        getAllProfessors: async () => {
            return await Professors.find();
        },
        getGroupAppointment: async (_, { studentId }) => {
            const UID = Mongoose.Types.ObjectId(studentId);
            const groupInfo = await Users.findOne({ _id: UID });
            return await CoordSchedule.findOne({ groupId: groupInfo.groupId });
        },
        getGroupMembers: async (_, { studentId }) => {
            const UID = Mongoose.Types.ObjectId(studentId);
            // return await Group.findOne({ members: { $in: [UID] } }).populate('members')

            const getUserGroup = await Users.findOne({ _id: UID });
            const group = await Group.aggregate([
                { $match: { _id: getUserGroup.groupId } },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "groupId",
                        as: "members"
                    }
                }
            ])

            return {
                _id: group[0]._id,
                coordinatorId: group[0].coordinatorId,
                groupName: group[0].groupName,
                groupNumber: group[0].groupNumber,
                groupId: group[0].groupId,
                members: group[0].members
            }
        },
        getGroupsByCoordinator: async (_, { coordinatorId }) => {
            const CID = Mongoose.Types.ObjectId(coordinatorId)
            return await Group.find({ coordinatorId: CID }).sort({ groupNumber: 1 });
        },
        getProfessorsAppointments: async (_, { profId }) => {
            const PID = Mongoose.Types.ObjectId(profId)

            return CoordSchedule.aggregate([
                { $match: { "attending2._id": PID } },
                { $project: { _id: 1, groupId: 1, time: 1, room: 1 } },
                { $lookup: { from: "groups", localField: "groupId", foreignField: "_id", as: "groupId" } },
                { $unwind: "$groupId" },
                { $addFields: { original_id: "$_id" } },
                { $replaceRoot: { newRoot: { $mergeObjects: ["$groupId", { time: "$time", room: "$room", original_id: "$original_id" }] } } },
                { $project: { _id: "$original_id", groupName: "$groupName", groupNumber: "$groupNumber", time: { $dateToString: { format: "%m/%d/%Y %H:%M", date: "$time" } }, room: 1 } }
            ])
        },
        availSchedule: async () => {
            return Professors.aggregate([
                { $group: { _id: "$availSchedule", pId: { $push: { _id: "$_id", name: { $concat: ["$professorFName", " ", "$professorLName"] } } } } },
                { $unwind: "$_id" },
                { $group: { _id: "$_id", pId: { $push: "$pId" } } },
                { $project: { _id: 1, pId: { $reduce: { input: '$pId', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } } } },
                { $addFields: { arrayLength: { $size: '$pId' } } },
                { $match: { arrayLength: { $gte: 3 } } },
                { $sort: { _id: 1 } }
            ]);
        },
        availScheduleByGroup: async (_, { date }) => {

            const dateConversion = new Date(date).toISOString();
            const viewDate = new Date(dateConversion);


            return Professors.aggregate([
                { $group: { _id: "$availSchedule", pId: { $push: { _id: "$_id", name: { $concat: ["$professorFName", " ", "$professorLName"] } } } } },
                { $unwind: "$_id" },
                { $group: { _id: "$_id", pId: { $push: "$pId" } } },
                { $project: { _id: 1, pId: { $reduce: { input: '$pId', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } } } },
                { $addFields: { arrayLength: { $size: '$pId' } } },
                { $match: { arrayLength: { $gte: 3 } } },
                { $sort: { _id: 1 } }
            ]);
        },
        availScheduleProfessor: async () => {
            return Professors.aggregate([
                { $unwind: "$availSchedule" },
                {
                    $group: {
                        _id: "$availSchedule",
                        professors: {
                            $push: {
                                professorId: "$_id",
                                firstName: "$professorsFName",
                                lastName: "$professorLName",
                            }
                        },
                    }
                },
            ])
        },
        getAllCoordinatorScheduleFancy: async () => {
            return CoordSchedule.aggregate([
                { $lookup: { from: "coordinators", localField: "coordinatorID", foreignField: "_id", as: "coordinatorInfo" } },
                { $lookup: { from: "groups", localField: "groupId", foreignField: "_id", as: "groupInfo" } },
                { $group: { _id: { $dateToString: { format: "%m/%d/%Y", date: "$time" } }, info: { $push: { datetime: { $dateToString: { format: "%m/%d/%Y %H:%M", date: "$time" } }, attending: "$attending2", room: "$room", group: "$groupInfo", coordinator: "$coordinatorInfo" } } } },
                { $sort: { _id: 1 } }
            ])
        },
        getAllCoordinatorSchedule: async (_, { ID }) => {

            const PID = Mongoose.Types.ObjectId(ID)
            const getUser = await Professors.findOne({ _id: PID }).select('availSchedule');
            const currentAppointment = await CoordSchedule.find({ "attending2._id": PID }).select("time");

            const availSchedule = getUser.availSchedule.map(date => new Date(date));
            const pickedApp = currentAppointment.map(date => new Date(date));

            const user = await CoordSchedule.aggregate([
                { $match: { $and: [{ time: { $nin: availSchedule } }, { time: { $nin: pickedApp } }] } },
                {
                    $lookup: {
                        from: "coordinators",
                        localField: "coordinatorID",
                        foreignField: "_id",
                        as: "coordinatorInfo"
                    }
                },
                {
                    $lookup: {
                        from: "groups",
                        localField: "groupId",
                        foreignField: "_id",
                        as: "groupId"
                    }
                },
                {
                    $project: {
                        coordinatorID: 1, coordinatorInfo: 1, room: 1, time: { $dateToString: { format: "%m/%d/%Y %H:%M", date: "$time" } }, attending: 1, attending2: 1, numberOfAttending: 1,
                        "groupId.groupName": 1, "groupId.groupNumber": 1, "groupId.projectField": 1
                    }
                },
                { $unwind: { path: "$groupId", preserveNullAndEmptyArrays: true } },
                { $unwind: "$coordinatorInfo" },
                { $sort: { time: 1 } }
            ])

            return user;


        },
        getColleagueSchedule: async (_, { ID }) => {

            const CID = Mongoose.Types.ObjectId(ID)
            const getUser = await Coordinator.findOne({ _id: CID }).select('availSchedule');

            const availSchedule = getUser.availSchedule.map(date => new Date(date));

            const user = await CoordSchedule.aggregate([
                { $match: { time: { $nin: availSchedule }, coordinatorID: { $ne: CID } } },
                {
                    $lookup: {
                        from: "coordinators",
                        localField: "coordinatorID",
                        foreignField: "_id",
                        as: "coordinatorInfo"
                    }
                },
                {
                    $lookup: {
                        from: "groups",
                        localField: "groupId",
                        foreignField: "_id",
                        as: "groupId"
                    }
                },
                {
                    $project: {
                        coordinatorID: 1, coordinatorInfo: 1, room: 1, time: { $dateToString: { format: "%m/%d/%Y %H:%M", date: "$time" } }, attending: 1, attending2: 1, numberOfAttending: 1,
                        "groupId.groupName": 1, "groupId.groupNumber": 1, "groupId.projectField": 1
                    }
                },
                { $unwind: { path: "$groupId", preserveNullAndEmptyArrays: true } },
                { $unwind: "$coordinatorInfo" },
                { $sort: { time: 1 } }
            ])

            return user;
        },
        getFullTimeRange: async () => {
            const dates = await CoordSchedule.aggregate([
                { $match: { numberOfAttending: { $lt: 3 } } },
                { $group: { _id: null, times: { $push: "$time" } } },
                { $sort: { time: 1 } }
            ])

            return dates;
        },
        getCoordinatorSchedule: async (_, { CID }) => {
            const coordCID = Mongoose.Types.ObjectId(CID)
            return await CoordSchedule.aggregate([
                { $match: { coordinatorID: coordCID } },
                {
                    $lookup: {
                        from: "groups",
                        localField: "groupId",
                        foreignField: "_id",
                        as: "groupId"
                    }
                },
                {
                    $project: {
                        coordinatorID: 1, room: 1, time: { $dateToString: { format: "%m/%d/%Y %H:%M", date: "$time" } }, attending: 1, attending2: 1, numberOfAttending: 1,
                        "groupId.groupName": 1, "groupId.groupNumber": 1, "groupId.projectField": 1
                    }
                },
                { $unwind: { path: "$groupId", preserveNullAndEmptyArrays: true } },
                { $sort: { time: 1 } }
            ])
        },
        refreshToken: async (_, { id, privilege }) => {

            const userId = Mongoose.Types.ObjectId(id);
            const isValidUser = await Auth.findOne({ userId: userId });
            const decodedRefreshToken = jwt.verify(isValidUser.token, "UNSAFE_STRING");

            if (decodedRefreshToken.exp * 1000 < Date.now()) {
                return "";
            }

            if (isValidUser && id === decodedRefreshToken.id && privilege === decodedRefreshToken.privilege) {

                // return a new access token
                const newAccessToken = jwt.sign(
                    {
                        id: decodedRefreshToken.id,
                        email: decodedRefreshToken.email,
                        firstname: decodedRefreshToken.firstname,
                        lastname: decodedRefreshToken.lastname,
                        privilege: decodedRefreshToken.privilege,
                        notificationEmail: decodedRefreshToken.notificationEmail
                    },
                    "UNSAFE_STRING", // stored in a secret file 
                    { expiresIn: "1m" }
                );

                return newAccessToken;
            } else {
                return "Unauthorized User"
            }
        },
        getCoordinatorTimeRange: async (_, { CID }) => {
            const ID = Mongoose.Types.ObjectId(CID);
            try {
                return await CoordSchedule.aggregate([{ $match: { coordinatorID: ID } }, { $project: { time: 1, _id: 0 } }])

            } catch (error) {
                throw new ApolloError("Coordinator Error");
            }

        }
    },
    Mutation: {
        registerCoordinator: async (_, { registerInput: { firstname, lastname, email, password, confirmpassword } }) => {

            const capitalRegex = /[A-Z]/;
            const numberRegex = /[0-9]/;
            const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            if (password !== confirmpassword) {
                throw new ApolloError("Passwords Do Not Match");
            }

            if (password === "" || firstname === "" || lastname === "" || email === "") {
                throw new ApolloError("Please fill in all of the Boxes!");
            }

            if (!capitalRegex.test(password) || !numberRegex.test(password) || !specialRegex.test(password)) {
                throw new ApolloError("Password doesn't contain all requiremements")
            }

            // if (!numberRegex.test(password)) {
            //     throw new ApolloError("Password doesn't contain a number");
            // }

            // if (!specialRegex.test(password)) {
            //     throw new ApolloError("password doesn't contain any special characters")
            // }



            // See if an old user or Professor exists with Email attempting to Register
            // const oldUser = await Users.findOne({email});
            const doesExist = await UserInfo.findOne({ email: email });

            if (doesExist) {
                // throw an error 
                throw new ApolloError("A user is already reigstered with the email " + email, "USER_ALREADY_EXISTS");
            }

            var encryptedPassword = await bcrypt.hash(password, 10);

            // Build out mongoose model 
            const newCoordinator = new Coordinator({
                coordinatorFName: firstname.toLowerCase(),
                coordinatorLName: lastname.toLowerCase(),
            });

            // create JWT (attach to user model)
            const token = jwt.sign(
                { id: newCoordinator._id, email },
                "UNSAFE_STRING", // stored in a secret file 
                {
                    expiresIn: "2h"
                }
            );

            // Save user in MongoDB
            const res = await newCoordinator.save();

            // create professors auth information in separate collection called Auth
            const authCoordinator = new Auth({
                userId: res._id,
                password: encryptedPassword,
                confirm: true,
                privilege: "coordinator",
                token: token
            })

            // save new professor profile
            await authCoordinator.save();

            // create model for professors information 
            const coordinatorInfo = new UserInfo({
                userId: res._id,
                email: email.toLowerCase(),
                notificationEmail: email.toLowerCase(),
                image: '',
                privilege: "coordinator"
            })

            await coordinatorInfo.save();

            return {
                firstname: res.userFName,
                lastname: res.userLName,
                email: coordinatorInfo.email,
                privilege: coordinatorInfo.privilege,
                password: authCoordinator.password,
                confirm: authCoordinator.confirm,
                token: authCoordinator.token
            }
        },
        createAccounts: async (_, { CID, groupNumber, groupName, userLogin, password, firstname, lastname, role, isSponsor }) => {

            if (groupNumber === undefined || groupName === undefined || userLogin === undefined || password === undefined || firstname === undefined || lastname === undefined || role === undefined || isSponsor === undefined) {
                throw new ApolloError("Missing Data From CSV File");
            }

            const ID = Mongoose.Types.ObjectId(CID);

            // check if group exists
            const [isGroup, encryptedPassword] = await Promise.all([
                Group.findOne({ coordinatorId: ID, groupNumber: parseInt(groupNumber) }).select('_id groupNumber'),
                bcrypt.hash(password, 10)
            ])

            if (!isGroup) {

                const group = new Group({
                    coordinatorId: ID,
                    groupName: groupName.toLowerCase(),
                    projectField: "",
                    groupNumber: groupNumber,
                    isSponsor: parseInt(isSponsor)
                });

                const student = new Users({
                    userFName: firstname.toLowerCase(),
                    userLName: lastname.toLowerCase(),
                    role: role.toLowerCase(),
                    groupId: group._id,
                    coordinatorID: ID
                });

                // create JWT (attach to user model)
                const token = jwt.sign(
                    { id: student._id, email: userLogin, privilege: "student" },
                    "UNSAFE_STRING", // stored in a secret file 
                    {
                        expiresIn: "2h"
                    }
                );

                const authStudent = new Auth({
                    userId: student._id,
                    password: encryptedPassword,
                    confirm: true,
                    token: token,
                    privilege: 'student'
                })

                // create model for professors information 
                const studentInfo = new UserInfo({
                    userId: student._id,
                    email: userLogin.toLowerCase(),
                    notificationEmail: "",
                    privilege: 'student',
                    image: '',
                })

                await Promise.all([group.save(), student.save(), authStudent.save(), studentInfo.save()])

                return true;

            } else {

                const student = new Users({
                    userFName: firstname.toLowerCase(),
                    userLName: lastname.toLowerCase(),
                    role: role.toLowerCase(),
                    groupId: isGroup._id,
                    coordinatorID: ID
                });

                // create JWT (attach to user model)
                const token = jwt.sign(
                    { id: student._id, email: userLogin, privilege: "student" },
                    "UNSAFE_STRING", // stored in a secret file 
                    {
                        expiresIn: "2h"
                    }
                );

                const authStudent = new Auth({
                    userId: student._id,
                    password: encryptedPassword,
                    confirm: true,
                    token: token,
                    privilege: 'student'
                })

                // create model for professors information 
                const studentInfo = new UserInfo({
                    userId: student._id,
                    email: userLogin.toLowerCase(),
                    notificationEmail: "",
                    privilege: 'student',
                    image: '',
                })

                try {
                    await Promise.all([student.save(), authStudent.save(), studentInfo.save()]);
                    // console.log('All documents saved successfully');
                } catch (error) {
                    // console.log('Error while saving documents:', error);
                }

                return true;
            }
        },
        registerUser: async (_, { registerInput: { firstname, lastname, email, password, confirmpassword } }) => {
            const capitalRegex = /[A-Z]/;
            const numberRegex = /[0-9]/;
            const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            if (password !== confirmpassword) {
                throw new ApolloError("Passwords Do Not Match");
            }
            if (password === "" || firstname === "" || lastname === "" || email === "") {
                throw new ApolloError("Please fill in all of the Boxes!");
            }

            if (!capitalRegex.test(password) || !numberRegex.test(password) || !specialRegex.test(password)) {
                throw new ApolloError("Password doesn't contain all requiremements")
            }

            const oldProfessor = await UserInfo.findOne({ email: email });

            if (oldProfessor) {
                // throw an error 
                throw new ApolloError("A user is already reigstered with the email " + email, "USER_ALREADY_EXISTS");
            }

            let transport = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.EMAIL_USERNAME,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
            });
            // Encrypt password using bcryptjs
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Build out mongoose model 
            const newProfessor = new Professors({
                professorFName: firstname.toLowerCase(),
                professorLName: lastname.toLowerCase()
            });

            // create JWT (attach to user model)
            const token = jwt.sign(
                { id: newProfessor._id, email },
                "UNSAFE_STRING", // stored in a secret file 
                {
                    expiresIn: "2h"
                }
            );

            // Save user in MongoDB
            const res = await newProfessor.save();

            // create professors auth information in separate collection called Auth
            const authProfessor = new Auth({
                userId: res._id,
                password: encryptedPassword,
                confirm: true,
                token: token
            })

            // save new professor profile
            await authProfessor.save();

            // create model for professors information 
            const professorInfo = new UserInfo({
                userId: res._id,
                email: email.toLowerCase(),
                notificationEmail: email.toLowerCase(),
                image: '',
                privilege: "professor"
            })

            await professorInfo.save();

            return {
                id: res._id,
                firstname: res.professorFName,
                lastname: res.professorLName,
                email: professorInfo.email,
                privilege: professorInfo.privilege,
                password: authProfessor.password,
                confirm: authProfessor.confirm,
                token: authProfessor.token

            }

        },
        loginUser: async (_, { loginInput: { email, password } }) => {

            if (email === "") {
                throw new ApolloError("Please Enter in a valid Email");
            }

            if (password === "") {
                throw new ApolloError("Please Enter in a valid Password")
            }

            const userInfo = await UserInfo.findOne({ email: email }).populate('userId');

            if (!userInfo) {
                throw new ApolloError("User not found");
            }

            const user = await Users.findOne({ _id: userInfo.userId });


            const authUser = await Auth.findOne({ userId: userInfo.userId._id }).select("userId password confirm token");

            if (!(await bcrypt.compare(password, authUser.password))) {
                throw new ApolloError("Incorrect password")
            }

            if (email) {
                switch (userInfo.privilege) {
                    case 'professor':
                        return await Login(userInfo, authUser, authUser.confirm);
                    case 'student':
                        return await Login(userInfo, authUser, authUser.confirm);
                    case 'coordinator':
                        return await Login(userInfo, authUser, authUser.confirm);
                    default:
                        throw new ApolloError("User Does not Exist")
                }
            }

            async function Login(userInfo, authUser, confirmedUser) {

                try {
                    if (userInfo, authUser, confirmedUser === true && (await bcrypt.compare(password, authUser.password))) {

                        let ID = userInfo.userId._id;

                        let firstname;
                        let lastname;

                        if (userInfo.privilege === 'student') {
                            firstname = userInfo.userId.userFName;
                            lastname = userInfo.userId.userLName;
                        } else if (userInfo.privilege === 'coordinator') {
                            firstname = userInfo.userId.coordinatorFName;
                            lastname = userInfo.userId.coordinatorLName;
                        } else if (userInfo.privilege === 'professor') {
                            firstname = userInfo.userId.professorFName;
                            lastname = userInfo.userId.professorLName;
                        } else {
                            throw new ApolloError("User Privilege Error On Login");
                        }



                        // create a new token ( when you login you give user a new token )
                        const accessToken = jwt.sign(
                            {
                                id: ID,
                                email,
                                firstname: firstname,
                                lastname: lastname,
                                privilege: userInfo.privilege,
                                notificationEmail: userInfo.notificationEmail,
                                coordinator: user?.coordinatorId
                            },
                            "UNSAFE_STRING", // stored in a secret file 
                            { expiresIn: "1m" }
                        );

                        const refreshToken = jwt.sign(
                            {
                                id: ID,
                                email,
                                firstname: firstname,
                                lastname: lastname,
                                privilege: userInfo.privilege,
                                notificationEmail: userInfo.notificationEmail
                            },
                            "UNSAFE_STRING", // stored in a secret file 
                            { expiresIn: "2h" }
                        );

                        // attach token to user model that we found if user exists 
                        await Auth.findOneAndUpdate({ userId: ID }, { $set: { token: refreshToken } })

                        return {
                            _id: ID,
                            firstname: firstname,
                            lastname: lastname,
                            email: userInfo.email,
                            token: accessToken,
                            privilege: userInfo.privilege,
                            notificationEmail: userInfo.notificationEmail,
                            image: userInfo.image

                        }
                    }
                } catch (error) {
                    throw new ApolloError("User Does not Exist")
                }
            }
        },
        // confirm email if valid, then provide another api to actually set the api.
        confirmEmail: async (_, { confirmEmail: { email } }) => {

            // check if email is valid 
            try {
                // check if email is valid 
                const isValidEmail = await UserInfo.findOne({ notificationEmail: email });
                // find the corresponding user info
                var who;
                var first, last;//first and last name
                if (isValidEmail.privilege == 'student') {
                    who = await Users.findOne({ _id: isValidEmail.userId })
                    first = who.userFName;
                    last = who.userLName;
                }
                else if (isValidEmail.privilege == 'professor') {
                    who = await Professors.findOne({ _id: isValidEmail.userId })
                    first = who.professorFName;
                    last = who.professorLName;
                }
                else if (isValidEmail.privilege == 'coordinator') {
                    who = await Coordinator.findOne({ _id: isValidEmail.userId })
                    first = who.coordinatorFName
                    last = who.coordinatorLName
                }

                // set up email 
                let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });

                // send email to user. 
                transport.sendMail({
                    from: "group13confirmation@gmail.com",
                    to: email,
                    subject: "mySDSchedule - Please Confirm Your Account",
                    html: `<h1>Email Confirmation</h1>
                        <h2>Hello ${first} ${last}</h2>
                        <p>Click Link to reset your password!</p>
                        <p>If you did not select to reset your password please ignore this email</p>
                        </div>`,
                })
            } catch (e) {
                // email is not valid 
                throw new ApolloError("Email IS Not Valid");
            }

        },
        updatePassword: async (_, { ID, oldPassword, newPassword, confirmedPassword }) => {
            const userId = Mongoose.Types.ObjectId(ID);

            const capitalRegex = /[A-Za-z]/;
            const numberRegex = /[0-9]/;
            const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            if (newPassword !== confirmedPassword) {
                throw new ApolloError("New Passwords Do Not Match!");
            }

            if (newPassword.length < 8) {
                throw new ApolloError("New Password is too short");
            }

            if (!capitalRegex.test(newPassword) || !numberRegex.test(newPassword) || !specialRegex.test(newPassword)) {
                throw new ApolloError("Password doesn't contain all requiremements")
            }

            try {
                const [authUser, encryptedPassword] = await Promise.all([
                    Auth.findOne({ userId: userId }).select('userId password'),
                    bcrypt.hash(confirmedPassword, 10)
                ])

                if (authUser && (await bcrypt.compare(oldPassword, authUser.password))) {
                    await Auth.findOneAndUpdate({ userId: userId }, { $set: { password: encryptedPassword } });
                } else {
                    throw new ApolloError("current password doesn't Match!");
                }
                return true;
            } catch (e) {
                throw new ApolloError("Current Password Does Not Match!");
            }
        },
        resetPassword: async (_, { resetPassword: { email, password, confirmPassword } }) => {
            const capitalRegex = /[A-Z]/;
            const numberRegex = /[0-9]/;
            const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            // encrypt new password and set to user.
            if (password !== confirmPassword) {
                throw new ApolloError("Passwords Do Not Match!");
            }
            if (!capitalRegex.test(password) || !numberRegex.test(password) || !specialRegex.test(password)) {
                throw new ApolloError("Password doesn't contain all requiremements")
            }

            try {

                const [encryptedPassword, finduser] = await Promise.all([
                    bcrypt.hash(password, 10),
                    UserInfo.findOne({ email: email })
                ])

                // set password from user 
                const setNewPassword = await Auth.findOneAndUpdate({ userId: finduser.userId }, { password: encryptedPassword });

                setNewPassword.save();


            } catch (e) {
                throw new ApolloError("Email is Invalid");
            }
            return true
        },
        createProfessorSchedule: async (_, { ID, privilege, time }) => {
            if (ID === null || privilege === null) {
                throw new ApolloError("Missing Field Data");
            } else {
                privilege === "professor" || "coordinator" ? await addDateHelper(time, privilege) : "Privilege Error in Schedule";

                async function addDateHelper(time, privilege) {
                    const dates = [];
                    let UniqueTimes = new Set(time);

                    UniqueTimes.forEach((times) => {
                        times = new Date(times).toISOString();
                        dates.push(new Date(times));
                    })

                    if (privilege === "professor") {
                        const isScheduled = (await Professors.find({ _id: ID, availSchedule: { $in: dates } }).count());
                        if (!isScheduled) {
                            (await Professors.updateOne({ _id: ID }, { $push: { availSchedule: { $each: dates } } })).modifiedCount;
                        } else {
                            return false;
                        }
                    } else {
                        const isScheduled = (await Coordinator.find({ _id: ID, availSchedule: { $in: dates } }).count());
                        if (!isScheduled) {
                            (await Coordinator.updateOne({ _id: ID }, { $push: { availSchedule: { $each: dates } } })).modifiedCount;
                        } else {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        createCoordinatorSchedule: async (_, { coordinatorSInput: { CID, Room, Times } }) => {

            if (Room === null || Times === null) {
                throw new ApolloError("Please Fill Room/Times");
            }
            const ID = Mongoose.Types.ObjectId(CID)
            const UniqueTimes = new Set(Times);

            UniqueTimes.forEach(async (time) => {
                let t = new Date(time);
                let duplicateTime = (await CoordSchedule.findOne({ coordinatorID: ID, time: t }).count());

                if (duplicateTime) {
                    return false;
                } else {
                    try {
                        const CoordinatorSchedule = new CoordSchedule({
                            coordinatorID: ID,
                            room: Room.toLowerCase(),
                            groupId: null,
                            time: t,
                            numberOfAttending: 0,
                            attending: [],
                            attending2: []
                        });


                        await CoordinatorSchedule.save();
                        return true;

                    } catch (e) {
                        throw new ApolloError("Something Went Wrong!");
                    }
                }
            });

            return true;
        },
        deleteUser: async (_, { ID }) => {
            const wasDeletedAuth = (await Auth.deleteOne({ userId: ID }))
            const wasDeletedUserInfo = (await UserInfo.deleteOne({ userId: ID }))
            const wasDeletedUser = (await Users.deleteOne({ _id: ID })).deletedCount;
            return wasDeletedUser;
        },
        deleteProfessor: async (_, { ID }) => {
            const wasDeletedAuth = (await Auth.deleteOne({ userId: ID }))
            const wasDeletedUserInfo = (await UserInfo.deleteOne({ userId: ID }))
            const wasDeletedProfessor = (await Professors.deleteOne({ _id: ID })).deletedCount;
            return wasDeletedProfessor;
        },
        editUser: async (_, { ID, userInput: { firstname, lastname, email } }) => {
            const userEdited = (await Users.updateOne({ _id: ID }, {
                firstname: firstname,
                lastname: lastname,
                email: email
            })).modifiedCount;
            return userEdited;
        },
        editProfessor: async (_, { ID, professorInput: { firstname, lastname, email, coordinator } }) => {
            const professorEdit = (await Professors.updateOne({ _id: ID }, {
                firstname: firstname,
                lastname: lastname,
                email: email,
                coordinator: coordinator
            })).modifiedCount;
            return professorEdit;
        },
        groupSelectAppointmentTime: async (_, { CID, GID, time }) => {
            // convert CID and GID into ObjectID Types
            const coordinatorId = Mongoose.Types.ObjectId(CID)
            const groupId = Mongoose.Types.ObjectId(GID)
            const selectedTime = new Date(time).toISOString();

            try {
                const isAvailable = await CoordSchedule.findOne({ userId: CID, time: selectedTime });
                if (isAvailable && isAvailable.groupId == null) {
                    await CoordSchedule.updateOne({ coordinatorID: coordinatorId }, { $set: { groupId: groupId } });
                    return true;
                }
            } catch (e) {
                throw new ApolloError("Timeslot not Available");
            }

            return false;
        },
        makeAppointment: async (_, { AppointmentEdit: { GID, professorsAttending, time, CID } }) => {//adds groupID to appointment largely for testing purposes
            const bookedTest = await CoordSchedule.findOne({ groupId: GID })
            const chrono = new Date(time)
            const appointment = await CoordSchedule.findOne({ coordinatorID: CID, time: chrono })
            const PE = [];
            if (bookedTest) {
                if (bookedTest.attending2.length == 3) {
                    throw new ApolloError("group already has an appointment and has all profs");
                }
            }
            if (appointment) //if appointment exists
            {
                if (GID)//sent a GID
                {

                    if (appointment.groupId && Mongoose.Types.ObjectId(GID) != appointment.groupId)//sees if the appoinment has a group and if this is that group
                    {
                        throw new ApolloError("Appoinment already booked by another group")
                    }
                    else if (professorsAttending)//not null 
                    {
                        if ((appointment.attending2.length + professorsAttending.length) > 3) // regulates the number pushed
                        {
                            throw new ApolloError("to many professors")
                        }
                    }
                }
                else {
                    throw new ApolloError("invalid GroupID")
                }
            }
            else {
                throw new ApolloError("that Appointment does not exist")
            }

            //claim appointment for the group
            const CoordScheduleEdit = await CoordSchedule.updateOne({ coordinatorID: CID, time: chrono }, { $set: { groupId: mongoose.Types.ObjectId(GID) } })
            var modification = CoordScheduleEdit.modifiedCount
            //Validate proffesor Availability
            for (prof of professorsAttending) {
                const availTest = await Professors.findOne({ _id: prof, availSchedule: { $in: [chrono] } })
                if (!availTest) {//unavailable
                    const who = await Professors.find({ _id: prof })
                    PE.push(who.professorLName)
                    continue
                }
                else {
                    const pro = mongoose.Types.ObjectId(prof);//might make it a try catch
                    await Professors.updateOne({ _id: prof }, { $pull: { availSchedule: chrono }, $push: { appointments: appointment._id } }).modifiedCount
                    const profInfo = { _id: availTest._id, fullName: ''.concat(availTest.professorFName, ' ', availTest.professorLName) }
                    await CoordSchedule.updateOne({ coordinatorID: CID, time: chrono }, { $push: { attending2: profInfo }, $inc: { numberOfAttending: 1 } })   //add to the attending professor
                    modification = modification + 1;
                }
            }
            if (PE.length != 0) {
                throw new ApolloError("professor(s)" + PE + "unavailable")
            }
            appointment = await CoordSchedule.findOne({ coordinatorID: CID, time: chrono })// no verification needed as this is an update 
            if (appointment.numberOfAttending == 3)//if make was successful
            {

                //send out notifications
                // set up email 
                let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });

                //Professor Notification and availability removal

                for (prof of professorsAttending) {
                    await Professors.updateOne({ _id: prof }, { $pull: { availSchedule: chrono }, $push: { appointments: appoinment._id } })
                    const notify = await UserInfo.find({ userId: prof })
                    // send email to user. 
                    transport.sendMail({
                        from: "SDSNotifier@gmail.com",
                        to: notify.notificationEmail,
                        subject: "A Senior Design final Review has been schedule",
                        html: `<h1>Demo Notin appointment at ${appointment.time} in room ${appointment.room}</h2>
                        <p>If you need to cancel please get on the app or visit our website to do so  </p>
                        </div>`,
                    })

                }
            }
        },
        roomChange: async (_, { CID, newRoom }) => {
            const roomEdit = (await CoordSchedule.updateMany({ coordinatorID: CID }, {
                room: newRoom
            })).modifiedCount
            return
        },
        cancelAppointment: async (_, { cancelation: { CancelerID, ApID, room, time } }) => {

            let transport = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.EMAIL_USERNAME,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
            });

            async function sendCommitteeEmails(email, fullName, date, room) {
                return new Promise((resolve, reject) => {
                    transport.sendMail({
                        from: "group13confirmation@gmail.com",
                        to: email,
                        subject: "mySDSchedule - A Senior Design final Review has been canceled",
                        html: `<h1>Senior Design Appointment</h1>
                        <h1>${fullName}</h1>
                        <h3>Committee Demo at</h3>
                        <table>
                        <tbody>
                            <tr><td>Day: ${date}</td></tr> 
                            <tr><td>Room: ${room} </td></tr>
                        </tbody>
                        </table>

                        <h3>Has Been Cancelled</h3>
                    `,
                    }, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
            }

            try {

                const appointment = await CoordSchedule.findOne({ _id: ApID });

                const date = new Date(time);
                const inputHours = date.getUTCHours();
                const inputMinutes = date.getUTCMinutes();

                const convertHours = inputHours - 8;

                let newDate = date.toLocaleString("default", { month: "long", day: "numeric" }) + " " + convertHours.toString().padStart(2, "0") + ":" + inputMinutes.toString().padStart(2, "0");

                // grab all of the emails for each professors being canceled. 
                const profEmails = await UserInfo.find({ userId: { $in: appointment.attending2 } }).select('email notificationEmail')

                // send an email to all of the professors that their appointments have been canceled 
                const sendEmailPromises = profEmails.map(async (professor, index) => {

                    let email;

                    if (professor.notificationEmail === "") {
                        email = professor.email;
                    } else {
                        email = professor.notificationEmail;
                    }

                    const mydate = date.toLocaleTimeString("en-US", { timeZone: "America/New_York" })
                    return sendCommitteeEmails(email, appointment.attending2[index].fullName, newDate, room);

                });

                await Promise.all(sendEmailPromises);


                for (prof of appointment.attending2) {
                    // const profe = await UserInfo.findOne({ userId: prof._id });
                    await Professors.updateOne({ _id: prof }, { $push: { availSchedule: appointment.time }, $pull: { appointments: appointment._id } })//return there  availability
                }

                await CoordSchedule.deleteOne({ _id: ApID })//delete Appointment

            } catch (error) {
                throw new ApolloError(error);
            }

            return true
        },
        setRole: async (_, { CID, role }) => {
            try {
                await Users.findOneAndUpdate({ _id: CID }, { $set: { role: role } });
                return true;
            } catch (e) {
                return new ApolloError("Error on Set / Update Role")
            }
        },
        RandomlySelectProfessorsToAGroup: async (_, { CID, fullName }) => {

            const coordinatorId = Mongoose.Types.ObjectId(CID)
            const MAX_APPOINTMENTS = 3;

            let transport = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.EMAIL_USERNAME,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
            });


            async function sendCommitteeEmails(email, fullName, date, room) {
                return new Promise((resolve, reject) => {
                    transport.sendMail({
                        from: "group13confirmation@gmail.com",
                        to: email,
                        subject: "mySDSchedule - Committee Confirmation",
                        html: `<h1>Senior Design Appointment</h1>
                        <h1>${fullName}</h1>
                        <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${date.toDateString()}</td>
                                <td>${date.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}</td>
                                <td>${room}</td>
                            </tr>
                        </tbody>
                        </table>
                        `,
                    }, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
            }

            try {

                const isComplete = await CoordSchedule.find({ coordinatorID: coordinatorId, numberOfAttending: { $ne: 3 } }).count()
                if (isComplete === 0) {
                    return;
                }

                const sponsor = await Group.find({ coordinatorId: coordinatorId, isSponsor: true });

                const coordinatorInfo = [{
                    _id: coordinatorId,
                    fullName: fullName
                }]

                await Promise.all(sponsor.map(async (group) => {
                    await CoordSchedule.findOneAndUpdate({
                        coordinatorID: coordinatorId,
                        groupId: group._id,
                        numberOfAttending: { $eq: 0 }
                    },
                        {
                            $inc: { numberOfAttending: 1 },
                            $push: { attending2: { $each: coordinatorInfo } }
                        })
                }));

                const numAttending = await CoordSchedule.find({ coordinatorID: coordinatorId, groupdId: { $ne: null }, numberOfAttending: { $lt: MAX_APPOINTMENTS } }).count();

                for (let counter = 0; counter < numAttending; counter++) {

                    const coordinatorInfo = await CoordSchedule.aggregate([
                        { $match: { coordinatorID: coordinatorId, numberOfAttending: { $lt: 3 }, groupId: { $ne: null } } },
                        { $sample: { size: 1 } },
                        { $project: { coordinatorID: 1, attending2: 1, time: 1, numberOfAttending: 1, groupId: 1, room: 1 } }
                    ])

                    const date = new Date(coordinatorInfo[0].time);

                    const matchProfessors = await Professors.aggregate([
                        {
                            $match: { availSchedule: date }
                        },
                        { $sample: { size: MAX_APPOINTMENTS - coordinatorInfo[0].numberOfAttending } },
                        { $project: { _id: 1, fullName: { $concat: ['$professorFName', ' ', '$professorLName'] } } }
                    ])


                    if (matchProfessors) {
                        const professorInfo = matchProfessors.map((professor) => ({
                            _id: professor._id,
                            fullName: professor.fullName
                        }));


                        const sendEmailPromises = professorInfo.map(async (professor) => {

                            let email;
                            const getEmail = await UserInfo.findOne({ userId: professor._id }).select('email notificationEmail');

                            if (getEmail.notificationEmail === "") {
                                email = getEmail.email;
                            } else {
                                email = getEmail.notificationEmail;
                            }

                            return sendCommitteeEmails(email, professor.fullName, date, coordinatorInfo[0].room);

                        });

                        await Promise.all(sendEmailPromises);

                        await Promise.all([
                            CoordSchedule.findOneAndUpdate({ coordinatorID: coordinatorId, time: date }, { $inc: { numberOfAttending: matchProfessors.length }, $push: { attending2: { $each: professorInfo } } }),
                            Professors.updateMany({ _id: { $in: professorInfo } }, { $pull: { availSchedule: date }, $push: { appointments: coordinatorInfo[0]._id } })
                        ]);
                    }

                }
            } catch (e) {
                return false;
            }
            return true;
        },
        updateProfilePic: async (_, { ID, ppURL }) => {
            await UserInfo.updateOne({ _id: ID }, { $set: { image: ppURL } });//change ppInfo
            const here = await UserInfo.findById(ID);
            return here.image
        },
        editNotificationEmail: async (_, { ID, email }) => {
            const userId = Mongoose.Types.ObjectId(ID);
            await UserInfo.updateOne({ userId: userId }, { $set: { notificationEmail: email } });
            return true;
        },
        sendEventEmail: async (_, { ID, email, privilege }) => {

            if (ID === undefined || email === undefined) {
                throw new ApolloError("Must send an email");
            }
            try {
                const CID = Mongoose.Types.ObjectId(ID);

                if (privilege === 'coordinator') {
                    const [getCoordinator, getCoordinatorSchedule, getNotificationEmail] = await Promise.all([
                        Coordinator.findOne({ _id: ID }),
                        CoordSchedule.find({ coordinatorID: ID }).sort({ time: 1 }),
                        UserInfo.findOne({ userId: CID }),
                    ])

                    const firstname = getCoordinator.coordinatorFName.charAt(0).toUpperCase() + getCoordinator.coordinatorFName.slice(1);
                    const lastname = getCoordinator.coordinatorLName.charAt(0).toUpperCase() + getCoordinator.coordinatorLName.slice(1);

                    if (getNotificationEmail.notificationEmail === email) {

                        let transport = nodemailer.createTransport({
                            service: "Gmail",
                            host: process.env.EMAIL_USERNAME,
                            secure: false,
                            auth: {
                                user: process.env.EMAIL_USERNAME,
                                pass: process.env.EMAIL_PASSWORD
                            },
                        });

                        const scheduleTableRows = getCoordinatorSchedule.map((schedule) => {
                            const estDate = new Date(schedule.time);
                            return `<tr>
                                        <td>${estDate.toDateString()}</td>
                                        <td>${estDate.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}</td>
                                        <td>${schedule.room}</td>
                                    </tr>`;
                        }).join('');

                        transport.sendMail({
                            from: "group13confirmation@gmail.com",
                            to: email,
                            subject: "mySDSchedule - Upcoming Senior Design2 Presentation Appointments",
                            html: `<h1>Senior Design Appointments </h1>
                            <h1>${firstname} ${lastname}</h1>
                            <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${scheduleTableRows}
                            </tbody>
                        </table>
                            `,
                        })

                    }

                } else if (privilege === 'professor') {
                    const getProfessor = await Professors.findOne({ _id: ID });
                    const firstname = getProfessor.professorFName.charAt(0).toUpperCase() + getProfessor.professorFName.slice(1);
                    const lastname = getProfessor.professorLName.charAt(0).toUpperCase() + getProfessor.professorLName.slice(1);

                    const [getCoordinatorSchedule, getNotificationEmail] = await Promise.all([
                        CoordSchedule.find({ "attending2._id": ID }).select('room time').sort({ time: 1 }),
                        UserInfo.findOne({ userId: CID }),
                    ])

                    if (getNotificationEmail.notificationEmail === email) {

                        let transport = nodemailer.createTransport({
                            service: "Gmail",
                            host: process.env.EMAIL_USERNAME,
                            secure: false,
                            auth: {
                                user: process.env.EMAIL_USERNAME,
                                pass: process.env.EMAIL_PASSWORD
                            },
                        });

                        const scheduleTableRows = getCoordinatorSchedule.map((schedule) => {
                            const estDate = new Date(schedule.time);
                            return `<tr>
                                        <td>${estDate.toDateString()}</td>
                                        <td>${estDate.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}</td>
                                        <td>${schedule.room}</td>
                                    </tr>`;
                        }).join('');

                        transport.sendMail({
                            from: "group13confirmation@gmail.com",
                            to: email,
                            subject: "mySDSchedule - Upcoming Senior Design2 Presentation Appointments",
                            html: `<h1>Senior Design Appointments </h1>
                            <h1>${firstname} ${lastname}</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${scheduleTableRows}
                                </tbody>
                            </table>
                            `,
                        })

                    }
                } else if (privilege === 'student') {

                    const getUser = await Users.findOne({ _id: ID });
                    const firstname = getUser.userFName.charAt(0).toUpperCase() + getUser.userFName.slice(1);
                    const lastname = getUser.userLName.charAt(0).toUpperCase() + getUser.userLName.slice(1);

                    const [getCoordinatorSchedule, getNotificationEmail] = await Promise.all([
                        CoordSchedule.find({ groupId: getUser.groupId }).select('room time').sort({ time: 1 }),
                        UserInfo.findOne({ userId: CID }),
                    ])

                    if (getNotificationEmail.notificationEmail === email) {

                        let transport = nodemailer.createTransport({
                            service: "Gmail",
                            host: process.env.EMAIL_USERNAME,
                            secure: false,
                            auth: {
                                user: process.env.EMAIL_USERNAME,
                                pass: process.env.EMAIL_PASSWORD
                            },
                        });

                        const scheduleTableRows = getCoordinatorSchedule.map((schedule) => {
                            const estDate = new Date(schedule.time);
                            return `<tr>
                                        <td>${estDate.toDateString()}</td>
                                        <td>${estDate.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}</td>
                                        <td>${schedule.room}</td>
                                    </tr>`;
                        }).join('');

                        transport.sendMail({
                            from: "group13confirmation@gmail.com",
                            to: email,
                            subject: "mySDSchedule - Upcoming Senior Design2 Presentation Appointments",
                            html: `<h1>Senior Design Appointments </h1>
                            <h1>${firstname} ${lastname}</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${scheduleTableRows}
                                </tbody>
                            </table>
                            `,
                        })

                    }
                } else { }


                return true;


            } catch (e) {
                throw new ApolloError("Error on Sending Notification Email");
            }
        },
        deleteProfessorAppointment: async (_, { professorId, scheduleId }) => {
            const PID = Mongoose.Types.ObjectId(professorId);
            const SCID = Mongoose.Types.ObjectId(scheduleId);

            let transport = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.EMAIL_USERNAME,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
            });


            async function sendNotificationEmail(email, firstname, lastname, room, convertTime) {
                return new Promise((resolve, reject) => {
                    transport.sendMail({
                        from: "group13confirmation@gmail.com",
                        to: 'colbyx20@gmail.com',
                        subject: "mySDSchedule - Professor Cancelation",
                        html: `<h1>Professor Cancelation - ${firstname} ${lastname} </h1>
                            <p>
                                Room: ${room}
                                Time: ${convertTime.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}
                            </p>
                        `,
                    }, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    })
                })
            }

            try {
                const [group, coordInfo, professorInfo] = await Promise.all([
                    CoordSchedule.findOne({ _id: SCID }).select('groupId'),
                    CoordSchedule.findOneAndUpdate({ _id: SCID }, { $inc: { numberOfAttending: - 1 }, $pull: { attending2: { _id: PID } } }, { new: true }),
                    Professors.findOneAndUpdate({ _id: PID }, { $pull: { appointments: SCID } }, { new: true })
                ]);

                const studentsAffected = await Users.find({ groupId: group.groupId }).select('_id userFName userLName')
                // const coordinator = await Coordinator.findOne({ _id: coordInfo.coordinatorID }).select('coordinatorFName coordinatorLName')

                const email = await UserInfo.findOne({ userId: coordInfo.coordinatorID }).select('email notificationEmail');
                const firstname = professorInfo.professorFName.charAt(0).toUpperCase() + professorInfo.professorFName.slice(1);
                const lastname = professorInfo.professorLName.charAt(0).toUpperCase() + professorInfo.professorLName.slice(1);

                const convertTime = new Date(coordInfo.time)

                let sendTo = '';
                if (email.notificationEmail === "") {
                    sendTo = email.email
                } else {
                    sendTo = email.notificationEmail
                }

                await sendNotificationEmail(sendTo, firstname, lastname, coordInfo.room, convertTime)

                // send another email to all of the students affected by the committee member canceling
                await Promise.all(studentsAffected.map(async (student) => {
                    const getEmail = await UserInfo.findOne({ userId: student._id }).select('email')
                    await sendNotificationEmail(getEmail.email, firstname, lastname, coordInfo.room, convertTime);
                }));

                return true;
            } catch (e) {
                throw new ApolloError("Appointment cannot be Deleted");
            }
        },
        deleteGroup: async (_, { groupId }) => {
            const ID = Mongoose.Types.ObjectId(groupId);
            const findGroup = await Users.find({ groupId: ID })

            for (member of findGroup) {
                await Promise.all([
                    Auth.deleteOne({ userId: member._id }),
                    UserInfo.deleteOne({ userId: member._id })
                ])
                // const wasDeletedAuth = (await Auth.deleteOne({ userId: member._id }))
                // const wasDeletedUserInfo = (await UserInfo.deleteOne({ userId: member._id }))
            }
            await Promise.all([
                Users.deleteMany({ groupId: ID }),
                Group.deleteOne({ _id: ID })
            ])
            // const deleteMebers = await Users.deleteMany({ groupId: groupId })
            // const deleteGroup = await Group.deleteOne({ _id: groupId })

            return true
        },
        deleteAllGroups: async (_, { CID }) => {
            const relevantGroups = await Group.find({ coordinatorId: CID })
            for (group of relevantGroups) {
                const findGroup = await Users.find({ groupId: group._id })
                for (member of findGroup) {
                    await Promise.all([
                        Auth.deleteOne({ userId: member._id }),
                        UserInfo.deleteOne({ userId: member._id })
                    ])
                }
                await Users.deleteMany({ groupId: group._id })
            }
            await Group.deleteMany({ coordinatorId: CID });
            await CoordSchedule.updateMany({ userId: CID }, { $set: { groupId: null } });
            return true
        },
        deleteCoordiantorSchedule: async (_, { CID }) => {
            const ID = Mongoose.Types.ObjectId(CID);

            try {
                const getSchedule = await CoordSchedule.find({ coordiantorID: ID }).select('_id time')

                for (app of getSchedule) {
                    await Professors.updateMany({ appointments: { $in: app._id } }, { $pull: { appointments: app._id } })
                }

                await Group.updateMany({ coordinatorId: ID }, { $set: { appointment: [] } })
                await CoordSchedule.deleteMany({ coordinatorID: ID });

            } catch (error) {
                throw new ApolloError("Cannot Delete Schedule")
            }
        },
        generateGroupAppointment: async (_, { CID }) => {
            const ID = Mongoose.Types.ObjectId(CID);

            const [fullSchedule, scheduleCount, groupCount, groupsAssigned] = await Promise.all([
                CoordSchedule.find({ coordinatorID: ID }).count(),
                CoordSchedule.find({ coordinatorID: ID, groupId: null }).count(),
                Group.find({ coordinatorId: ID, appointment: { $size: 0 } }).count(),
                CoordSchedule.find({ coordinatorID: ID, groupId: { $ne: null } }).count(),
            ])

            if (groupsAssigned === 0 && groupCount === 0) {
                throw new ApolloError("Please Generate your groups")
            }

            if (groupsAssigned === scheduleCount) {
                throw new ApolloError("All Groups have been Assigned")
            }

            if (fullSchedule === 0) {
                throw new ApolloError(`Please create your schedule, you need ${groupCount} appointments `)
            }

            if (fullSchedule < (groupCount + groupsAssigned)) {
                throw new ApolloError(`Please Create ${groupCount - scheduleCount} appointments `)
            }

            const remainder = groupCount - scheduleCount;

            if (fullSchedule < groupCount) {
                throw new ApolloError(`Please create ${remainder} more appointments to Generate your group Appointments`)
            } else {
                for (let count = 0; count < groupCount; count++) {

                    const coordinatorGroup = await Group.aggregate([
                        { $match: { coordinatorId: ID, appointment: { $size: 0 } } },
                        { $sample: { size: 1 } },
                        { $project: { _id: 1 } }
                    ])

                    const coordinatorSchedule = await CoordSchedule.aggregate([
                        { $match: { coordinatorID: ID, groupId: null } },
                        { $sample: { size: 1 } },
                        { $project: { _id: 1 } }
                    ])

                    if (coordinatorGroup) {
                        await Promise.all([
                            CoordSchedule.findOneAndUpdate({ _id: coordinatorSchedule[0]._id }, { $set: { groupId: coordinatorGroup[0]._id } }),
                            Group.findOneAndUpdate({ _id: coordinatorGroup[0]._id }, { $push: { appointment: coordinatorSchedule[0]._id } })
                        ])
                    } else {
                        console.log("something went wrong");
                    }
                }
            }
            return true;
        },
        forgotPassword: async (_, { email }) => {

            const isUser = await UserInfo.findOne({ email: email.toLowerCase() });

            let transport = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.EMAIL_USERNAME,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
            });

            if (isUser) {
                await Auth.findOneAndUpdate({ userId: isUser.userId }, { $set: { isReset: true } })

                transport.sendMail({
                    from: "group13confirmation@gmail.com",
                    to: email,
                    subject: "mySDSchedule - Reset password",
                    html: `<h1>Reset Password </h1>
                        <p>Please click this Link to reset your Password</p>
                        <a href=http://localhost:3000/recovery> Click here</a>
                    `,
                })

                return true;
            } else {
                return false;
            }
        },
        restPasswordPreLogin: async (_, { email, password, confirmPassword }) => {

            const capitalRegex = /[A-Za-z]/;
            const numberRegex = /[0-9]/;
            const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

            // encrypt new password and set to user.
            if (password !== confirmPassword) {
                throw new ApolloError("Passwords Do Not Match!");
            }

            if (!capitalRegex.test(password) || !numberRegex.test(password) || !specialRegex.test(password)) {
                throw new ApolloError("Password doesn't contain all requiremements")
            }

            const isValidReset = await UserInfo.findOne({ email: email })
            const isValidAuthReset = await Auth.findOne({ userId: isValidReset.userId })
            const encryptedPassword = await bcrypt.hash(password, 10);

            if (isValidReset && isValidAuthReset.isReset === true) {
                try {
                    const setNewPassword = await Auth.findOneAndUpdate({ userId: isValidReset.userId }, { $set: { password: encryptedPassword, isReset: false } });
                    setNewPassword.save();

                } catch (e) {
                    throw new ApolloError("Email is Invalid");
                }

                return true;
            } else {
                return false;
            }
        },
        updateProfessorAvailSchedule: async (_, { PID, time }) => {
            const ID = Mongoose.Types.ObjectId(PID);

            const date = new Date(time);
            date.setUTCHours(date.getUTCHours() - 4);
            const utcDate = new Date(date.toISOString());

            try {
                await Professors.updateOne({ _id: ID }, { $pull: { availSchedule: utcDate } })
            } catch (error) {
                throw new ApolloError("Error on Deleting Professors Avail Schedule");
            }

            return true;
        }
    }
}


module.exports = resolvers;