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
            return await Professors.findById(ID);
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
            return await Group.find({ coordinatorId: CID });
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
        getAllCoordinatorSchedule: async (_, { ID }) => {

            const PID = Mongoose.Types.ObjectId(ID)
            const getUser = await Professors.findOne({ _id: PID }).select('availSchedule');

            const availSchedule = getUser.availSchedule.map(date => new Date(date));

            const user = await CoordSchedule.aggregate([
                { $match: { time: { $nin: availSchedule } } },
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
            console.log(getUser);

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
            if (password !== confirmpassword) {
                throw new ApolloError("Passwords Do Not Match");
            }
            if (password === "" || firstname === "" || lastname === "" || email === "") {
                throw new ApolloError("Please fill in all of the Boxes!");
            }

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
        createAccounts: async (_, { CID, groupNumber, groupName, userLogin, password, firstname, lastname, role }) => {

            if (groupNumber === undefined || groupName === undefined || userLogin === undefined || password === undefined || firstname === undefined || lastname === undefined || role === undefined) {
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

                await Promise.all([student.save(), authStudent.save(), studentInfo.save()])

                return true;
            }
        },
        registerUser: async (_, { registerInput: { firstname, lastname, email, password, confirmpassword } }) => {

            if (password !== confirmpassword) {
                throw new ApolloError("Passwords Do Not Match");
            }
            if (password === "" || firstname === "" || lastname === "" || email === "") {
                throw new ApolloError("Please fill in all of the Boxes!");
            }
            // See if an old user or Professor exists with Email attempting to Register
            // const oldUser = await Users.findOne({email});
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

            // transport.sendMail({
            //     from: "group13confirmation@gmail.com",
            //     to: email,
            //     subject: "mySDSchedule - Please Confirm Your Account",
            //     html: `<h1>Email Confirmation</h1>
            //     <h2>Hello ${firstname}</h2>
            //     <p>Thank you for Registering!</p>
            //     <p>To activate your account please click on the link below.</p>

            //     <p>Please Check you Junk/Spam folder</p>
            //     </div>`,
            //     //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
            // })

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
            const userInfo = await UserInfo.findOne({ email: email }).populate("userId");
            const user = await Users.findOne({ _id: userInfo.userId });

            if (!userInfo) {
                throw new Error("User not found");
            }

            const authUser = await Auth.findOne({ userId: userInfo.userId._id }).select("userId password confirm token");

            if (email) {
                switch (userInfo.privilege) {
                    case 'professor':
                        return await Login(userInfo, authUser, authUser.confirm);
                    case 'student':
                        return await Login(userInfo, authUser, authUser.confirm);
                    case 'coordinator':
                        return await Login(userInfo, authUser, authUser.confirm);
                    default:
                        console.log("err");
                }
            }

            async function Login(userInfo, authUser, confirmedUser) {
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
                    //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                })
            } catch (e) {
                // email is not valid 
                throw new ApolloError("Email IS Not Valid");
            }

        },
        updatePassword: async (_, { ID, oldPassword, newPassword, confirmedPassword }) => {
            const userId = Mongoose.Types.ObjectId(ID);

            if (newPassword !== confirmedPassword) {
                throw new ApolloError("New Passwords Do Not Match!");
            }

            if (newPassword.length < 4) {
                throw new ApolloError("New Password is too short");
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

            // encrypt new password and set to user.
            if (password !== confirmPassword) {
                throw new ApolloError("Passwords Do Not Match!");
            }
            try {

                const [encryptedPassword, finduser] = await Promise.all([
                    bcrypt.hash(password, 10),
                    UserInfo.findOne({ email: email })
                ])

                // set password from user 
                const setNewPassword = await Auth.findOneAndUpdate({ userId: finduser.userId }, { password: encryptedPassword, confirmpassword: encryptedPassword });

                setNewPassword.save();


            } catch (e) {
                throw new ApolloError("Email is Invalid");
            }
            return true
        },
        createProfessorSchedule: async (_, { ID, privilege, professorScheduleInput: { time } }) => {

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
                            room: Room,
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
                        //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
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
        cancelAppointment: async (_, { cancelation: { CancelerID, ApID, reason } }) => {// passes the ID of the person canceling and the appointment being canceled
            const canceler = await UserInfo.findOne({ userId: CancelerID });//find out whose canceling
            const appointment = await CoordSchedule.findOne({ _id: ApID });//find the information on the appoinment being canceled
            //alternative call with time and CID instead
            let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });
            //const appointment= await CoordSchedule.find({time:time,coordinatorID:CID})
            //Professor on a side note for professors the reason flag should be false
            if (canceler.privilege == 'professor')//note for proffs this isnt a deletion
            {
                time = new Date(appointment.time);
                const who = await Professors.updateOne({ _id: canceler._id }, { $pull: { appointments: appointment._id } });
                const group = await Group.findOne({ _id: appointment.groupId });
                await CoordSchedule.updateOne({ _id: ApID }, { $pull: { attending: CancelerID }, $inc: { numberOfAttending: -1 } })//remove prof from attending. CAN WE USE CANCELER.USERID FOR THIS
                const lead = await Users.find({ coordinatorId: appointment.coordinatorID, groupNumber: group.groupNumber });
                for (x of lead) {
                    const notify = await UserInfo.find({ userId: lead._id });
                    transport.sendMail({
                        from: "SDSNotifier@gmail.com",
                        to: notify.notificationEmail,
                        subject: "A Senior Design final Review has been schedule",
                        html: `<h1>Professor ${who.lastname} cancelled your appt at ${time} in room ${appointment.room}</h2>
                        <p>Please reschedule a new proffessor</p>
                        </div>`,
                        //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                    })
                }
                return {
                    Group: group._id,
                    Time: time,
                    Room: appointment.room
                }
            }
            //coordinator
            else if (canceler.privilege == 'coordinator') {

                if (reason == "Group")// cancel on groups behalf
                {
                    if (appointment.attending2.length > 0)//Group had professors
                    {
                        for (prof of appointment.attending2)//send email and update
                        {
                            const effected = await UserInfo.findOne({ userId: prof._id });
                            let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });
                            transport.sendMail({
                                from: "SDSNotifier@gmail.com",
                                to: effected.notificationEmail,
                                subject: "A Senior Design final Review has been canceled",
                                html: `<h1>Demo Notin appointment a ${appointment.time} in room ${appointment.room}</h2>
                                <p>If you need to cancel please get on the app or visit our website to do so  </p>
                                </div>`,
                                //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                            })
                            await Professors.updateOne({ _id: prof._id }, { $push: { availSchedule: chrono }, $pull: { appointments: appointment._id } })//return there  availability
                        }
                    }
                    await CoordSchedule.updateOne({ _id: ApID }, {
                        $unset: { groupId: "" },
                        $set: { attending2: [] },
                        $set: { numberOfAttending: 0 }
                    })
                }
                else if (reason == "Personal")//cancel for personalreasons
                {
                    if (appointment.groupId)//Group already claimed it
                    {
                        const group = await Group.findOne({ _id: appointment.groupId });
                        const members = await Users.findOne({ coordinatorId: appointment.coordinatorID, groupNumber: group.groupNumber });
                        for (user of members) {
                            const notify = await UserInfo.find({ userId: user._id });
                            transport.sendMail({
                                from: "SDSNotifier@gmail.com",
                                to: notify.notificationEmail,
                                subject: "A Senior Design final Review has been schedule",
                                html: `<h1>your Coordinator cancelled your appt at ${time} in room ${appointment.room}</h2>
                                       <p>Please reschedule a new proffessor</p>
                                       </div>`,
                                //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                            })
                        }
                    }
                    if (appointment.numberOfAttending > 0)//Group had professors
                    {
                        for (prof of appointment.attending2)//send email and update
                        {
                            const profe = await UserInfo.findOne({ userId: prof._id });
                            let transport = nodemailer.createTransport({ service: "Gmail", auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }, });
                            transport.sendMail({
                                from: "SDSNotifier@gmail.com",
                                to: profe.email,
                                subject: "A Senior Design final Review has been canceled",
                                html: `<h1>A Demo at ${appointment.time} in room ${appointment.room} has been canceled</h2>
                                       <p>Thank you for your understanding</p>
                                       </div>`,
                                //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                            })
                            await Professors.updateOne({ _id: prof }, { $push: { availSchedule: chrono }, $pull: { appointments: appointment._id } })//return there  availability
                        }

                    }
                    await CoordSchedule.deleteOne({ _id: ApID })//delete Appointment
                }
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
        RandomlySelectProfessorsToAGroup: async (_, { CID }) => {

            const coordinatorId = Mongoose.Types.ObjectId(CID)
            const MAX_APPOINTMENTS = 3;

            // grab # of appointments without at least 3 attending.
            const numAttending = await CoordSchedule.find().count();

            try {

                for (let counter = 0; counter < numAttending; counter++) {
                    const coordinatorInfo = await CoordSchedule.findOne(
                        { coordinatorID: coordinatorId, numberOfAttending: { $lt: 3 } },
                        { coordinatorID: 1, attending2: 1, time: 1, numberOfAttending: 1 });

                    const date = new Date(coordinatorInfo.time);

                    const matchProfessors = await Professors.aggregate([
                        { $match: { availSchedule: date } },
                        { $sample: { size: MAX_APPOINTMENTS - coordinatorInfo.numberOfAttending } },
                        { $project: { _id: 1, fullName: { $concat: ['$professorFName', ' ', '$professorLName'] } } }
                    ])

                    if (matchProfessors) {
                        const professorInfo = matchProfessors.map((professor) => ({
                            _id: professor._id,
                            fullName: professor.fullName
                        }));

                        await Promise.all([
                            CoordSchedule.findOneAndUpdate({ coordinatorID: coordinatorId, time: date }, { $inc: { numberOfAttending: matchProfessors.length }, $push: { attending2: { $each: professorInfo } } }),
                            Professors.updateMany({ _id: { $in: professorInfo } }, { $pull: { availSchedule: date }, $push: { appointments: coordinatorInfo._id } })
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
                        CoordSchedule.find({ coordinatorID: ID }),
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
                            //<a href=https://cop4331-group13.herokuapp.com/api/confirm?confirmationcode=${token}> Click here</a>
                        })

                    }

                } else if (privilege === 'student') {

                }
                // const getNotificationEmail = await UserInfo.findOne({ userId: CID });

                return true;


            } catch (e) {
                throw new ApolloError("Error on Sending Notification Email");
            }
        },
        deleteProfessorAppointment: async (_, { professorId, scheduleId }) => {
            const PID = Mongoose.Types.ObjectId(professorId);
            const SCID = Mongoose.Types.ObjectId(scheduleId);

            try {
                await Promise.all([
                    CoordSchedule.findOneAndUpdate({ _id: SCID }, { $inc: { numberOfAttending: -1 }, $pull: { attending2: { _id: PID } } }, { new: true }),
                    Professors.findOneAndUpdate({ _id: PID }, { $pull: { appointments: SCID } }, { new: true })
                ]);
                return true;
            } catch (e) {
                throw new ApolloError("Appointment cannot be Deleted");
            }
        },
        deleteGroup: async (_, { groupId }) => {
            const findGroup = await Users.find({ groupId: groupId })
            for (member of findGroup) {
                await Promise.all([
                    Auth.deleteOne({ userId: member._id }),
                    UserInfo.deleteOne({ userId: member._id })
                ])
                // const wasDeletedAuth = (await Auth.deleteOne({ userId: member._id }))
                // const wasDeletedUserInfo = (await UserInfo.deleteOne({ userId: member._id }))
            }
            await Promise.all([
                Users.deleteMany({ groupId: groupId }),
                Group.deleteOne({ _id: groupId })
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
            await Group.deleteMany({ coordinatorId: CID })
            return true
        },
        generateGroupAppointment: async (_, { CID }) => {
            const ID = Mongoose.Types.ObjectId(CID);

            const [scheduleCount, groupCount] = await Promise.all([
                CoordSchedule.find({ coordinatorID: ID, groupId: null }).count(),
                Group.find({ coordinatorId: ID, appointment: { $size: 0 } }).count()
            ])

            if (groupCount === 0 || scheduleCount === 0) {
                throw new ApolloError("Please create your Groups or Add Appointment Times")
            }

            const remainder = groupCount - scheduleCount;

            if (scheduleCount < groupCount) {
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
        }

    }
}


module.exports = resolvers;



// Delete users and authUsers.
// db.users.aggregate([
//     {
//       $lookup: {
//         from: "information",
//         localField: "_id",
//         foreignField: "user_id",
//         as: "user_info"
//       }
//     },
//     {
//       $match: {
//         _id: { $exists: true }
//       }
//     },
//     {
//       $unwind: "$user_info"
//     },
//     {
//       $project: {
//         user_id: "$_id",
//         info_id: "$user_info._id"
//       }
//     }
//   ]).forEach(function(doc) {
//     db.information.deleteOne({ _id: doc.info_id });
//     db.users.deleteOne({ _id: doc.user_id });
//   });